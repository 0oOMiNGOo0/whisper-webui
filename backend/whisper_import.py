# pip install -U openai-whisper
# pip install Flask eventlet
# pip install flask_cors

#%%writefile app.py

import asyncio
import eventlet
from flask_cors import CORS
from flask_socketio import SocketIO
from flask import Flask, jsonify, request, send_file

import sys
import tqdm
import threading
from typing import Union

import os, glob
import whisper
import zipfile
from moviepy.editor import VideoFileClip
import numpy as np
from whisper.utils import get_writer
from pathlib import Path

app = Flask(__name__)
sio = SocketIO(app, cors_allowed_origins='*')
CORS(app)


class ProgressListener:
    def on_progress(self, current: Union[int, float], total: Union[int, float]):
        self.total = total

    def on_finished(self):
        pass

class _CustomProgressBar(tqdm.tqdm):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._current = self.n  # Set the initial value

    def update(self, n):
        super().update(n)
        # Because the progress bar might be disabled, we need to manually update the progress
        self._current += n

        # Inform listeners
        listeners = _get_thread_local_listeners()

        for listener in listeners:
            listener.on_progress(self._current, self.total)

_thread_local = threading.local()

def _get_thread_local_listeners():
    if not hasattr(_thread_local, 'listeners'):
        _thread_local.listeners = []
    return _thread_local.listeners

_hooked = False

def init_progress_hook():
    global _hooked

    if _hooked:
        return

    # Inject into tqdm.tqdm of Whisper, so we can see progress
    import whisper.transcribe
    transcribe_module = sys.modules['whisper.transcribe']
    transcribe_module.tqdm.tqdm = _CustomProgressBar
    _hooked = True

def register_thread_local_progress_listener(progress_listener: ProgressListener):
    # This is a workaround for the fact that the progress bar is not exposed in the API
    init_progress_hook()

    listeners = _get_thread_local_listeners()
    listeners.append(progress_listener)

def unregister_thread_local_progress_listener(progress_listener: ProgressListener):
    listeners = _get_thread_local_listeners()

    if progress_listener in listeners:
        listeners.remove(progress_listener)

class ProgressListenerHandle:
    def __init__(self, listener: ProgressListener):
        self.listener = listener

    def __enter__(self):
        register_thread_local_progress_listener(self.listener)

    def __exit__(self, exc_type, exc_val, exc_tb):
        unregister_thread_local_progress_listener(self.listener)

        if exc_type is None:
            self.listener.on_finished()

def create_progress_listener_handle(progress_listener: ProgressListener):
    return ProgressListenerHandle(progress_listener)


class PrintingProgressListener:
    def on_progress(self, current: Union[int, float], total: Union[int, float]):
        print(f"Progress: {current}/{total}")
        sio.send({'current':current, 'total':total})
        sio.sleep(0)
    def on_finished(self):
      print("Finished")

@app.route('/uploaded', methods=['POST'])
def GETC():
    params = request.form
    content = request.files['uploadFile']
    content.save('files/' + params['fileName'])
    file_list = glob.glob('files/*')
    print(file_list)
    return jsonify({'test': 'ok'})

@sio.on('uploaded')
def handle_message(data):
    print(data)
    file_list = glob.glob('files/*')
    for file in file_list:
        video = VideoFileClip(file)
        audio = video.audio
        audio.write_audiofile('files/audio.wav')
        os.remove(file)

        model = whisper.load_model(data['selectedModel'])
        fromlanguage = data['selectedFromLanguage']
        tolanguage = data['selectedToLanguage']

        options = dict(language=fromlanguage, word_timestamps=True, verbose=False)

        transcribe_options = dict(task="transcribe", **options)
        translate_options = dict(task="translate", **options)
            
        if fromlanguage != 'en' and tolanguage == 'en':
            with create_progress_listener_handle(PrintingProgressListener()) as listener:
                result = model.transcribe('files/audio.wav', **translate_options)
        elif fromlanguage != 'en' and tolanguage != 'en' and fromlanguage != tolanguage:
            with create_progress_listener_handle(PrintingProgressListener()) as listener:
                result = model.transcribe('files/audio.wav', **translate_options)
        else:
            with create_progress_listener_handle(PrintingProgressListener()) as listener:
                result = model.transcribe('files/audio.wav', **transcribe_options)
        
        os.remove('files/audio.wav')
        options = {
                    'max_line_width': None,
                    'max_line_count': None,
                    'highlight_words': False
        }

        output_directory = Path(f'public/output/{file.split("/")[1]}')
        srt_writer = get_writer("srt", 'public/output')
        srt_writer(result, output_directory, options)
        txt_writer = get_writer("txt", 'public/output')
        txt_writer(result, output_directory, options)

    output_paths = glob.glob('public/output/*')
    sio.emit('downloads', output_paths)
    return

sio.run(app, port=5050, debug=True)
# %%

# pip install -U openai-whisper
# pip install Flask eventlet
# pip install flask_cors

#%%writefile app.py

import asyncio
from flask_cors import CORS
from flask_socketio import SocketIO
from flask import Flask, jsonify, request, send_file

import sys
import tqdm
import threading
from typing import Union

import os
import whisper
import zipfile
from moviepy.editor import VideoFileClip
import numpy as np
from whisper.utils import get_writer
from pathlib import Path


app = Flask(__name__)
sio = SocketIO(app, cors_allowed_origins='*')
CORS(app)


@sio.on('uploaded')
def handle_message(data):
    print(request.data)
    print(request)
    print(request.form)
    print(request.get_data)

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


def asdf():
    sio.send("asds")
    print("하하")

class PrintingProgressListener:
    def on_progress(self, current: Union[int, float], total: Union[int, float]):
        print(f"Progress: {current}/{total}")
        asdf()
      #socket
    def on_finished(self):
      print("Finished")

@app.route('/', methods=['POST'])
def GETB():
    params = request.form
    content = request.files['uploadFile']
    content.save('video.mp4')
    video = VideoFileClip('video.mp4')
    audio = video.audio
    audio.write_audiofile('audio.wav')
    os.remove('video.mp4')

    model = whisper.load_model(params['selectedModel'])
    fromlanguage = params['selectedFromLanguage']
    tolanguage = params['selectedToLanguage']

    options = dict(language=fromlanguage, word_timestamps=True, verbose=False)

    transcribe_options = dict(task="transcribe", **options)
    translate_options = dict(task="translate", **options)

    if fromlanguage != 'en' and tolanguage == 'en':
      with create_progress_listener_handle(PrintingProgressListener()) as listener:
        result = model.transcribe('audio.wav', **translate_options)
    elif fromlanguage != 'en' and tolanguage != 'en' and fromlanguage != tolanguage:
      with create_progress_listener_handle(PrintingProgressListener()) as listener:
        result = model.transcribe('audio.wav', **translate_options)
    else:
      with create_progress_listener_handle(PrintingProgressListener()) as listener:
        result = model.transcribe('audio.wav', **transcribe_options)
    
    # file_path = Path('audio.wav')
    # txt_path = file_path.with_suffix(".txt")
    # with open(txt_path, "w", encoding="utf-8") as txt:
    #     txt.write(result["text"])

    # output_directory = file_path.parent
    # srt_writer = get_writer("srt", output_directory)
    # srt_writer(result, str(file_path.stem))

    # vtt_writer = get_writer("vtt", output_directory)
    # vtt_writer(result, str(file_path.stem))

    # tsv_writer = get_writer("tsv", output_directory)
    # tsv_writer(result, str(file_path.stem))

    # file_paths = ['/content/file.srt','/content/file.tsv','/content/file.txt','/content/file.vtt']

    # zip_filename = 'downloaded_files.zip'
    # with zipfile.ZipFile(zip_filename, 'w', zipfile.ZIP_DEFLATED) as zipf:
    #     for file_path in file_paths:
    #         zipf.write(file_path, os.path.basename(file_path))

    # return send_file('/content/file.srt', as_attachment=True)

    os.remove('audio.wav')
    return jsonify({ "test": 123 })

sio.run(app, port=5050, debug=True)
# %%

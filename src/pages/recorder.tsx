import React, { useState } from 'react';
import { ReactMic } from 'react-mic';

function Recorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState(null);

  const startRecording = () => {
    setIsRecording(true);
  };

  const stopRecording = () => {
    setIsRecording(false);
  };

  const onData = (recordedData: any) => {
    console.log('Recording data:', recordedData);
  };

  const onStop = (recordedBlob: React.SetStateAction<null>) => {
    console.log('Recording stopped:', recordedBlob);
    setRecordedBlob(recordedBlob);
  };

  return (
    <div>
      <h2>Voice Recorder</h2>
      <button onClick={startRecording} disabled={isRecording}>
        Start Recording
      </button>
      <button onClick={stopRecording} disabled={!isRecording}>
        Stop Recording
      </button>
      {recordedBlob && (
        <div>
          <h3>Recorded Audio</h3>
          <audio controls src={recordedBlob.blobURL}></audio>
        </div>
      )}
      <ReactMic
        record={isRecording}
        onData={onData}
        onStop={onStop}
        strokeColor='#000000'
      />
    </div>
  );
}

export default Recorder;

import React from 'react';

const ResultDisplay = ({ result }) => {
  console.log('Result Data in Display:', result); 

  if (!result) return <p>No result data available</p>;

  
  const isVideoResult = result.scenes || result.audio_transcription;

  
  const {
    video_id = '',
    scenes = [],
    detected_objects: objects = [], 
    activities = [],
    audio_transcription = '',  
    audio_analysis = {},
    errors = []
  } = isVideoResult ? result : {};

  
  const {
    labels = [],
    summary = '',
    metadata = {}
  } = !isVideoResult ? result : {};

  const dominantColor = metadata.dominant_color || '';
  const { dominant_sounds = [], tone = '' } = audio_analysis;

  return (
    <div className="result-container">
      <h2>Processing Result</h2>

      {isVideoResult && (
        <>
          {video_id && (
            <div>
              <h3>Video ID:</h3>
              <p>{video_id}</p>
            </div>
          )}

          {scenes.length > 0 && (
            <div>
              <h3>Scene Breakdown:</h3>
              {scenes.map((scene, index) => (
                <div key={index}>
                  <p><strong>Time:</strong> {scene.start_time} - {scene.end_time}</p>
                  <p><strong>Description:</strong> {scene.description}</p>
                </div>
              ))}
            </div>
          )}

          {objects.length > 0 && (
            <div>
              <h3>Detected Objects:</h3>
              {objects.map((object, index) => (
                <p key={index}><strong>Object:</strong> {object}</p>
              ))}
            </div>
          )}

          {activities.length > 0 && (
            <div>
              <h3>Activities:</h3>
              {activities.map((activity, index) => (
                <p key={index}><strong>Activity:</strong> {activity}</p>
              ))}
            </div>
          )}

          {audio_transcription && (
            <div>
              <h3>Audio Transcription:</h3>
              <p>{audio_transcription}</p>
            </div>
          )}

          {dominant_sounds.length > 0 && (
            <div>
              <h3>Dominant Sounds:</h3>
              {dominant_sounds.map((sound, index) => (
                <p key={index}>{sound}</p>
              ))}
            </div>
          )}

          {tone && (
            <div>
              <h3>Tone:</h3>
              <p>{tone}</p>
            </div>
          )}

          {errors.length > 0 && (
            <div>
              <h3>Errors:</h3>
              {errors.map((error, index) => (
                <p key={index}>{error}</p>
              ))}
            </div>
          )}
        </>
      )}

      {!isVideoResult && (
        <>
          {summary && (
            <div>
              <h3>Summary:</h3>
              <p>{summary}</p>
            </div>
          )}

          {dominantColor && (
            <div>
              <h3>Dominant Color:</h3>
              <p>{dominantColor}</p>
            </div>
          )}

          {labels.length > 0 && (
            <div>
              <h3>Labels:</h3>
              {labels.map((label, index) => (
                <p key={index} className="highlight">{label}</p>
              ))}
            </div>
          )}

          {objects.length > 0 && (
            <div>
              <h3>Detected Objects:</h3>
              {objects.map((object, index) => (
                <p key={index}><strong className="highlight">Object:</strong> {object}</p>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ResultDisplay;

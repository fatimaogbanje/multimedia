import React, { useState } from 'react'; 
import FileUpload from './components/FileUpload';
import ResultDisplay from './components/ResultDisplay';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';


const API_KEY = '';

function App() {
  const [processingResult, setProcessingResult] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [filePreview, setFilePreview] = useState(null);
  const [fileType, setFileType] = useState('');

  const handleFileProcess = async (file, type) => {
    setProcessing(true);
    setProcessingResult(null);

    const fileUrl = URL.createObjectURL(file);
    console.log('Generated file URL:', fileUrl);

    const isVideo = file.type.startsWith('video/');
    const isImage = file.type.startsWith('image/');
    if (isVideo) {
      setFileType('video');
    } else if (isImage) {
      setFileType('image');
    } else {
      toast.error('Unsupported file format');
      setProcessing(false);
      return;
    }

    setFilePreview(fileUrl);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      const base64File = reader.result.split(',')[1];

      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              contents: [
                {
                  role: 'user',
                  parts: [
                    {
                      text: `Analyze the following ${type}: ${file.name}`,
                    },
                  ],
                },
              ],
              systemInstruction: {
                role: 'user',
                parts: [
                  {
                    text: `Project Title: API for Analyzing Images and Videos for Content Detection

Description: I am developing a project that requires an API capable of analyzing both images and videos and providing detailed information about their content. Specifically, when users upload an image or video, I need the API to return comprehensive information such as detected objects, scenes, labels, and other metadata related to the file’s content. Additionally, for images, the API should provide a descriptive summary or narrative of the image’s content. For videos, the API should include transcription of spoken content or dialogue and provide insights into the audio content.

Request Details:

Required API Functionality:

Image Analysis:

- Detect objects in the image (e.g., animals, vehicles, buildings).
- Generate labels or keywords that describe the image’s content.
- Provide a descriptive summary or narrative about the image’s content, if available.
- Provide additional metadata, such as dominant colors or scenes.

Video Analysis:

- Detect key scenes and objects within the video.
- Identify activities or actions taking place in the video.
- Provide timestamps for detected objects or events within the video, if possible.
- Transcribe spoken content or dialogue within the video, if available.
- Analyze audio content for additional insights, such as detecting specific sounds or determining the tone of the dialogue.

File Specifications:

- Supported image formats: .jpg, .png
- Supported video formats: .mp4, .avi
- Maximum file size: Up to 50 MB

Processing Output:

The API should return structured data (JSON or similar format) that includes:

For images:
- A list of detected objects, labels, relevant metadata, and a descriptive summary or narrative.

For videos:
- Scene breakdown, detected objects, activities, timestamps, and transcription of spoken content.
- Audio analysis results, including transcription and any significant audio events or sounds detected in the video.

Provide real-time feedback on the status of the upload and processing.

Security & Performance Requirements:

- Secure transmission of files for processing.
- Fast response times (processing feedback within 5 seconds of submission).
- Graceful error handling with meaningful error messages.

Objective: The goal is to receive detailed, content-based information about any uploaded images or videos through the API. I need access to API documentation, authentication keys, and example requests/responses to integrate this capability into a beginner-friendly web app.`,
                  }
                ]
              },
              generationConfig: {
                temperature: 1,
                topK: 64,
                topP: 0.95,
                maxOutputTokens: 8192,
                responseMimeType: 'application/json',
              },
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log('API Response:', data);

          const resultText = data.candidates[0]?.content?.parts[0]?.text;
          console.log('Result Text:', resultText);

          if (resultText) {
            try {
              const resultData = JSON.parse(resultText);
              console.log('Parsed Result Data:', resultData);
              setProcessingResult(resultData); // Use updated result structure
            } catch (error) {
              console.error('Error parsing JSON:', error);
              toast.error('Error parsing result data.');
            }
          } else {
            toast.error('No content received from API.');
          }
        } else {
          throw new Error('Error processing file.');
        }
      } catch (error) {
        console.error('Error fetching result:', error);
        toast.error('Failed to communicate with the API.');
      } finally {
        setProcessing(false);
      }
    };
  };

  return (
    <div className="App">
      <h1>Multimedia </h1>
      <FileUpload onFileUpload={handleFileProcess} processing={processing} />

      {filePreview ? (
        <div>
          {fileType === 'video' ? (
            <video
              src={filePreview}
              controls
              width="600"
              onError={(e) => {
                console.error('Error loading video:', e);
                toast.error('Failed to load video.');
              }}
            >
              Your browser does not support the video tag.
            </video>
          ) : fileType === 'image' ? (
            <img
              src={filePreview}
              alt="Uploaded Preview"
              width="400"
              onError={(e) => {
                console.error('Error loading image:', e);
                toast.error('Failed to load image.');
              }}
            />
          ) : (
            <p>Unsupported file type</p>
          )}
        </div>
      ) : (
        <p>Loading...</p>
      )}

      {processingResult && (
        <>
          <ResultDisplay result={processingResult} />
          {console.log("Processing Result Data:", processingResult)}
        </>
      )}

      <ToastContainer />
    </div>
  );
}

export default App;

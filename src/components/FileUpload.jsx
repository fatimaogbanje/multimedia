import React, { useState } from 'react';
import { toast } from 'react-toastify';
import './file.css';

const FileUpload = ({ onFileUpload, processing }) => {
  const [file, setFile] = useState(null);
  const [fileType, setFileType] = useState('image'); 

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
      const fileMimeType = selectedFile.type;
      console.log("Detected MIME type:", fileMimeType);  

      
      if (fileMimeType.includes('image')) {
        setFileType('image');
      } else if (fileMimeType.includes('video')) {
        setFileType('video');
      } else if (fileMimeType === 'application/pdf') {
        setFileType('pdf');
      } else if (
        fileMimeType.includes('spreadsheet') ||
        fileMimeType.includes('excel') ||
        fileMimeType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        fileMimeType === 'application/vnd.ms-excel' ||
        fileMimeType === 'application/vnd.oasis.opendocument.spreadsheet'
      ) {
        setFileType('excel');
      } else {
        setFileType('unknown');
      }

      console.log("Determined file type:", fileType);  
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!file) {
      toast.error('Please upload a file.');
      return;
    }

    console.log("Selected file:", file);
    console.log("Detected file type (MIME):", file.type);
    console.log("Chosen fileType:", fileType);

    
    const validImageTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
    const validVideoTypes = ['video/mp4', 'video/avi', 'video/mpeg'];
    const validPdfTypes = ['application/pdf'];
    const validExcelTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'application/vnd.oasis.opendocument.spreadsheet',
    ];

    
    const isValidImage = validImageTypes.includes(file.type);
    const isValidVideo = validVideoTypes.includes(file.type);
    const isValidPdf = validPdfTypes.includes(file.type);
    const isValidExcel = validExcelTypes.includes(file.type);

    console.log("Validation Results - Image:", isValidImage);
    console.log("Validation Results - Video:", isValidVideo);
    console.log("Validation Results - PDF:", isValidPdf);
    console.log("Validation Results - Excel:", isValidExcel);

    if (
      !(
        (fileType === 'image' && isValidImage) ||
        (fileType === 'video' && isValidVideo) ||
        (fileType === 'pdf' && isValidPdf) ||
        (fileType === 'excel' && isValidExcel)
      )
    ) {
      toast.error('Invalid file type. Please upload a valid image, video, PDF, or Excel file.');
      return;
    }

    
    if (file.size > 50 * 1024 * 1024) {
      toast.error('File size exceeds 50 MB.');
      return;
    }

    
    onFileUpload(file, fileType);
  };

  return (
    <form onSubmit={handleSubmit} className="file-upload-form">
      <div>
        <label>Select File Type: </label>
        <select onChange={(e) => setFileType(e.target.value)} value={fileType}>
          <option value="image">Image</option>
          <option value="video">Video</option>
          <option value="pdf">PDF</option>
          <option value="excel">Excel</option>
        </select>
      </div>
      <div>
        <input type="file" onChange={handleFileChange} />
      </div>

      <button type="submit" disabled={processing}>
        {processing ? 'Processing...' : 'Upload and Process'}
      </button>
    </form>
  );
};

export default FileUpload;

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { db } from '../firebase/firebase';
import { doc, updateDoc, serverTimestamp, collection, addDoc } from 'firebase/firestore';


function DesignUpload() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const participantId = location.state?.participantId;
  const docId = location.state?.docId;

  useEffect(() => {
    if (!participantId) {
      navigate('/', { replace: true });
    }
  }, [participantId, navigate]);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }
    setIsLoading(true);

    try {
      const base64Image = await convertToBase64(file);
      const response = await axios.post('http://localhost:8000/api/upload/', {
        image: base64Image,
        participant: participantId
      });

      if (response.data && response.data.feedback) {
        // Update Firestore with design URL
        const participantDoc = doc(db, 'Participants', docId);
        await updateDoc(participantDoc, {
          Design: response.data.image_url,
          Uploaded_At: serverTimestamp()
        });
        // Add initial feedback to Firestore
        await addDoc(collection(db, `Participants/${docId}/ChatLogs`),
          {
            Message: response.data.feedback,
            Timestamp: serverTimestamp(),
            Sender: "Feedstack"
          });

        navigate('/feedback', {
          state: {
            feedback: response.data.feedback,
            participantId,
            imageUrl: response.data.image_url,
            docId
          }
        });
      } else {
        alert('Upload successful, but no feedback was generated. Please try again.');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file: ' + (error.response?.data?.error || error.message));
    } finally {
      setIsLoading(false);
    }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  return (
    <div className="design-upload-container">
      <div className="upload-card">
        <h1>Upload Your Design</h1>
        <p>Share your creative work and get AI-powered feedback</p>
        <form onSubmit={handleSubmit}>
          <div className="file-input-container">
            <input
              type="file"
              onChange={handleFileChange}
              accept=".png,.jpg,.jpeg,.pdf"
              id="file-input"
            />
            <label htmlFor="file-input" className="file-input-label">
              {file ? file.name : 'Choose a file'}
            </label>
          </div>
          {preview && (
            <div className="image-preview">
              <img src={preview} alt="Preview" />
            </div>
          )}
          <button type="submit" disabled={!file || isLoading}>
            {isLoading ? 'Uploading...' : 'Get Feedback'}
          </button>
        </form>
      </div>
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <p>Analyzing your design...</p>
        </div>
      )}
    </div>
  );
}

export default DesignUpload;
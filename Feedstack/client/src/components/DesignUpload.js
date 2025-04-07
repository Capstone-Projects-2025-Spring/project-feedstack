import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import API_URL from '../config';

function DesignUpload() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const participantId = location.state?.participantId || 'temp-user';
  const docId = location.state?.docId || 'temp-doc-id';

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

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file); // This creates properly formatted data:image/type;base64,
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }
    
    setIsLoading(true);
    setError(null);

    try {
      console.log("Sending upload request to:", `${API_URL}/upload/`);
      console.log("With participant ID:", participantId);
      
      const base64Image = await convertToBase64(file);
      console.log("Image format:", base64Image.substring(0, 50) + "..."); // Log just the beginning
      
      const requestBody = JSON.stringify({
        image: base64Image,
        participant: participantId
      });
      
      console.log("Request body length:", requestBody.length);
      
      // Try using fetch instead of axios
      const response = await fetch(`${API_URL}/upload/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: requestBody
      });
      
      console.log("Response status:", response.status);
      
      // Get the full error text regardless of status
      const responseText = await response.text();
      console.log("Full response:", responseText);
      
      if (!response.ok) {
        throw new Error(`Server error: ${response.status} - ${responseText}`);
      }
      
      // Try to parse the response as JSON
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        throw new Error(`Invalid JSON response: ${responseText}`);
      }
      
      console.log("Success response:", data);
      
      if (data && data.feedback) {
        // Log success
        console.log('Successfully processed design and got feedback');
        
        navigate('/feedback', {
          state: {
            feedback: data.feedback,
            participantId,
            imageUrl: data.image_url,
            docId
          }
        });
      } else {
        setError('Upload successful, but no feedback was generated. Please try again.');
      }
    } catch (error) {
      console.error('Error details:', error);
      setError('Error uploading file: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="design-upload-container">
      <div className="upload-card">
        <h1>Upload Your Design</h1>
        <p>Share your creative work and get AI-powered feedback</p>
        {error && <div className="error-message" style={{color: 'red', marginBottom: '15px'}}>{error}</div>}
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
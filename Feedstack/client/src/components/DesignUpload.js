import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import API_URL from '../config';

function DesignUpload() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [gdprConsent, setGdprConsent] = useState(false);
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
    
    // Check file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (selectedFile.size > maxSize) {
      setError(`File size exceeds 5MB limit. Your file is ${(selectedFile.size / (1024 * 1024)).toFixed(2)}MB`);
      return;
    }
    
    setFile(selectedFile);
    setError(null); // Clear any previous errors

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(selectedFile);
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          // Create canvas for resizing
          const canvas = document.createElement('canvas');
          
          // Force smaller size
          const maxSize = 600;
          let width = img.width;
          let height = img.height;
          
          if (width > height) {
            height = Math.round((height * maxSize) / width);
            width = maxSize;
          } else {
            width = Math.round((width * maxSize) / height);
            height = maxSize;
          }
          
          canvas.width = width;
          canvas.height = height;
          
          // Draw and convert
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          // Lower quality JPEG
          const resizedImage = canvas.toDataURL('image/jpeg', 0.6);
          resolve(resizedImage);
        };
        
        img.src = reader.result;
      };
      
      reader.onerror = error => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }
    
    if (!gdprConsent) {
      setError("Please agree to the GDPR consent to proceed.");
      return;
    }
    
    setIsLoading(true);
    setError(null);

    try {
      console.log("Sending upload request to:", `${API_URL}/upload/`);
      console.log("With participant ID:", participantId);
      
      const base64Image = await convertToBase64(file);
      
      // Try using fetch instead of axios
      const response = await fetch(`${API_URL}/upload/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: base64Image,
          participant: participantId
        })
      });
      
      console.log("Response status:", response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(`Server error: ${response.status}`);
      }
      
      const data = await response.json();
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
        <p className="supported-formats">Supported formats: <span>.PNG, .JPG, .JPEG, .PDF</span></p>
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
          <div className="gdpr-consent">
            <input
              type="checkbox"
              id="gdpr-checkbox"
              checked={gdprConsent}
              onChange={(e) => setGdprConsent(e.target.checked)}
            />
            <label htmlFor="gdpr-checkbox">
              I agree to the processing of my design data for feedback purposes in accordance with the GDPR
            </label>
          </div>
          <button type="submit" disabled={!file || isLoading || !gdprConsent}>
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
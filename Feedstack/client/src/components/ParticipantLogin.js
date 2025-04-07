import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API_URL from '../config';

function ParticipantLogin() {
  const [participantId, setParticipantId] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!participantId.trim()) {
      alert('Please enter a Participant ID');
      return;
    }
    
    try {
      console.log('About to make API call to:', `${API_URL}/participant/`);
      console.log('With payload:', { participant_id: participantId });
      
      // Using Fetch API instead of axios
      const response = await fetch(`${API_URL}/participant/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ participant_id: participantId })
      });
      
      console.log('Response status:', response.status);
      
      // Check if the response is ok (status in the range 200-299)
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response text:', errorText);
        throw new Error(`Server responded with ${response.status}: ${errorText}`);
      }
      
      const data = await response.json();
      console.log('Fetch response data:', data);
      
      // Skip Firestore operations
      const docId = 'temp-doc-id'; // Use a temporary ID
      
      // Log to console instead of Firebase
      console.log('Participant login event logged (Firebase disabled):', participantId);
      
      navigate('/upload', { state: { participantId, docId } });
    } catch (error) {
      console.error('Error details:', error);
      console.log('Error event logged (Firebase disabled):', error.message);
      alert('Error: ' + error.message);
    }
  };

  return (
    <div className="participant-login">
      <div className="login-card">
        <h1>Welcome to Feedstack</h1>
        <p>Enter your Participant ID to get started with AI-powered design feedback.</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={participantId}
            onChange={(e) => setParticipantId(e.target.value)}
            placeholder="Enter Participant ID"
            required
          />
          <button type="submit">Start</button>
        </form>
      </div>
    </div>
  );
}

export default ParticipantLogin;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
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
      // Skip Firestore operations
      const docId = 'temp-doc-id'; // Use a temporary ID
      
      // Still call your API to maintain backend state
      await axios.post(`${API_URL}/participant/`, { participant_id: participantId });
      
      // Log to console instead of Firebase
      console.log('Participant login event logged (Firebase disabled):', participantId);
      
      navigate('/upload', { state: { participantId, docId } });
    } catch (error) {
      console.error('Error creating participant:', error);
      console.log('Error event logged (Firebase disabled):', error.message);
      alert('Error: ' + (error.response?.data?.error || 'An unknown error occurred'));
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
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import  { addParticipant } from '../firestore';
import { logTestEvent } from '../firebaseAnalytics'

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
        // Create participant in Firestore
        const docId = await addParticipant({
        ParticipantId: participantId,
        // No design, chatlogs, and themes on login
        Design: '',
        ChatLogs: [],
        Themes: []
      });

      await axios.post('http://localhost:8000/api/participant/', { participant_id: participantId });
      navigate('/upload', { state: { participantId, docId } });

      logTestEvent(participantId);
      
    } catch (error) {
      console.error('Error creating participant:', error);
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
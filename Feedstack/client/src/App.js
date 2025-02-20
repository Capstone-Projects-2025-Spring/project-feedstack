import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ParticipantLogin from './components/ParticipantLogin';
import DesignUpload from './components/DesignUpload';
import Feedback from './components/Feedback';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<ParticipantLogin />} />
          <Route path="/upload" element={<DesignUpload />} />
          <Route path="/feedback" element={<Feedback />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
import { logEvent } from "firebase/analytics";
import { analytics } from './firebase';

export const logTestEvent = (participantId) => {
    
    // Log participant login even
        logEvent(analytics, 'participant_login', {
            participant_id: participantId
        });
        console.log('Participant login event logged:', participantId);
};

export const logErrorEvent = (errorMessage, errorDetails) => {
    logEvent(analytics, 'error_occurred', {
        error_message: errorMessage,
        error_details: errorDetails,
        timestamp: new Date().toISOString()
    });
    console.log('Error event logged:', errorMessage);
};
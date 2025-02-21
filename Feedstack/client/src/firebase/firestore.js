import { db } from './firebase';
import { collection, addDoc, serverTimestamp, Timestamp } from 'firebase/firestore';

export async function addParticipant(participantData) {
    try {
        // Add participant document
        const participantRef = await addDoc(collection(db, 'Participants'), {
            ParticipantId: participantData.ParticipantId,
            Design: participantData.Design,
            Sign_In_Time: serverTimestamp()
        });

        // Add chat logs
        for (const chat of participantData.ChatLogs) {
            await addDoc(collection(db, `Participants/${participantRef.id}/ChatLogs`), {
                Message: chat.Message,
                Timestamp: serverTimestamp(),
                Sender: chat.Sender
            });
        }

        // Add themes
        for (const theme of participantData.Themes) {
            const themeRef = await addDoc(collection(db, `Participants/${participantRef.id}/Themes`), {
                Theme: theme.Theme,
                Created_At: serverTimestamp(),
                Color: theme.Color,                    
                Definition: theme.Definition,
                Chapter_Clicks: theme.chapter_clicks || [], 
                Bookmark_Clicks: theme.bookmark_clicks || [],
                NavArrow_Clicks: theme.NavArrow_Clicks || [],
                SeeMore_Clicks: theme.SeeMore_Clicks || [],
                Chapter_Hover: theme.Chapter_Hover || [],
                Keyterm_Hover: theme.Keyterm_Hover || [],

            });
                // Add instances to the Instances sub-collection within the current theme
            for (const instance of theme.Instances) {
                await addDoc(collection(db, `Participants/${participantRef.id}/Themes/${themeRef.id}/Instances`), {
                    Instance: instance.Instance,
                    Relation: instance.Relation,
                    Keyterms: instance.Keyterms
                });
            }
        }

        console.log('Participant added with ID: ', participantRef.id);
        return participantRef.id;
    }
    catch (e) {
        console.error('Error adding participant: ', e);
    }
}
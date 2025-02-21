import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import MarkdownIt from 'markdown-it';
import popSound from '../assets/pop.mp3';
import { db } from '../firebase/firebase';
import { collection, addDoc, serverTimestamp, updateDoc, doc } from 'firebase/firestore';
import { color } from 'framer-motion';

const md = new MarkdownIt();

const themeColors = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
  '#F06292', '#AED581', '#7E57C2', '#FFD54F', '#4DB6AC',
  '#FF7043', '#66BB6A', '#5C6BC0', '#FFCA28', '#26A69A',
  '#EC407A', '#9CCC65', '#5E35B1', '#FFAB00', '#00ACC1',
  '#FF5722', '#43A047', '#3949AB', '#FF9800', '#00897B',
  '#D81B60', '#7CB342', '#512DA8', '#FFA000', '#00796B',
  '#C2185B', '#689F38', '#4527A0', '#F57C00', '#00695C',
  '#AD1457', '#558B2F', '#311B92', '#E65100', '#004D40'
];

const themes = ['Balance', 'Contrast', 'Consistency', 'Aligment & Spacing', 'Accessibility']
const colorScale = ['#D3D3D3', '#B0B0B0', '#8C8C8C', '#696969', '#4A4A4A'];

function Feedback() {
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [activeTheme, setActiveTheme] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [keyTerms, setKeyTerms] = useState([]);
  const [expandedSections, setExpandedSections] = useState({});
  const [teaserChapters, setTeaserChapters] = useState([]);
  const location = useLocation();
  const { feedback, participantId, imageUrl, docId } = location.state;
  const chatContainerRef = useRef(null);
  const audioRef = useRef(new Audio(popSound));

  useEffect(() => {
    setChatMessages([{ content: feedback, is_user: false }]);
    generateInitialSummary(feedback);

    // const initialThemes = themes.ma((theme, index) => ({
    //   theme,
    //   // id, set the theme id later for firebase doc
    //   color: colorScale[0],
    //   instances: [], // no mentions initially
    //   currentInstance: 0,
    // }));
    // setChapters(initialThemes);

  }, [feedback]);


  const generateInitialSummary = async (feedback) => {
    try {
      const response = await axios.post('http://localhost:8000/api/summarize/', {
        text: feedback,
        theme: 'Initial Feedback'
      });
      const { definition, relation, key_terms, summary } = response.data;
      setChapters([{ 
        theme: 'Initial Feedback', 
        definition,
        relation,
        key_terms,
        summary, 
        color: themeColors[0],
        id: 'initial'
      }]);
      setBookmarks([{ messageIndex: 0, color: themeColors[0], id: 'initial' }]);
    } catch (error) {
      console.error('Error generating summary:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const userMessage = { content: newMessage, is_user: true };
    setChatMessages(prevMessages => [...prevMessages, userMessage]);
    setNewMessage('');

    try {
      // Add user message to Firestore
      const userMessageDoc = {
        Message: userMessage.content,
        Timestamp: serverTimestamp(),
        Sender: "Participant"
      };
      await addDoc(collection(db, `Participants/${docId}/ChatLogs`), userMessageDoc);  
      console.log('User message added to Firestore:', userMessageDoc);

      const response = await axios.post('http://localhost:8000/api/chat/', {
        participant_id: participantId,
        message: newMessage,
        conversation_history: chatMessages
      });
      
      const botMessage = response.data.bot_message;
      // setChatMessages(prevMessages => [...prevMessages, botMessage]);
      
      // Add bot message to Firestore
      const botMessageDoc = {
        Message: botMessage.content,
        Timestamp: serverTimestamp(),
        Sender: "Feedstack"
      };
      await addDoc(collection(db, `Participants/${docId}/ChatLogs`), botMessageDoc);  
      console.log('Bot message added to Firestore:', botMessageDoc);
      
      const themeResponse = await axios.post('http://localhost:8000/api/identify-theme/', {
        message: botMessage.content,
      });
      
      const newTheme = themeResponse.data.theme;
      const newColor = themeColors[chapters.length % themeColors.length];
      
      const summaryResponse = await axios.post('http://localhost:8000/api/summarize/', {
        message: botMessage.content,
        theme: newTheme
      });

      const { definition, relation, key_terms, summary } = summaryResponse.data;
      botMessage.keyTerms = summaryResponse.data.key_terms;
      setChatMessages(prevMessages => [...prevMessages, botMessage]);

      // Add Themes to Firestore
      const themeDoc = {
        Theme: newTheme,
        Created_At: serverTimestamp(),
        Definition: definition,
        Relation: relation,
        Key_Terms: key_terms,
        Summary: summary,
        Color: newColor,
      };
      const themeRef = await addDoc(collection(db, `Participants/${docId}/Themes`), themeDoc);
      console.log('Theme added to Firestore');

      // Add the theme and its instance to state or update if already exists
      setChapters((prevChapters) => {
        // Find a chapter from the array of existing chapter 
        // that is the same as the newly identified theme
        const existingChapter = prevChapters.find((chapter) => chapter.theme === newTheme);

        if (existingChapter) {
          // Update the existing theme with new instance
          const newInstanceIndex = Math.min(existingChapter.instances.length-1, colorScale.length-1);
            // Use map to iterate through prevChapters and update the chapter that matches `newTheme`
            // map returns a new array with the updated chapter
            return prevChapters.map((chapter) => 
              chapter.theme === newTheme ? {
              ...chapter, // copy all properties while overriding the following:
              instances: [...chapter.instances, botMessage.content],
              currentInstance: newInstanceIndex,
              color: colorScale[newInstanceIndex]
            } : chapter
        );
      } else {
        // Add a new theme to the array of chapters
        return [
            ...prevChapters,
            { 
              theme: newTheme,
              id: themeRef.id,
              definition,
              relation,
              key_terms,
              summary,
              chapter_clicks: [],
              bookmark_clicks: [],
              // track instance
              color: colorScale[0],
              instances: [botMessage.content], // to track content and also for achoring the instance with its feedback message
              currentInstance: 0, // current instance being displayed
            },
          ];
        }
      });
      
      // debug log to check if chapters are added to instance 
      setChapters((prevChapters) => {
        const updatedChapters = prevChapters.map(chapter => {
          return chapter;
        });
        console.log('Updated Chapters:', updatedChapters);
        return updatedChapters;
      });
      
      setBookmarks(prevBookmarks => [
        ...prevBookmarks,
        { 
          id: themeRef.id,
          messageIndex: chatMessages.length, 
          color: newColor 
        }
      ]);

      audioRef.current.play();

    } catch (error) {
      console.error('Error sending message:', error);
      setChatMessages(prevMessages => [...prevMessages, { content: "Sorry, I encountered an error. Please try again.", is_user: false }]);
    }
  };

  const highlightMessage = (message, keyTerms) => {
    let highlightedMessage = message;
  
    keyTerms.forEach(term => {
      const lowerMessage = highlightedMessage.toLowerCase();
      const lowerTerm = term.toLowerCase();
      const index = lowerMessage.indexOf(lowerTerm);
  
      if (index !== -1) {
        const before = highlightedMessage.slice(0, index);
        const match = highlightedMessage.slice(index, index + term.length);
        const after = highlightedMessage.slice(index + term.length);
        highlightedMessage = `${before}<span class="highlight">${match}</span>${after}`;

      }
    });
  
    return highlightedMessage;
  };
  

  const scrollToBookmark = (messageIndex) => {
    const chatMessages = chatContainerRef.current.children;
    if (chatMessages[messageIndex]) {
      chatMessages[messageIndex].scrollIntoView({ behavior: 'smooth' });
    }
  };

  const clickLogger = async (themeId, type) => {
    type += "_click";  

    setChapters(prevSummaries => {
      return prevSummaries.map(theme => {
        if (theme.id === themeId) {
          const updatedClicks = [...(theme[type] || []), new Date().toLocaleString("en-US", { timeZone: "America/New_York" })];

          // Update Firestore with the correct field name
          updateDoc(doc(db, `Participants/${docId}/Themes/${themeId}`), {
            [type]: updatedClicks  // Dynamically update chapter_click or bookmark_click in Firestore
          });

          return { ...theme, [type]: updatedClicks };  // Dynamically update the state
        }
        return theme;
      });
    });
  };

  const toggleSeeMore = (themeId, section) => {
    setExpandedSections(prev => ({
      ...prev,
      [themeId]: {
        ...prev[themeId],
        [section]: !prev[themeId]?.[section]
      }
    })); 
  };

  // Logic for navigation arrows
  const handleInstanceNavigation = (theme, direction) => {
    setChapters(prevChapters => 
      prevChapters.map(item => {
        if (item.them === theme) {
          // update instance index, min 0 and max colorScale.length-1
          const newInstance = Math.max(0, Math.min(item.instances.length-1, item.currentInstance + direction));
        return {
          ...item,
          currentInstance: newInstance
        };
      }
      return item;
      })
    );
  };


  return (
    <div className="feedback-container">
      <div className="image-container">
        <img src={`http://localhost:8000${imageUrl}`} alt="Uploaded design" />
      </div>
      <div className="feedback-chat-container">
        <div className="teaser-chapters">
          {teaserChapters.map((theme, index) => (
            <button
              key={index}
              className="teaser-chapter"
              onClick={() => {
                const chapterIndex = chapters.findIndex(s => s.theme === theme);
                setActiveTheme(chapterIndex);
                clickLogger(chapters[chapterIndex].id, "chapter");
              }}
            >
              {theme}
            </button>
          ))}
        </div>
        <div className="bookmarks">
          {bookmarks.map((bookmark, index) => (
            <div 
              key={index} 
              className="bookmark"
              style={{ backgroundColor: bookmark.color }}
              onClick={() => {
                scrollToBookmark(bookmark.messageIndex);
                clickLogger(bookmark.id, "bookmark");
              }}
            />
          ))}
        </div>
        <div className="chat-container" ref={chatContainerRef}>
          {chatMessages.map((msg, index) => (
            <div
              key={index} 
              className={`message ${msg.is_user ? 'user-message' : 'bot-message'}`}
              >
              {msg.is_user ? (
                <div>{msg.content}</div>
              ) : (msg.keyTerms && Array.isArray(msg.keyTerms) && msg.keyTerms.length > 0) ? (
                <div dangerouslySetInnerHTML={{ __html: highlightMessage(msg.content, msg.keyTerms) }} />
              ) : (
                <div>{msg.content}</div>
              )}
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="chat-input-form">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
          />
          <button type="submit">Send</button>
        </form>
      </div>
      <div className="accordion-container">
        <h3>Theme Summaries</h3>
        {chapters.map((item, index) => (
          <div
            key={index}
            className={`accordion-item ${activeTheme === index ? 'active' : ''}`}
          >
            <button 
              className="accordion-header" 
              onClick={() => {
                setActiveTheme(activeTheme === index ? null : index);
                clickLogger(item.id, "chapter");
              }}
              style={{ backgroundColor: item.color }}
            >
              {item.theme}
            </button>
            {activeTheme === index && (
              <div className="accordion-content">
                <h4>Definition</h4>
                <p>
                  {expandedSections[item.id]?.definition
                    ? item.definition
                    : `${item.definition.slice(0, 100)}...`}
                  <button onClick={() => toggleSeeMore(item.id, 'definition')} className="see-more">
                    {expandedSections[item.id]?.definition ? 'See less' : 'See more'}
                  </button>
                </p>
                <h4>Relation to Design</h4>
                <p>
                  {expandedSections[item.id]?.relation
                    ? item.relation
                    : `${item.relation.slice(0, 100)}...`}
                  <button onClick={() => toggleSeeMore(item.id, 'relation')} className="see-more">
                    {expandedSections[item.id]?.relation ? 'See less' : 'See more'}
                  </button>
                </p>
                <h4>Key Terms</h4>
                <p>{item.key_terms.join(', ')}</p>
                {/* Instance Navigation */}
                <div className="instance-navigation">
                    <span>
                      Instance {item.currentInstance + 1}
                    </span>
                    <button 
                      className="nav-arrow"
                      onClick={() => handleInstanceNavigation(item.theme, -1)}
                      disabled={item.currentInstance === 0} // disable if at the first instance
                      > ← </button>
                    <button
                      className="nav-arrow"
                      onClick={() => handleInstanceNavigation(item.theme, 1)}
                      disabled={item.currentInstance === item.instances.length-1} // disable if at the last instance
                      > → </button>
                </div>

                {/*<h4>Summary</h4>
                <p>
                  {expandedSections[item.id]?.summary
                    ? item.summary
                    : `${item.summary.slice(0, 100)}...`}
                  <button onClick={() => toggleSeeMore(item.id, 'summary')} className="see-more">
                    {expandedSections[item.id]?.summary ? 'See less' : 'See more'}
                  </button>
                </p>*/}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Feedback;
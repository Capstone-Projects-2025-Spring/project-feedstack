import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import MarkdownIt from 'markdown-it';
import popSound from '../assets/pop.mp3';
// Comment out Firebase imports
// import { db } from '../firebase';
// import { collection, addDoc, serverTimestamp, updateDoc, doc } from 'firebase/firestore';

const md = new MarkdownIt({
  html: false,  // Disable HTML tags in source
  breaks: true, // Convert '\n' in paragraphs into <br>
  linkify: true // Autoconvert URL-like text to links
});

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

const themes = ['Balance', 'Contrast', 'Consistency', 'Alignment & Spacing', 'Accessibility'];
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
  const [suggestions, setSuggestions] = useState([]);
  const location = useLocation();
  const { feedback, participantId, imageUrl, docId } = location.state || 
    { feedback: 'No feedback available', participantId: 'temp-user', imageUrl: '', docId: 'temp-doc' };
  const chatContainerRef = useRef(null);
  const audioRef = useRef(new Audio(popSound));

  useEffect(() => {
    setChatMessages([{ content: feedback, is_user: false }]);
    generateInitialSummary(feedback);
  }, [feedback]);

  // Ensure all chapters have necessary properties
  useEffect(() => {
    setChapters(prevChapters => 
      prevChapters.map(chapter => ({
        ...chapter,
        instances: chapter.instances || [],
        currentInstance: chapter.currentInstance || 0,
        key_terms: chapter.key_terms || []
      }))
    );
  }, []);

  const generateInitialSummary = async (feedback) => {
    try {
      const response = await axios.post('http://localhost:8000/api/summarize/', {
        text: feedback,
        theme: 'Initial Feedback'
      });
      const { definition, relation, key_terms, summary } = response.data;
      setChapters([{ 
        theme: 'Initial Feedback', 
        definition: definition || '',
        relation: relation || '',
        key_terms: key_terms || [],
        summary: summary || '', 
        color: themeColors[0],
        id: 'initial',
        instances: [feedback],
        currentInstance: 0
      }]);
      setBookmarks([{ messageIndex: 0, color: themeColors[0], id: 'initial' }]);
    } catch (error) {
      console.error('Error generating summary:', error);
      // Set default values if API call fails
      setChapters([{
        theme: 'Initial Feedback',
        definition: 'Definition not available',
        relation: 'Relation not available',
        key_terms: [],
        summary: 'Summary not available',
        color: themeColors[0],
        id: 'initial',
        instances: [feedback],
        currentInstance: 0
      }]);
      setBookmarks([{ messageIndex: 0, color: themeColors[0], id: 'initial' }]);
    }
  };

  const generateSuggestions = async (lastMessage) => {
    try {
      const response = await axios.post('http://localhost:8000/api/generate-suggestions/', {
        message: lastMessage
      });
      setSuggestions(response.data.suggestions || []);
    } catch (error) {
      console.error('Error generating suggestions:', error);
      setSuggestions([]);
    }
  };

  useEffect(() => {
    if (chatMessages.length > 0) {
      const lastMessage = chatMessages[chatMessages.length - 1];
      if (!lastMessage.is_user) {
        generateSuggestions(lastMessage.content);
      }
    }
  }, [chatMessages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const userMessage = { content: newMessage, is_user: true };
    setChatMessages(prevMessages => [...prevMessages, userMessage]);
    setNewMessage('');

    try {
      // Log to console instead of Firebase
      console.log('User message (Firebase disabled):', userMessage.content);

      const response = await axios.post('http://localhost:8000/api/chat/', {
        participant_id: participantId,
        message: newMessage,
        conversation_history: chatMessages
      });
      
      const botMessage = response.data.bot_message;
      
      // Log to console instead of Firebase
      console.log('Bot message (Firebase disabled):', botMessage.content);
      
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
      botMessage.keyTerms = summaryResponse.data.key_terms || [];
      setChatMessages(prevMessages => [...prevMessages, botMessage]);

      // Log to console instead of Firebase
      console.log('Theme (Firebase disabled):', {
        theme: newTheme, 
        definition, 
        relation, 
        key_terms, 
        summary
      });
      
      // Generate a temporary ID for the theme
      const tempThemeId = 'theme-' + Date.now();

      // Add the theme and its instance to state or update if already exists
      setChapters((prevChapters) => {
        // Find a chapter that matches the new theme
        const existingChapter = prevChapters.find((chapter) => chapter.theme === newTheme);

        if (existingChapter) {
          // Update the existing theme with new instance
          const newInstances = [...(existingChapter.instances || []), botMessage.content];
          
          // Combine existing and new key terms, removing duplicates
          const combinedKeyTerms = [
            ...(existingChapter.key_terms || []),
            ...(key_terms || [])
          ].filter((term, index, self) => 
            term && self.indexOf(term) === index
          );
          
          return prevChapters.map((chapter) => 
            chapter.theme === newTheme ? {
              ...chapter,
              instances: newInstances,
              key_terms: combinedKeyTerms,
              currentInstance: newInstances.length - 1,
              color: colorScale[Math.min(newInstances.length - 1, colorScale.length - 1)]
            } : chapter
          );
        } else {
          // Add a new theme to the array of chapters
          return [
            ...prevChapters,
            { 
              theme: newTheme,
              id: tempThemeId,
              definition: definition || '',
              relation: relation || '',
              key_terms: key_terms || [],
              summary: summary || '',
              chapter_clicks: [],
              bookmark_clicks: [],
              color: colorScale[0],
              instances: [botMessage.content],
              currentInstance: 0,
            },
          ];
        }
      });
      
      // Log updated chapters
      setChapters((prevChapters) => {
        console.log('Updated Chapters:', prevChapters);
        return prevChapters;
      });
      
      setBookmarks(prevBookmarks => [
        ...prevBookmarks,
        { 
          id: tempThemeId,
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
    if (!message || !keyTerms || !Array.isArray(keyTerms) || keyTerms.length === 0) {
      return message || '';
    }
    
    try {
      // First convert markdown to HTML
      const htmlContent = md.render(message);
      
      // Create a temporary div to work with the message as HTML
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = htmlContent;
      
      // Create a text node walker to process all text nodes in the message
      const walker = document.createTreeWalker(
        tempDiv,
        NodeFilter.SHOW_TEXT,
        null,
        false
      );
      
      // Sort terms by length (descending) to prioritize longer matches
      const sortedTerms = [...keyTerms]
        .filter(term => term && typeof term === 'string')
        .sort((a, b) => b.length - a.length);
      
      // Nodes to replace (we'll replace them after walking to avoid walker issues)
      const replacements = [];
      
      // Find text nodes containing key terms
      let textNode;
      while ((textNode = walker.nextNode())) {
        const text = textNode.nodeValue;
        
        for (const term of sortedTerms) {
          // Use word boundaries for matching
          const regex = new RegExp(`\\b${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
          
          let match;
          let lastIndex = 0;
          const fragments = [];
          let hasMatch = false;
          
          while ((match = regex.exec(text)) !== null) {
            hasMatch = true;
            
            // Add text before the match
            if (match.index > lastIndex) {
              fragments.push(document.createTextNode(text.substring(lastIndex, match.index)));
            }
            
            // Create highlighted span for the match
            const highlightSpan = document.createElement('span');
            highlightSpan.className = 'highlight';
            highlightSpan.textContent = match[0];
            fragments.push(highlightSpan);
            
            lastIndex = match.index + match[0].length;
          }
          
          // If we found matches, add the rest of the text and queue this node for replacement
          if (hasMatch) {
            if (lastIndex < text.length) {
              fragments.push(document.createTextNode(text.substring(lastIndex)));
            }
            
            replacements.push({ node: textNode, fragments });
            break; // Process next text node
          }
        }
      }
      
      // Replace the nodes
      for (const { node, fragments } of replacements) {
        const parent = node.parentNode;
        if (parent) {
          fragments.forEach(fragment => {
            parent.insertBefore(fragment, node);
          });
          parent.removeChild(node);
        }
      }
      
      return tempDiv.innerHTML;
    } catch (error) {
      console.error("Error in highlighting:", error);
      // If highlighting fails, at least render the markdown correctly
      return md.render(message);
    }
  };
  
  const scrollToBookmark = (messageIndex) => {
    if (!chatContainerRef.current) return;
    
    const chatMessages = chatContainerRef.current.children;
    if (chatMessages[messageIndex]) {
      chatMessages[messageIndex].scrollIntoView({ behavior: 'smooth' });
    }
  };

  const clickLogger = async (themeId, type) => {
    if (!themeId) return;
    
    type += "_click";  

    // Log click to console instead of updating Firebase
    console.log(`Click logged (Firebase disabled) - ${type} on theme ${themeId}`);

    setChapters(prevSummaries => {
      return prevSummaries.map(theme => {
        if (theme.id === themeId) {
          const updatedClicks = [...(theme[type] || []), new Date().toLocaleString("en-US", { timeZone: "America/New_York" })];
          return { ...theme, [type]: updatedClicks };
        }
        return theme;
      });
    });
  };

  const toggleSeeMore = (themeId, section) => {
    if (!themeId) return;
    
    setExpandedSections(prev => ({
      ...prev,
      [themeId]: {
        ...(prev[themeId] || {}),
        [section]: !(prev[themeId]?.[section])
      }
    })); 
  };

  // Improved navigation arrows function
  const handleInstanceNavigation = (theme, direction) => {
    if (!theme) return;
    
    setChapters(prevChapters => 
      prevChapters.map(item => {
        if (item.theme === theme) {
          // Safely get instances array and current index
          const instances = item.instances || [];
          const currentInstance = item.currentInstance || 0;
          
          // Calculate new instance index with proper bounds
          const newInstance = Math.max(0, Math.min(instances.length - 1, currentInstance + direction));
          
          console.log(`Navigating ${theme} from instance ${currentInstance} to ${newInstance} of ${instances.length}`);
          
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
        {imageUrl && <img src={`http://localhost:8000${imageUrl}`} alt="Uploaded design" />}
      </div>
      <div className="feedback-chat-container">
        <div className="teaser-chapters">
          {(teaserChapters || []).map((theme, index) => (
            <button
              key={index}
              className="teaser-chapter"
              onClick={() => {
                const chapterIndex = chapters.findIndex(s => s.theme === theme);
                if (chapterIndex !== -1) {
                  setActiveTheme(chapterIndex);
                  clickLogger(chapters[chapterIndex].id, "chapter");
                }
              }}
            >
              {theme}
            </button>
          ))}
        </div>
        <div className="bookmarks">
          {(bookmarks || []).map((bookmark, index) => (
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
          {(chatMessages || []).map((msg, index) => {
            // For each message, find if any theme's key terms should be highlighted
            let termsToHighlight = [];
            
            if (!msg.is_user) {
              // Collect all key terms from all themes that might apply to this message
              chapters.forEach(chapter => {
                if (chapter.key_terms && Array.isArray(chapter.key_terms)) {
                  // Check if this message is an instance of this theme
                  const isInstanceOfTheme = chapter.instances && 
                    chapter.instances.some(instance => instance === msg.content);
                  
                  if (isInstanceOfTheme) {
                    termsToHighlight = [...termsToHighlight, ...chapter.key_terms];
                  }
                }
              });
              
              // If this message has keyTerms attached (from the API), add those too
              if (msg.keyTerms && Array.isArray(msg.keyTerms)) {
                termsToHighlight = [...termsToHighlight, ...msg.keyTerms];
              }
              
              // Remove duplicates
              termsToHighlight = [...new Set(termsToHighlight)];
            }

            return (
              <div
                key={index} 
                className={`message ${msg.is_user ? 'user-message' : 'bot-message'}`}
              >
                {msg.is_user ? (
                  <div>{msg.content}</div>
                ) : (
                  <div dangerouslySetInnerHTML={{ 
                    __html: highlightMessage(msg.content, termsToHighlight) 
                  }} />
                )}
              </div>
            );
          })}
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
        {suggestions.length > 0 && (
          <div className="suggestions-container">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                className="suggestion-button"
                onClick={() => {
                  setNewMessage(suggestion);
                  // Focus on the input field after selection
                  document.querySelector('.chat-input-form input').focus();
                }}
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="accordion-container">
        <h3>Theme Summaries</h3>
        {(chapters || []).map((item, index) => (
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
              {item.theme || 'Unnamed Theme'}
            </button>
            {activeTheme === index && (
              <div className="accordion-content">
                <h4>Definition</h4>
                <p>
                  {expandedSections[item.id]?.definition
                    ? (item.definition || 'No definition available')
                    : `${(item.definition || 'No definition available').slice(0, 100)}...`}
                  <button onClick={() => toggleSeeMore(item.id, 'definition')} className="see-more">
                    {expandedSections[item.id]?.definition ? 'See less' : 'See more'}
                  </button>
                </p>
                <h4>Relation to Design</h4>
                <p>
                  {expandedSections[item.id]?.relation
                    ? (item.relation || 'No relation information available')
                    : `${(item.relation || 'No relation information available').slice(0, 100)}...`}
                  <button onClick={() => toggleSeeMore(item.id, 'relation')} className="see-more">
                    {expandedSections[item.id]?.relation ? 'See less' : 'See more'}
                  </button>
                </p>
                <h4>Key Terms</h4>
                <p>
                  {(item.key_terms || []).map((term, i) => {
                    // Check if this term appears in the current instance
                    const currentInstance = item.instances[item.currentInstance || 0] || '';
                    const termRegex = new RegExp(`\\b${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
                    const isInCurrentInstance = termRegex.test(currentInstance);
                    
                    return (
                      <span 
                        key={i} 
                        className={`key-term ${isInCurrentInstance ? 'active-term' : ''}`}
                      >
                        {term}{i < (item.key_terms.length - 1) ? ', ' : ''}
                      </span>
                    );
                  })}
                </p>
                
                {/* Display current instance excerpt */}
                {item.instances && item.instances.length > 0 && (
                  <>
                    <h4>Excerpt</h4>
                    <div className="instance-excerpt">
                      <p>
                        {item.instances[item.currentInstance || 0].length > 150 
                          ? `${item.instances[item.currentInstance || 0].slice(0, 150)}...` 
                          : item.instances[item.currentInstance || 0]}
                      </p>
                    </div>
                  </>
                )}
                
                {/* Instance Navigation */}
                {item.instances && item.instances.length > 1 && (
                  <div className="instance-navigation">
                    <span>
                      Instance {(item.currentInstance || 0) + 1} of {item.instances.length}
                    </span>
                    <div>
                      <button 
                        className="nav-arrow"
                        onClick={() => handleInstanceNavigation(item.theme, -1)}
                        disabled={(item.currentInstance || 0) === 0} // disable if at first instance
                      > ← </button>
                      <button
                        className="nav-arrow"
                        onClick={() => handleInstanceNavigation(item.theme, 1)}
                        disabled={(item.currentInstance || 0) >= ((item.instances || []).length - 1)} // disable if at last instance
                      > → </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Feedback;
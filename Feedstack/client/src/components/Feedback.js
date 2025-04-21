import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import MarkdownIt from 'markdown-it';
import popSound from '../assets/pop.mp3';
import API_URL from '../config';

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
  const [scrubPosition, setScrubPosition] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [sortMode, setSortMode] = useState('appearance');
  const [isMessageLoading, setIsMessageLoading] = useState(false);
  const location = useLocation();
  const { feedback, participantId, imageUrl, docId } = location.state || 
    { feedback: 'No feedback available', participantId: 'temp-user', imageUrl: '', docId: 'temp-doc' };
  const chatContainerRef = useRef(null);
  const scrubTrackRef = useRef(null);
  const audioRef = useRef(new Audio(popSound));
  const menuRef = useRef(null);

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

  // Click outside handler for the Quick Jump Menu
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    
    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Remove event listener on cleanup
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  const generateInitialSummary = async (feedback) => {
    try {
      const response = await axios.post(`${API_URL}/summarize/`, {
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
      const response = await axios.post(`${API_URL}/generate-suggestions/`, {
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
    setIsMessageLoading(true); // Set loading to true when sending

    try {
      // Log to console instead of Firebase
      console.log('User message (Firebase disabled):', userMessage.content);

      // Find the initial feedback about the design to maintain context
      const initialFeedback = chatMessages.length > 0 && !chatMessages[0].is_user 
        ? chatMessages[0].content 
        : feedback;

      // Create a conversation history that always includes a reminder about the design
      const contextualHistory = [
        // First, add a system message reminding about the design context
        {
          role: "system",
          content: "Remember you're discussing a specific design that was uploaded. Keep your responses natural and conversational - like a friendly design expert having a casual chat. DO NOT use numbered lists or bullet points."
        },
        // Then include the conversation history
        ...chatMessages.map(msg => ({
          role: msg.is_user ? "user" : "assistant",
          content: msg.content
        }))
      ];

      const response = await axios.post(`${API_URL}/chat/`, {
        participant_id: participantId,
        message: newMessage,
        conversation_history: contextualHistory
      });
      
      const botMessage = response.data.bot_message;
      
      // Log to console instead of Firebase
      console.log('Bot message (Firebase disabled):', botMessage.content);
      
      const themeResponse = await axios.post(`${API_URL}/identify-theme/`, {
        message: botMessage.content,
      });
      
      const newTheme = themeResponse.data.theme;
      const newColor = themeColors[chapters.length % themeColors.length];
      
      const summaryResponse = await axios.post(`${API_URL}/summarize/`, {
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
    } finally {
      setIsMessageLoading(false); // Set loading to false when done
    }
  };

  // Simplified highlighting approach using string replacement
  const highlightMessage = (message, keyTerms) => {
    if (!message || !keyTerms || !Array.isArray(keyTerms) || keyTerms.length === 0) {
      return md.render(message || '');
    }
    
    try {
      // First render markdown to HTML
      const htmlContent = md.render(message);
      
      // Simple string-based approach for highlighting
      let highlightedContent = htmlContent;
      
      // Sort terms by length (descending) to prioritize longer matches
      const sortedTerms = [...keyTerms]
        .filter(term => term && typeof term === 'string' && term.trim().length > 0)
        .sort((a, b) => b.length - a.length);
      
      // Create a temporary container to parse the HTML
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = htmlContent;
      
      // Get all text nodes
      const textNodes = [];
      const walker = document.createTreeWalker(
        tempDiv,
        NodeFilter.SHOW_TEXT,
        null,
        false
      );
      
      let node;
      while (node = walker.nextNode()) {
        textNodes.push(node);
      }
      
      // For each text node, highlight the terms
      for (const textNode of textNodes) {
        if (!textNode.nodeValue.trim()) continue;
        
        let nodeContent = textNode.nodeValue;
        let replacements = [];
        
        for (const term of sortedTerms) {
          // Use a regular expression to find the term with word boundaries
          const regex = new RegExp(`\\b${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
          
          // Find all matches
          let match;
          while ((match = regex.exec(nodeContent)) !== null) {
            replacements.push({
              start: match.index,
              end: match.index + match[0].length,
              text: match[0],
              term
            });
          }
        }
        
        // Sort replacements by position
        replacements.sort((a, b) => a.start - b.start);
        
        // Remove overlapping replacements
        for (let i = replacements.length - 1; i > 0; i--) {
          if (replacements[i].start < replacements[i-1].end) {
            replacements.splice(i, 1);
          }
        }
        
        // Apply replacements from end to start to avoid position shifting
        if (replacements.length > 0) {
          const fragment = document.createDocumentFragment();
          let lastIndex = 0;
          
          for (const { start, end, text } of replacements) {
            // Text before the highlight
            if (start > lastIndex) {
              fragment.appendChild(document.createTextNode(nodeContent.substring(lastIndex, start)));
            }
            
            // Highlighted text
            const span = document.createElement('span');
            span.className = 'highlight';
            span.textContent = text;
            fragment.appendChild(span);
            
            lastIndex = end;
          }
          
          // Remaining text
          if (lastIndex < nodeContent.length) {
            fragment.appendChild(document.createTextNode(nodeContent.substring(lastIndex)));
          }
          
          // Replace the text node with our fragment
          textNode.parentNode.replaceChild(fragment, textNode);
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

  // Function to navigate to a specific message and expand the corresponding theme
  const navigateToThemeMessage = (messageIndex, themeId) => {
    // Scroll to message
    scrollToBookmark(messageIndex);
    
    // Find and expand the corresponding theme in accordion
    const themeIndex = chapters.findIndex(chapter => chapter.id === themeId);
    if (themeIndex !== -1) {
      setActiveTheme(themeIndex);
      clickLogger(themeId, "scrubbar");
    }
  };

  // Handle vertical scrub drag
  const handleVerticalScrubDrag = (e) => {
    if (!scrubTrackRef.current || e.clientY === 0) return;
    
    const trackRect = scrubTrackRef.current.getBoundingClientRect();
    const position = Math.max(0, Math.min(1, (e.clientY - trackRect.top) / trackRect.height));
    
    // Update scrub position
    setScrubPosition(position);
    
    // Calculate which message to show based on position
    const messageIndex = Math.min(
      Math.floor(position * chatMessages.length),
      chatMessages.length - 1
    );
    
    if (messageIndex >= 0) {
      // Scroll to that message
      scrollToBookmark(messageIndex);
    }
  };

  return (
    <div className="feedback-container">
      <div className="image-container">
        {imageUrl && <img src={`${API_URL.replace('/api', '')}${imageUrl}`} alt="Uploaded design" />}
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
        
        <div className="chat-container-wrapper">
          <div className="chat-container" ref={chatContainerRef}>
            {(chatMessages || []).map((msg, index) => {
              // For each message, find if any theme's key terms should be highlighted
              let termsToHighlight = [];
              
              if (!msg.is_user) {
                // Get ALL key terms from ALL themes to improve highlighting coverage
                chapters.forEach(chapter => {
                  if (chapter.key_terms && Array.isArray(chapter.key_terms)) {
                    termsToHighlight.push(...chapter.key_terms);
                  }
                });
                
                // If this message has keyTerms attached (from the API), add those too
                if (msg.keyTerms && Array.isArray(msg.keyTerms)) {
                  termsToHighlight.push(...msg.keyTerms);
                }
                
                // Remove duplicates and empty terms
                termsToHighlight = [...new Set(termsToHighlight)].filter(term => term && term.trim().length > 0);
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
            
            {/* Loading indicator */}
            {isMessageLoading && (
              <div className="bot-typing">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <p>AI is thinking...</p>
              </div>
            )}
          </div>
          
          {/* Vertical Timeline Scrub Bar - positioned on the right */}
          <div className="timeline-scrubbar vertical">
            <div className="timeline-track" ref={scrubTrackRef}>
              {/* Create markers for each bookmark/theme point */}
              {bookmarks.map((bookmark, index) => (
                <div 
                  key={index}
                  className="timeline-marker"
                  style={{ 
                    backgroundColor: bookmark.color,
                    top: `${(bookmark.messageIndex / Math.max(chatMessages.length - 1, 1)) * 100}%` 
                  }}
                  onClick={() => navigateToThemeMessage(bookmark.messageIndex, bookmark.id)}
                >
                  <div className="timeline-tooltip">
                    <h4>{chapters.find(chapter => chapter.id === bookmark.id)?.theme || 'Unknown Theme'}</h4>
                    <p className="tooltip-excerpt">
                      {chapters.find(chapter => chapter.id === bookmark.id)?.relation?.slice(0, 100) || 
                        "What strategies can enhance call-to-action button visibility..."}
                    </p>
                  </div>
                </div>
              ))}
              
              {/* Scrub handle */}
              <div 
                className="scrub-handle"
                style={{ top: `${scrubPosition * 100}%` }}
                draggable="true"
                onDragStart={(e) => {
                  e.dataTransfer.setData('text/plain', '');
                  e.currentTarget.classList.add('dragging');
                }}
                onDrag={handleVerticalScrubDrag}
                onDragEnd={(e) => {
                  e.currentTarget.classList.remove('dragging');
                }}
              />
            </div>
          </div>
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
        <h3>Design Principles</h3>
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

      {/* Quick Jump Menu - Floating Button */}
      <div className="quick-jump-container" ref={menuRef}>
        <button 
          className={`quick-jump-button ${menuOpen ? 'active' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Quick Jump Menu"
        >
          <span className="menu-icon">☰</span>
        </button>
        
        {menuOpen && (
          <div className="quick-jump-dropdown">
            <h3>Navigate to Design Principles</h3>
            <div className="sort-options">
              <button 
                className={sortMode === 'appearance' ? 'active' : ''}
                onClick={() => setSortMode('appearance')}
              >
                By Appearance
              </button>
              <button 
                className={sortMode === 'relevance' ? 'active' : ''}
                onClick={() => setSortMode('relevance')}
              >
                By Instances
              </button>
            </div>
            <ul>
              {sortMode === 'relevance' 
                ? [...chapters].sort((a, b) => (b.instances?.length || 0) - (a.instances?.length || 0)).map((chapter, idx) => (
                  <li key={idx}>
                    <button 
                      onClick={() => {
                        // Find the chapter's index in the original array
                        const originalIdx = chapters.findIndex(c => c.id === chapter.id);
                        
                        // Find corresponding bookmark to get message index
                        const bookmark = bookmarks.find(bm => bm.id === chapter.id);
                        
                        // Set active theme for accordion
                        setActiveTheme(originalIdx);
                        clickLogger(chapter.id, "quick-jump");
                        setMenuOpen(false);
                        
                        // Scroll to the chat message if we found a bookmark
                        if (bookmark) {
                          scrollToBookmark(bookmark.messageIndex);
                        }
                      }}
                    >
                      {chapter.theme} {chapter.instances && chapter.instances.length > 1 && 
                        <span className="instance-count">({chapter.instances.length})</span>
                      }
                    </button>
                  </li>
                ))
                : chapters.map((chapter, idx) => (
                  <li key={idx}>
                    <button 
                      onClick={() => {
                        // Find corresponding bookmark to get message index
                        const bookmark = bookmarks.find(bm => bm.id === chapter.id);
                        
                        // Set active theme for accordion
                        setActiveTheme(idx);
                        clickLogger(chapter.id, "quick-jump");
                        setMenuOpen(false);
                        
                        // Scroll to the chat message if we found a bookmark
                        if (bookmark) {
                          scrollToBookmark(bookmark.messageIndex);
                        }
                      }}
                    >
                      {chapter.theme} {chapter.instances && chapter.instances.length > 1 && 
                        <span className="instance-count">({chapter.instances.length})</span>
                      }
                    </button>
                  </li>
                ))
              }
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default Feedback;
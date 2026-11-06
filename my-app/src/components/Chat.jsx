import { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';

const currentUser = localStorage.getItem('userEmail') || 'Гость';
const socket = io('http://localhost:3000', {
  auth: { email: currentUser }
});

export default function Chat() {
  const [messages, setMessages] = useState([]); 
  const [input, setInput] = useState('');       
  const [typingUser, setTypingUser] = useState('');
  const [currentRoom, setCurrentRoom] = useState('general'); 
  
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    setMessages([]); 

    // 1. Сначала подписываемся на события
    socket.on('chat history', (history) => {
      const formattedHistory = history.map(msg => ({
        type: 'user',
        author: msg.author,
        text: msg.text
      }));
      setMessages(formattedHistory);
    });

    socket.on('chat message', (data) => {
      setMessages((prev) => [...prev, { type: 'user', author: data.author, text: data.text }]);
    });

    socket.on('user connected', (email) => {
      setMessages((prev) => [...prev, { type: 'system', text: `Пользователь ${email} подключился` }]);
    });

    socket.on('user disconnected', (email) => {
      setMessages((prev) => [...prev, { type: 'system', text: `Пользователь ${email} отключился` }]);
    });

    socket.on('typing', (email) => {
      setTypingUser(email);
    });

    socket.on('stop typing', () => {
      setTypingUser('');
    });

    // 2. Только теперь отправляем запрос на вход в комнату
    socket.emit('join room', currentRoom);

    return () => {
      socket.off('chat history');
      socket.off('chat message');
      socket.off('user connected');
      socket.off('user disconnected');
      socket.off('typing');
      socket.off('stop typing');
    };
  }, [currentRoom]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleInputChange = (e) => {
    setInput(e.target.value);
    socket.emit('typing', { email: currentUser, room: currentRoom });

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('stop typing', { room: currentRoom });
    }, 1500);
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (input.trim()) {
      socket.emit('chat message', { author: currentUser, text: input, room: currentRoom });
      setInput('');
      socket.emit('stop typing', { room: currentRoom });
    }
  };

  return (
    <div className="chat-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '15px' }}>
        <h2 className="chat-title" style={{ margin: 0, border: 'none', padding: 0 }}>Обсуждение тестов (WebSocket)</h2>
        
        <select 
          value={currentRoom} 
          onChange={(e) => setCurrentRoom(e.target.value)}
          style={{ padding: '5px 10px', borderRadius: '5px', border: '1px solid #ccc', fontWeight: 'bold' }}
        >
          <option value="general">Общий чат</option>
          <option value="sql">Обсуждение SQL</option>
          <option value="react">Обсуждение React</option>
          <option value="errors">Вопросы и ошибки</option>
        </select>
      </div>
      
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index}>
            {msg.type === 'system' ? (
              <div className="chat-system-message">{msg.text}</div>
            ) : (
              <div className="chat-message">
                <span className="chat-author">{msg.author}</span>
                {msg.text}
              </div>
            )}
          </div>
        ))}
        
        {typingUser && (
          <div className="chat-typing">{typingUser} печатает...</div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form className="chat-form" onSubmit={sendMessage}>
        <input 
          className="chat-input"
          value={input} 
          onChange={handleInputChange} 
          placeholder="Напишите сообщение..." 
        />
        <button className="chat-button" type="submit">Отправить</button>
      </form>
    </div>
  );
}
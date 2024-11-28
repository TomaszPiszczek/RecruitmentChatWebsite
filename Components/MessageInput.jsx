import PropTypes from 'prop-types';
import { useState } from 'react';


const MessageInput = ({ onSendMessage, loading }) => {
  const [input, setInput] = useState('');

  const handleSend = () => {
    onSendMessage(input);
    setInput('');
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="message-input-container">
      <input
        type="text"
        placeholder="Write message..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={handleKeyPress}
        className="input"
        disabled={loading} 
      />
      <button onClick={handleSend} className="send-button" disabled={loading}>
        Send
      </button>


    </div>
  );
};

MessageInput.propTypes = {
  onSendMessage: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default MessageInput;

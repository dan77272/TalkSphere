import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import styles from '../styles/Home.module.css';
import Pusher from 'pusher-js'
import axios from 'axios'

export default function Home() {
  const [topics, setTopics] = useState([]);
  const [topic, setTopic] = useState('');
  const [textClicked, setTextClicked] = useState(false)
  const [message, setMessage] = useState('')
  const [text, setText] = useState([])
  const [userId, setUserId] = useState('')
  const [recipientId, setRecipientId] = useState(null);
  const [channel, setChannel] = useState('')
  const [waiting, setWaiting] = useState(true);
  const [inChat, setInChat] = useState(true);
  const [isStartingNewChat, setIsStartingNewChat] = useState(false);

  
  useEffect(() => {
    const timestamp = new Date().getTime();
    setUserId(timestamp.toString());
  }, []);


  useEffect(() => {
    const HEARTBEAT_INTERVAL = 5000;  // 5 seconds
    
    const heartbeatInterval = setInterval(() => {
      axios.post('/api/heartbeat', { userId })
        .catch(error => {
          console.error('Error sending heartbeat', error);
        });
    }, HEARTBEAT_INTERVAL);
  
    return () => clearInterval(heartbeatInterval);
  }, [userId]);


  useEffect(() => {
    // This function will run when the user is about to leave the page
    const handleBeforeUnload = (e) => {
      if (!recipientId) return;  // If recipientId is null, just return.
  
      e.preventDefault();
      // e.returnValue = ''; // In some browsers, a return value is required
  
      // Notify your server that the user is leaving
      axios.post('/api/userLeaving', { userId, recipientId, channel }) // Include the channel
      .catch(error => {
        console.error('Error notifying server about user departure', error);
      });
    };
  
    // Add the event listener
    window.addEventListener('beforeunload', handleBeforeUnload);
  
    // Cleanup the event listener when the component is unmounted
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [userId, recipientId]);  // Dependency on userId and recipientId.
  
  



  // function handleKeyPress(e) {
  //   if (e.key === 'Enter' && topic.trim() !== '') {
  //     setTopics([...topics, topic]);
  //     setTopic('');
  //   }
  // }


  function handleTextClick() {
    setTextClicked(true);
    setInChat(true)
    setText([]);
    axios.post('/api/addTopic', { topics, userId })
        .then(response => {
            if (response.data.status === "Match found") {
                setWaiting(false)
                setRecipientId(response.data.recipientId);
                setChannel(response.data.chatChannel); 
                initializeChat(response.data.chatChannel);
            } else {
              setWaiting(true);
                
                // If waiting, subscribe to a personal channel to listen for match updates
                const personalChannel = `personal-${userId}`;
                const pusher = new Pusher(process.env.NEXT_PUBLIC_KEY, { cluster: 'us2' });
                const channel = pusher.subscribe(personalChannel);
                channel.bind('matched', function(data) {
                    const { chatChannel, recipientId } = data;
                    setRecipientId(recipientId);
                    setChannel(chatChannel);
                    initializeChat(chatChannel);
                    setWaiting(false);
                });
            }
        })
        .catch(error => {
            console.error('Error while matching:', error);
        });
}



function initializeChat(chatChannel) {
  const pusher = new Pusher(process.env.NEXT_PUBLIC_KEY, { cluster: 'us2' });

  const currentChatChannel = pusher.subscribe(chatChannel);

  currentChatChannel.bind('new-message', function(data) {
    const { messageData, senderId } = data;
    setText(prevText => [...prevText, { text: messageData, senderId }]);
  });

  // Cleanup
  return () => {
    currentChatChannel.unbind('new-message');
    pusher.unsubscribe(chatChannel);
  };
}



// New useEffect that binds 'user-left' when the channel changes
useEffect(() => {
  if (!channel) return;

  const pusher = new Pusher(process.env.NEXT_PUBLIC_KEY, { cluster: 'us2' });
  const chatChannel = pusher.subscribe(channel);

  chatChannel.bind('user-left', function(data) {
    const { leaverId } = data;
    if (leaverId !== userId) {
      setText(prevText => [
        ...prevText,
        { text: 'The other user has left the chat.', senderId: 'system' },
      ]);
      setInChat(false);
    }
  });

  // Cleanup
  return () => {
    chatChannel.unbind('user-left');
    pusher.unsubscribe(channel);
  };
}, [channel, userId]);


function startNewChat() {
  const timestamp = new Date().getTime();
  setUserId(timestamp.toString());
  setIsStartingNewChat(true);  // Indicate that a new chat is starting
}

useEffect(() => {
  if (isStartingNewChat) {
    // Reset other state and begin a new chat matching attempt
    endChat();
    handleTextClick();
    setIsStartingNewChat(false);  // Reset the flag
  }
}, [userId, isStartingNewChat]);




  

function endChat() {
  // Notify the other user that this user has left
  if (recipientId && userId) {
    try {
      axios.post('/api/userLeaving', { userId, recipientId, channel });
    } catch (error) {
      console.error('Error notifying server about user departure', error);
    }
  }

  setText(prevText => [
    ...prevText,
    { text: 'Chat has ended.', senderId: 'system' }
]);

  // Unsubscribe from any Pusher channels or other resources
  if (channel) {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_KEY, { cluster: 'us2' });
    pusher.unsubscribe(channel);
  }

  // Reset local state
  setTopics([]);
  setRecipientId(null);
  setChannel('');
  setInChat(false);
}




  function sendMessage(){
    if(message === ''){
      return
    }
    axios.post('/api/sendMessage', {message, senderId: userId, recipientId, channel})
    .then((response) => {
      console.log(response)
    })
    .catch((error) => {
      console.error('Error sending message', error)
    })
    setMessage('')
  }

  if(!textClicked){
    return (
      <div className={styles.page}>
        <Navbar />
        <div className={styles.homePage}>
          {/* <div className={styles.topic}>
            <label className={styles.label}>What do you want to talk about?</label>
            <div className={styles.inputContainer}>
              <input className={styles.inputText}
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Enter a topic of interest"
              />
              <div className={styles.topicsContainer}>
                {topics.map((t, index) => (
                  <span key={index} className={styles.topicItem}>
                    {t}
                    <p className={styles.p}>x</p>
                  </span>
                ))}
              </div>
            </div>
          </div> */}
          <div className={styles.chat}>
            <label className={styles.label}>Start chatting with a random stranger!</label>
            <button className={styles.button} onClick={handleTextClick}>Text</button>
          </div>
        </div>
      </div>
    );
  }else{
    return (
      <div className={styles.page}>
        <Navbar/>
        <div className={styles.chatPage}>
          <div className={styles.chat}>
          <div className={styles.texts}>
              {waiting ? <p>Looking for someone to chat with...</p> : <p>You're now chatting with a random stranger.</p>}
              {text.map((message, index) => (
                <div key={index}>
                  {message.senderId === userId ? 
                    <p><span style={{color: 'blue'}}>You: </span>{message.text}</p> :
                    message.senderId === 'system' ? 
                    <p>{message.text}</p> : 
                    <p><span style={{color: 'red'}}>Stranger: </span>{message.text}</p>}
                </div>
              ))}
            </div>
            
          </div>
          <div className={styles.inputSection}>
            <button className={waiting ? `${styles.blockedStop}` : `${styles.stop}`} onClick={inChat ? endChat : startNewChat}>
              {inChat ? "Stop" : "New Chat"}
            </button>
            <textarea
                className={styles.textArea}
                value={message}
                onChange={e => setMessage(e.target.value)}
                onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                    }
                }}
            />
            <button className={(!inChat || waiting) ? styles.blockedSend : styles.send} onClick={sendMessage}>Send</button>
          </div>
        </div>
      </div>

    )
  }

}

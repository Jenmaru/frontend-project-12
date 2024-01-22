import {
  createContext, useState, useMemo, useEffect,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actions as messagesActions } from '../slices/Messages.js';
import { actions as channelsActions, selectors } from '../slices/Channels.js';

const ChatContext = createContext({});

const ChatProvider = ({ socket, children }) => {
  const dispatch = useDispatch();

  const [currentChannel, setCurrentChannel] = useState({ id: 1, name: 'general' });
  const channels = useSelector(selectors.selectAll);

  useEffect(() => {
    socket.on('newMessage', (message) => {
      dispatch(messagesActions.addMessage(message));
    });

    socket.on('newChannel', (channel) => {
      dispatch(channelsActions.addChannel(channel));
    });

    socket.on('removeChannel', (payload) => {
      dispatch(channelsActions.removeChannel(payload.id));
      setCurrentChannel(channels[0]);
    });

    socket.on('renameChannel', (payload) => {
      dispatch(channelsActions.renameChannel({ id: payload.id, changes: payload }));
      setCurrentChannel(payload);
    });
  });

  const sendNewMessage = async (message) => {
    await new Promise((resolve, reject) => {
      socket.timeout(5000).emit('newMessage', message, (err, response) => {
        if (response?.status === 'ok') {
          resolve(response);
        } else {
          reject(err);
        }
      });
    });
  };

  const createChannel = async (name) => {
    await new Promise((resolve, reject) => {
      socket.timeout(5000).emit('newChannel', { name }, (err, response) => {
        if (response?.status === 'ok') {
          setCurrentChannel(response.data);
          resolve(response);
        } else {
          reject(err);
        }
      });
    });
  };

  const removeChannel = async (id) => {
    await new Promise((resolve, reject) => {
      socket.timeout(5000).emit('removeChannel', { id }, (err, response) => {
        if (response?.status === 'ok') {
          setCurrentChannel(channels[0]);
          resolve(response);
        } else {
          reject(err);
        }
      });
    });
  };

  const renameChannel = async (id, name) => {
    await new Promise((resolve, reject) => {
      socket.timeout(5000).emit('renameChannel', { id, name }, (err, response) => {
        if (response?.status === 'ok') {
          resolve(response);
        } else {
          reject(err);
        }
      });
    });
  };

  const value = useMemo(() => ({
    sendNewMessage,
    createChannel,
    removeChannel,
    renameChannel,
    currentChannel,
    setCurrentChannel,
  }), [currentChannel, setCurrentChannel]);

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};

export { ChatProvider };
export default ChatContext;

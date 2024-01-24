import {
  createContext, useMemo, useEffect,
} from 'react';
import { useDispatch } from 'react-redux';
import { actions as messagesActions } from '../slices/Messages.js';
import { actions as channelsActions, getCurrentChannel } from '../slices/Channels.js';

const ChatContext = createContext({});

const ChatProvider = ({ socket, children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    socket.on('newMessage', (message) => {
      dispatch(messagesActions.addMessage(message));
    });

    socket.on('newChannel', (channel) => {
      dispatch(channelsActions.addChannel(channel));
    });

    socket.on('removeChannel', (payload) => {
      dispatch(channelsActions.removeChannel(payload.id));
    });

    socket.on('renameChannel', (payload) => {
      dispatch(channelsActions.renameChannel({ id: payload.id, changes: payload }));
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
          dispatch(channelsActions.setChannelId(response.data.id));
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
    getCurrentChannel,
  }), []);

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};

export { ChatProvider };
export default ChatContext;

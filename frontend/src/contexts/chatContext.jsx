import {
  createContext, useMemo, useEffect, useCallback,
} from 'react';
import { useDispatch } from 'react-redux';
import { actions as messagesActions } from '../slices/Messages.js';
import { actions as channelsActions } from '../slices/Channels.js';

const ChatContext = createContext({});

const ChatProvider = ({ socket, children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    socket.on('newMessage', (message) => {
      dispatch(messagesActions.addMessage(message));
    });

    socket.on('newChannel', (channel) => {
      dispatch(channelsActions.addChannel(channel));
      dispatch(channelsActions.setChannelId(channel.id));
    });

    socket.on('removeChannel', (payload) => {
      dispatch(channelsActions.removeChannel(payload.id));
    });

    socket.on('renameChannel', (payload) => {
      dispatch(channelsActions.renameChannel({ id: payload.id, changes: payload }));
    });
  }, [dispatch, socket]);

  const staticSocket = useCallback((action, value) => (new Promise((resolve, reject) => {
    socket.timeout(5000).emit(action, value, (err, response) => {
      if (response?.status === 'ok') {
        resolve(response);
      } else {
        reject(err);
      }
    });
  })), [socket]);

  const sendNewMessage = useCallback(
    (message) => staticSocket('newMessage', message),
    [staticSocket],
  );

  const createChannel = useCallback(
    (name) => staticSocket('newChannel', { name }),
    [staticSocket],
  );

  const removeChannel = useCallback(
    (id) => staticSocket('removeChannel', { id }),
    [staticSocket],
  );

  const renameChannel = useCallback(
    (id, name) => staticSocket('renameChannel', { id, name }),
    [staticSocket],
  );

  const value = useMemo(() => ({
    sendNewMessage,
    createChannel,
    removeChannel,
    renameChannel,
  }), [createChannel, removeChannel, renameChannel, sendNewMessage]);

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};

export { ChatProvider };
export default ChatContext;

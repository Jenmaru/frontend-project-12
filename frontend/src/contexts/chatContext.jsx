import {
  createContext, useEffect, useMemo, useCallback,
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
    });

    socket.on('removeChannel', (payload) => {
      dispatch(channelsActions.removeChannel(payload.id));
    });

    socket.on('renameChannel', (payload) => {
      dispatch(channelsActions.renameChannel({ id: payload.id, changes: payload }));
    });
  }, [dispatch, socket]);

  const socValue = useCallback((action, value) => (new Promise((resolve, reject) => {
    socket.timeout(1000).emit(action, value, (err, response) => {
      if (response?.status === 'ok') {
        resolve(response);
      } else {
        reject(err);
      }
    });
  })), [socket]);

  const sendNewMessage = useCallback((message) => socValue('newMessage', message), [socValue]);

  const createChannel = useCallback((name) => socValue('newChannel', { name })
    .then((res) => dispatch(channelsActions.addChannel(res.data)))
    .then((res) => dispatch(channelsActions.setChannelId(res.payload.id))), [dispatch, socValue]);

  const removeChannel = useCallback((id) => socValue('removeChannel', { id }), [socValue]);

  const renameChannel = useCallback((id, name) => socValue('renameChannel', { id, name }), [socValue]);

  const values = useMemo(() => ({
    sendNewMessage,
    createChannel,
    removeChannel,
    renameChannel,
  }), [createChannel, removeChannel, renameChannel, sendNewMessage]);

  return (
    <ChatContext.Provider value={values}>
      {children}
    </ChatContext.Provider>
  );
};

export { ChatProvider };
export default ChatContext;

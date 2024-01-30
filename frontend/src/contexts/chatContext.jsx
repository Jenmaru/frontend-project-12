import {
  createContext, useEffect,
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

  const staticSocket = (action, value) => (new Promise((resolve, reject) => {
    socket.timeout(1000).emit(action, value, (err, response) => {
      if (response?.status === 'ok') {
        resolve(response);
      } else {
        reject(err);
      }
    });
  }));

  const sendNewMessage = (message) => staticSocket('newMessage', message);
  const createChannel = (name) => staticSocket('newChannel', { name })
    .then((response) => dispatch(channelsActions.addChannel(response.data)))
    .then((response) => dispatch(channelsActions.setChannelId(response.payload.id)));
  const removeChannel = (id) => staticSocket('removeChannel', { id });
  const renameChannel = (id, name) => staticSocket('renameChannel', { id, name });

  return (
    <ChatContext.Provider value={{
      sendNewMessage,
      createChannel,
      removeChannel,
      renameChannel,
    }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export { ChatProvider };
export default ChatContext;

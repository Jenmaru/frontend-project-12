import {
  createContext, useState, useMemo, useEffect,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actions as messagesActions } from '../reducers/Messages.js';
import { actions as channelsActions, selectors } from '../reducers/Channels.js';

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

  const sendNewMessage = (message) => socket.emit('newMessage', message);

  const sendNewChannel = (name) => socket.emit('newChannel', { name }, (response) => {
    setCurrentChannel(response.data);
  });

  const removeChannel = (id) => socket.timeout(5000).emit('removeChannel', { id }, () => {
    setCurrentChannel(channels[0]);
  });

  const renameChannel = (id, name) => socket.emit('renameChannel', { id, name });

  const value = useMemo(() => ({
    sendNewMessage,
    sendNewChannel,
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

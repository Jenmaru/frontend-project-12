import { createContext, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actions as messagesActions } from '../reducers/Messages.js';
import { actions as channelsActions, selectors } from '../reducers/Channels.js';

const ChatContext = createContext({});

const ChatProvider = ({ socket, children }) => {
  const dispatch = useDispatch();

  const [currentChannel, setCurrentChannel] = useState({ id: 1, name: 'general' });
  const channels = useSelector(selectors.selectAll);
  const getNewMessage = () => socket.on('newMessage', (message) => {
    dispatch(messagesActions.addMessage(message));
  });

  const sendNewMessage = (message) => socket.emit('newMessage', message);

  const getNewChannel = () => socket.on('newChannel', (channel) => {
    dispatch(channelsActions.addChannel(channel));
  });

  const sendNewChannel = (name) => socket.emit('newChannel', { name }, (response) => {
    setCurrentChannel(response.data);
  });

  const subscribeRemoveChannel = () => socket.on('removeChannel', (payload) => {
    dispatch(channelsActions.removeChannel(payload.id));
    setCurrentChannel(channels[0]);
  });

  const removeChannel = (id) => socket.emit('removeChannel', { id }, () => {
    setCurrentChannel(channels[0]);
  });

  const subscribeRenameChannel = () => socket.on('renameChannel', (payload) => {
    dispatch(channelsActions.renameChannel({ id: payload.id, changes: payload }));
    setCurrentChannel(payload);
  });

  const renameChannel = (id, name) => socket.emit('renameChannel', { id, name });

  return (
    <ChatContext.Provider value={{
      getNewMessage,
      sendNewMessage,
      getNewChannel,
      currentChannel,
      setCurrentChannel,
      sendNewChannel,
      removeChannel,
      subscribeRemoveChannel,
      renameChannel,
      subscribeRenameChannel,
    }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export { ChatProvider };
export default ChatContext;

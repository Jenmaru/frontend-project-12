import { configureStore } from '@reduxjs/toolkit';
import channelsReducer from './Channels.js';
import messagesReducer from './Messages.js';
import modalsReducer from './Modals.js';

export default configureStore({
  reducer: {
    channels: channelsReducer,
    messages: messagesReducer,
    modals: modalsReducer,
  },
});

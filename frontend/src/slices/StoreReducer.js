import { configureStore } from '@reduxjs/toolkit';
import channelsReducer from './Channels.js';
import messagesReducer from './Messages.js';

export default configureStore({
  reducer: {
    channels: channelsReducer,
    messages: messagesReducer,
  },
});

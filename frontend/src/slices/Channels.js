import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';

const channelsAdapter = createEntityAdapter();
const initialState = channelsAdapter.getInitialState({ currentChannelId: 1 });
const channels = createSlice({
  name: 'channel',
  initialState,
  reducers: {
    addChannel: channelsAdapter.addOne,
    addChannels: channelsAdapter.addMany,
    removeChannel: channelsAdapter.removeOne,
    renameChannel: channelsAdapter.updateOne,
    setChannelId: (state, { payload }) => {
      // eslint-disable-next-line no-param-reassign
      state.currentChannelId = payload;
    },
  },
});

const { actions } = channels;
const selectors = channelsAdapter.getSelectors((state) => state.channels);
const getCurrentChannel = (state) => {
  const { currentChannelId } = state.channels;
  return state.channels.entities[currentChannelId];
};
export { actions, selectors, getCurrentChannel };
export default channels.reducer;

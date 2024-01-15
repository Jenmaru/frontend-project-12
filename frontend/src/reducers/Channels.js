import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';

const channelsAdapter = createEntityAdapter();
const initialState = channelsAdapter.getInitialState();

const channels = createSlice({
  name: 'channel',
  initialState,
  reducers: {
    addChannel: channelsAdapter.addOne,
    addChannels: channelsAdapter.addMany,
    removeChannel: channelsAdapter.removeOne,
    renameChannel: channelsAdapter.updateOne,
  },
});

export const { actions } = channels;
export const selectors = channelsAdapter.getSelectors((state) => state.channels);
export default channels.reducer;

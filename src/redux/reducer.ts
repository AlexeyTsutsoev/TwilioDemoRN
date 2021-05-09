import {combineReducers, createSlice} from '@reduxjs/toolkit';

const getInitialState = {
  channels: [] as any[],
};

const main = createSlice({
  name: 'main',
  initialState: getInitialState,
  reducers: {
    addChannels: (state, action) => {
      state.channels.push(action.payload);
    },
    updateChannels: (state, action) => {
      console.log('payload--->', action.payload);

      // const tmpArr = state.channels.map(channel =>
      //   channel.id === action.payload.channel.sid
      //     ? {...channel, lastMessageTime: action.payload.dateCreated}
      //     : channel,
      // );

      // console.log('tmpArr', tmpArr);

      state.channels = action.payload;
    },
  },
});

export const {addChannels, updateChannels} = main.actions;

const rootReduser = combineReducers({
  main: main.reducer,
});

export default rootReduser;

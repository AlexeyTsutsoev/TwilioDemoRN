import {configureStore, getDefaultMiddleware} from '@reduxjs/toolkit';
import rootReduser from './reducer';

const middleware = getDefaultMiddleware({
  thunk: true,
  serializableCheck: false,
});

const store = configureStore({
  reducer: rootReduser,
  middleware,
});

export type RootState = ReturnType<typeof store.getState>;

export default store;

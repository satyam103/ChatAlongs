import {configureStore} from '@reduxjs/toolkit';
import {userData} from '../slice/Userslice';

const store = configureStore({
  reducer: {
    user:userData.reducer,
  },
});

export default store;
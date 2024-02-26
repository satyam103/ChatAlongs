import {createSlice} from '@reduxjs/toolkit';

const userData = createSlice({
  name: 'User',
  initialState: {
    userData:[],
    setting:[],
    allContacts:[],
  },
  reducers: {
    addUserdata(state,action ){
        state.push(action.payload)
    }
  },
});

export {userData};

import {createSlice} from '@reduxjs/toolkit';
import firestore from '@react-native-firebase/firestore';

const userData = createSlice({
  name: 'User',
  initialState: {
    userData: [],
    setting: [],
    allContacts: [],
  },
  reducers: {
    addUserdata(state, action) {
      const present = state.userData.find(item => {
        return item.id === action.payload.userdata.id;
      });
      if (!present) {
        state.userData.push(action.payload.userdata);
        state.setting.push(action.payload.setting);
        state.allContacts.push(action.payload.contact);
      }
    },
    logout(state, action) {
      state.userData = [];
      state.setting = [];
      state.allContacts = [];
    },
  },
});

export const {addUserdata} = userData.actions;

export {userData};

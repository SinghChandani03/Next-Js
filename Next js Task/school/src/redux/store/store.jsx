import { configureStore } from '@reduxjs/toolkit';
import {thunk} from 'redux-thunk';
import studentslice from '../slice/studentslice';
import projectslice from '../slice/projectslice';
import authslice from '../slice/authslice';
import logger from 'redux-logger'; 

const store = configureStore({
  reducer: {
    auth: authslice,
    students: studentslice,
    projects: projectslice
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(thunk, logger) 
});

export default store;

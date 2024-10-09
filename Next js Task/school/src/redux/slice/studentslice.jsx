import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  students: []
};

const studentSlice = createSlice({
  name: 'students',
  initialState,
  reducers: {
    ADD_STUDENT: (state, action) => {
      state.students.push(action.payload);
    },
    DELETE_STUDENT: (state, action) => {
      state.students = state.students.filter(student => student.id !== action.payload);
    },
    UPDATE_STUDENT: (state, action) => {
      const index = state.students.findIndex(student => student.id === action.payload.id);
      if (index !== -1) {
        state.students[index] = action.payload;
      }
    },
    FETCH_STUDENT: (state, action) => {
      state.students = action.payload;
    }
  }
});

export const { ADD_STUDENT, DELETE_STUDENT, UPDATE_STUDENT, FETCH_STUDENT } = studentSlice.actions;

export default studentSlice.reducer;

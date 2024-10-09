"use client";
import { auth } from '../../../config/firebase';
import { LOGOUT } from '@/redux/slice/authslice';


export const handleLogout = async (dispatch, router) => { 

  try {
    await auth.signOut();
    dispatch(LOGOUT());
    router.push('/login');
  } catch (error) {
    console.error('Error logging out:', error);
  }
};

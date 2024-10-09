// pages/api/register.js

import pool from '../../db';

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { username, password } = req.body;
    
    pool.query(
      'INSERT INTO users (username, password) VALUES (?, ?)',
      [username, password],
      (error) => {
        if (error) {
          console.error('Error inserting data:', error);
          res.status(500).json({ message: 'Internal Server Error' });
          return;
        }
        res.status(200).json({ message: 'User registered successfully' });
      }
    );
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}

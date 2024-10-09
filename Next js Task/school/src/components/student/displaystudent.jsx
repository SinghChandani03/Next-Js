"use client";
import React, { useState, useEffect } from 'react';
import { Container, Grid, Card, CardContent, Typography, IconButton, CircularProgress } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { ref, onValue } from 'firebase/database';
import { database } from '../../../config/firebase'; 
import StudentCrud from './StudentCrud';
import { handleDeleteStudent, handleupdateStudent } from './StudentCrud';
import { useDispatch } from 'react-redux';

const DisplayStudent = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [loading, setLoading] = useState(true); // Add loading state
  const dispatch = useDispatch();
 
  // Fetch students data
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const studentRef = ref(database, 'students-data');
        onValue(studentRef, (snapshot) => {
          if (snapshot.exists()) {
            const studentData = Object.entries(snapshot.val()).map(([id, data]) => ({
              id,
              ...data,
            }));
            setStudents(studentData);
          } else {
            setStudents([]);
          }
          setLoading(false); // Set loading to false after fetching data
        });
      } catch (error) {
        console.error('Error fetching students:', error);
        setLoading(false); // Set loading to false in case of error
      }
    };

    fetchStudents();
  }, []);

  const handleEditStudent = (student) => {
    setSelectedStudent(student);
    setIsEditModalOpen(true);
  };

  const handleUpdate = (updatedData) => {
    if (selectedStudent) {
      handleupdateStudent(selectedStudent.id, updatedData);
      setIsEditModalOpen(false);
    }
  };

  return (
    <Container sx={{ mt: 5 }}>
      <Grid container justifyContent="center" spacing={2}>
        {loading ? ( 
          <CircularProgress />
        ) : students.length === 0 ? (
          <Typography variant="h4" gutterBottom>No projects available</Typography>
        ) : (
          <>
            <Typography variant="h4" gutterBottom>List of Students</Typography>
            <Grid container spacing={2}>
              {students.map((student) => (
                <Grid item xs={12} sm={6} md={4} key={student.id}>
                  <Card sx={{ height: 'auto', boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)', mt: 5 }}>
                    <CardContent>
                      <img src={student.photo} style={{ height: "100px", width: "100px", borderRadius: '50%' }} alt="student" />
                      <Typography variant="h6" gutterBottom>Enrollment: {student.enrollment}</Typography>
                      <Typography variant="body2" gutterBottom>Name: {student.name}</Typography>
                      <Typography variant="body2" gutterBottom>Address: {student.address}</Typography>
                      <Typography variant="body2" gutterBottom>Phone: {student.phone}</Typography>
                      <Typography variant="body2" gutterBottom>Department: {student.department}</Typography>
                      <IconButton onClick={() => handleDeleteStudent(student.id, dispatch)} aria-label="delete" color="error">
                        <DeleteIcon />
                      </IconButton>
                      <IconButton onClick={() => handleEditStudent(student)} aria-label="edit" color="success">
                        <EditIcon />
                      </IconButton>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </>
        )}
      </Grid>
      {selectedStudent && (
        <StudentCrud
          open={isEditModalOpen}
          handleClose={() => setIsEditModalOpen(false)}
          isUpdateMode={true}
          initialValues={selectedStudent}
          onSubmit={handleUpdate}
        />
      )}
    </Container>
  );
};

export default DisplayStudent;

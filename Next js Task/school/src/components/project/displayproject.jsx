"use client";
import React, { useState, useEffect } from 'react';
import { Container, Grid, Card, CardContent, Typography, IconButton, CircularProgress } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { ref, onValue } from 'firebase/database';
import { database } from '../../../config/firebase';
import ProjectCrud, { handleDeleteProject, handleUpdateProject } from './projectCrud';
import { useDispatch } from 'react-redux';

const DisplayProject = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  
  // Fetch projects data
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projectRef = ref(database, 'project-data');
        onValue(projectRef, (snapshot) => {
          if (snapshot.exists()) {
            const projectData = Object.entries(snapshot.val()).map(([id, data]) => ({
              id,
              ...data,
            }));
            setProjects(projectData);
          } else {
            setProjects([]);
          }
          setLoading(false); // Set loading to false after fetching data
        });
      } catch (error) {
        console.error('Error fetching projects:', error);
        setLoading(false); // Set loading to false in case of error
      }
    };
    fetchProjects();
  }, []);

  const handleEditProject = (project) => {
    setSelectedProject(project);
    setIsEditModalOpen(true);
  };

  const handleUpdate = (updatedData) => {
    if (selectedProject) {
      handleUpdateProject(selectedProject.id, updatedData);
      setIsEditModalOpen(false);
    }
  };

  return (
    <Container sx={{ mt: 5 }}>
      <Grid container justifyContent="center" spacing={2}>
        {loading ? ( // Conditionally render spinner if loading is true
          <CircularProgress />
        ) : projects.length === 0 ? (
          <Typography variant="h4" gutterBottom>
            No projects available
          </Typography>
        ) : (
          <>
            <Typography variant="h4" gutterBottom>
              List of Projects
            </Typography>
            <Grid container spacing={2}>
              {projects.map((project) => (
                <Grid item xs={12} sm={6} md={4} key={project.id}>
                  <Card
                    sx={{
                      height: 'auto',
                      boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)',
                      mt: 5,
                    }}
                  >
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        ID: {project.pid}
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        Title: {project.title}
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                       Start Date: {project.sdate}
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        Due Date: {project.edate}
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        Status: {project.status}
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        Description: {project.description}
                      </Typography>
                      <IconButton
                        onClick={() => handleDeleteProject(project.id, dispatch)}
                        aria-label="delete"
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleEditProject(project)}
                        aria-label="edit"
                        color="success"
                      >
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
      {selectedProject && (
        <ProjectCrud
          open={isEditModalOpen}
          handleClose={() => setIsEditModalOpen(false)}
          isUpdateMode={true}
          initialValues={selectedProject}
          onSubmit={handleUpdate}
        />
      )}
    </Container>
  );
};

export default DisplayProject;

"use client";
import React, { useState, useEffect } from "react";
import {
  Button,
  CssBaseline,
  TextField,
  Box,
  Grid,
  Typography,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  Modal,
  IconButton,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Close } from "@mui/icons-material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import { project_validation } from "@/utils/validation/validation";
import { push, ref, set, get, remove } from "firebase/database";
import { database } from "../../../config/firebase";
import {
  ADD_PROJECT,
  DELETE_PROJECT,
  UPDATE_PROJECT,
} from "@/redux/slice/projectslice";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";

const defaultTheme = createTheme();

export const handleAddProject = async (newProject, dispatch) => {
  try {
    const { pid, ...projectData } = newProject; 
    const projectRef = push(ref(database, "project-data"));
    await set(projectRef, { ...projectData, pid }); 
    dispatch(ADD_PROJECT(newProject));
    toast.success("Project added successfully!");
  } catch (error) {
    console.error("Error adding project:", error);
    toast.error("Failed to add project: " + error.message);
  }
};

export const handleUpdateProject = async (projectId, newData, dispatch) => {
  try {
    const projectRef = ref(database, `project-data/${projectId}`);
    await set(projectRef, newData); 
    dispatch(UPDATE_PROJECT(projectId, newData));
    toast.success("Project updated successfully!");
  } catch (error) {
    console.error("Error updating project data:", error);
    toast.error("Failed to update project: " + error.message);
  }
};

export const handleDeleteProject = async (id, dispatch) => {

  Swal.fire({
    title: "Are you sure?",
    text: "You will not be able to recover this project data!",
    showCancelButton: true,
    confirmButtonText: "Confirm",
    cancelButtonText: "Cancel",
    cancelButtonColor: "#d33",
    confirmButtonColor: "green",
    reverseButtons: true,
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const projectRef = ref(database, `project-data/${id}`);
        await remove(projectRef);
        dispatch(DELETE_PROJECT(id));
        toast.error("Project deleted successfully!");
      } catch (error) {
        console.error("Error deleting project:", error);
        toast.error("Error in deletion!");
      }
    }
  });
};

const uniqueId = async (credentials, projectId = null) => {
  const idSnapshot = await get(ref(database, "project-data"));
  if (idSnapshot.exists()) {
    const existingProjects = Object.values(idSnapshot.val());
    const existingProject = existingProjects.find(
      (project) =>
        project.pid === credentials.pid &&
        (projectId ? project.id !== projectId : true)
    );
    if (existingProject) {
      toast.error("Project ID must be unique");
      throw new Error("Project ID must be unique");
    }
  }
};

const ProjectCrud = ({
  open,
  handleClose,
  isUpdateMode = false,
  initialValues,
}) => {
  const [credentials, setCredentials] = useState({
    pid: "",
    title: "",
    sdate: "",
    edate: "",
    status: "",
    description: "",
  });
  const [errors, setErrors] = useState({
    pid: "",
    title: "",
    sdate: "",
    edate: "",
    status: "",
    description: "",
  });
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    if (isUpdateMode && initialValues) {
      setCredentials(initialValues);
    }
  }, [isUpdateMode, initialValues]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prevState) => ({ ...prevState, [name]: value }));
    setErrors((prevState) => ({
      ...prevState,
      [name]: project_validation(name, value),
    }));
  };

  const handleProject = async (e) => {
    e.preventDefault();

    const formErrors = {};
    for (const field in credentials) {
      formErrors[field] = project_validation(field, credentials[field]);
    }
    setErrors(formErrors);

    if (Object.values(formErrors).some((error) => error !== "")) {
      return;
    }

    try {
      if (
        !isUpdateMode ||
        (isUpdateMode && initialValues.pid !== credentials.pid)
      ) {
        await uniqueId(credentials, isUpdateMode ? initialValues.id : null);
      }

      if (isUpdateMode) {
        const updatedData = { ...credentials };
        await handleUpdateProject(initialValues.id, updatedData, dispatch);
      } else {
        await handleAddProject({ ...credentials }, dispatch);
        router.push("/project/displayproject");
      }
      setCredentials({
        pid: "",
        title: "",
        sdate: "",
        edate: "",
        status: "",
        description: "",
      });
      handleClose();
    } catch (error) {
      console.error("Error adding project:", error);
      if (error.message === "Id number must be unique") {
        toast.error("Id number must be unique");
      } else {
        console.error("Error adding project: " + error.message);
      }
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="login-modal-title"
        aria-describedby="login-modal-description"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            outline: 0,
            width: "90%",
            maxWidth: 400,
            maxHeight: "90vh",
            overflowY: "auto",
            bgcolor: "background.paper",
            borderRadius: "2%",
            p: 4,
            position: "relative",
          }}
        >
          <CssBaseline />
          <IconButton
            onClick={handleClose}
            sx={{ position: "absolute", top: 8, right: 8, zIndex: 1 }}
          >
            <Close />
          </IconButton>
          <Typography variant="h6" align="center" sx={{ mb: 4 }} gutterBottom>
            {isUpdateMode ? "Update Project" : "Add Project"}
          </Typography>
          <form onSubmit={handleProject}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="text"
                  label="Project ID"
                  name="pid"
                  value={credentials.pid}
                  onChange={handleChange}
                  inputProps={{
                    maxLength: 6,
                    onKeyPress: (e) =>
                      /[a-zA-Z]/.test(e.key) && e.preventDefault(),
                  }}
                  disabled={isUpdateMode ? true : false} 
                  autoComplete="off"
                  helperText={errors.pid}
                  FormHelperTextProps={{
                    sx: { color: errors.pid ? "#CC0000" : "default" },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="text"
                  label="Title"
                  name="title"
                  value={credentials.title}
                  onChange={handleChange}
                  autoComplete="off"
                  helperText={errors.title}
                  FormHelperTextProps={{
                    sx: { color: errors.title ? "#CC0000" : "default" },
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Start Date"
                  name="sdate"
                  value={credentials.sdate}
                  InputLabelProps={{ shrink: true }}
                  onChange={handleChange}
                  autoComplete="off"
                  helperText={errors.sdate}
                  FormHelperTextProps={{
                    sx: { color: errors.sdate ? "#CC0000" : "default" },
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="End Date"
                  name="edate"
                  value={credentials.edate}
                  InputLabelProps={{ shrink: true }}
                  onChange={handleChange}
                  autoComplete="off"
                  helperText={errors.edate}
                  FormHelperTextProps={{
                    sx: { color: errors.edate ? "#CC0000" : "default" },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={credentials.status}
                    onChange={handleChange}
                    label="Status"
                    name="status"
                  >
                    <MenuItem value="">Select Status</MenuItem>
                    <MenuItem value="Complete">Complete</MenuItem>
                    <MenuItem value="Running">Running</MenuItem>
                    <MenuItem value="Pending">Pending</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </Select>
                  {errors.status && (
                    <FormHelperText
                      sx={{ color: errors.status ? "#CC0000" : "default" }}
                    >
                      {errors.status}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="text"
                  label="Description"
                  name="description"
                  value={credentials.description}
                  onChange={handleChange}
                  multiline
                  rows={4}
                  helperText={errors.description}
                  FormHelperTextProps={{
                    sx: { color: errors.description ? "#CC0000" : "default" },
                  }}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                bgcolor: "#7386D5",
                "&:hover": {
                  bgcolor: "#6778b9",
                },
                mt: 2,
              }}
            >
              {isUpdateMode ? "Update" : "Add"}
            </Button>
          </form>
        </Box>
      </Modal>
    </ThemeProvider>
  );
};

export default ProjectCrud;

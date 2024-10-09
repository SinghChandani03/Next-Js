"use client";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
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
import { student_validation } from "@/utils/validation/validation";
import { database } from "../../../config/firebase";
import { push, ref, set, remove, get, update } from "firebase/database";
import {
  ADD_STUDENT,
  DELETE_STUDENT,
  UPDATE_STUDENT,
} from "@/redux/slice/studentslice";
import { toast } from 'react-toastify';
import Swal from "sweetalert2";

const defaultTheme = createTheme();

const handleAddStudent = async (newStudent, dispatch) => {
  try {
    const { id, ...studentData } = newStudent;
    const studentRef = push(ref(database, "students-data"));
    await set(studentRef, studentData);
    dispatch(ADD_STUDENT(newStudent));
    toast.success("Student added successfully!");
  } catch (error) {
    toast.error("Failed to add student: " + error.message);
  }
};

const handleUpdateStudent = async (studentId, newData, dispatch) => {
  try {
    const studentRef = ref(database, `students-data/${studentId}`);
    await update(studentRef, newData);
    dispatch(UPDATE_STUDENT({ id: studentId, ...newData }));
    toast.success("Student updated successfully!");
  } catch (error) {
    console.error("Error updating student data:", error);
    toast.error("Failed to update student: " + error.message);
  }
};

export const handleDeleteStudent = async (id, dispatch) => {
  Swal.fire({
    title: "Are you sure?",
    text: "You will not be able to recover this student data!",
    showCancelButton: true,
    confirmButtonText: "Confirm",
    cancelButtonText: "Cancel",
    cancelButtonColor: "#d33",
    confirmButtonColor: "green",
    reverseButtons: true,
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const studentRef = ref(database, `students-data/${id}`);
        await remove(studentRef);
        dispatch(DELETE_STUDENT(id));
        toast.error("Deleted successfully!");
      } catch (error) {
        console.error("Error deleting student:", error);
        toast.error("Error in deletion!");
      }
    }
  });
};

export const uniqueEnrollment = async (credentials, studentId = null) => {
  const enrollmentSnapshot = await get(ref(database, "students-data"));
  if (enrollmentSnapshot.exists()) {
    const existingStudents = Object.values(enrollmentSnapshot.val());
    const existingStudent = existingStudents.find(
      (student) =>
        student.enrollment === credentials.enrollment &&
        (studentId ? student.id !== studentId : true)
    );
    if (existingStudent) {
      toast.error("Enrollment number must be unique", { autoClose: 2000 });
      throw new Error("Enrollment number must be unique");
    }
  }
};

const StudentCrud = ({
  open,
  handleClose,
  isUpdateMode = false,
  initialValues,
}) => {
  const dispatch = useDispatch();
  const [credentials, setCredentials] = useState({
    photo: null,
    enrollment: "",
    name: "",
    address: "",
    phone: "",
    department: "",
  });
  const [errors, setErrors] = useState({});
  const [photoUrl, setPhotoUrl] = useState(null);
  const [isEnrollmentDisabled, setIsEnrollmentDisabled] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (isUpdateMode && initialValues) {
      setCredentials(initialValues);
      setIsEnrollmentDisabled(true);
      // Set the photo URL if available
      if (initialValues.photo) {
        setPhotoUrl(initialValues.photo);
      }
    }
  }, [isUpdateMode, initialValues]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    // Set the photo in the state
    setCredentials((prevState) => ({ ...prevState, photo: file }));
    // Also update the photo URL to null when a new file is selected
    setPhotoUrl(URL.createObjectURL(file));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    // Validate the field immediately
    const error = student_validation(name, value);
    setErrors((prevState) => ({
      ...prevState,
      [name]: error,
    }));

    // Enable enrollment field if not in update mode or department value changed
    if (!isUpdateMode || (isUpdateMode && name === "department")) {
      setIsEnrollmentDisabled(false);
    }
  };

  const handleStudent = async (e) => {
    e.preventDefault();

    try {
      const formErrors = {};
      for (const field in credentials) {
        formErrors[field] = student_validation(field, credentials[field]);
      }
      setErrors(formErrors);

      if (Object.values(formErrors).some((error) => error !== "")) {
        return;
      }

      if (
        !isUpdateMode ||
        (isUpdateMode && initialValues.enrollment !== credentials.enrollment)
      ) {
        await uniqueEnrollment(
          credentials,
          isUpdateMode ? initialValues.id : null
        );
      }

      // Check if a new photo is selected
      const isNewPhoto =
        credentials.photo instanceof Blob || credentials.photo instanceof File;

      if (!isNewPhoto && !photoUrl) {
        throw new Error("Please select a photo.");
      }

      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64Image = event.target.result;

        if (isUpdateMode) {
          const updatedData = {
            ...credentials,
            photo: isNewPhoto ? base64Image : photoUrl,
          };
          await handleUpdateStudent(initialValues.id, updatedData, dispatch);
        } else {
          await handleAddStudent(
            { ...credentials, photo: isNewPhoto ? base64Image : photoUrl },
            dispatch
          );
          router.push("/student/displaystudent");
        }

        setCredentials({
          photo: null,
          enrollment: "",
          name: "",
          address: "",
          phone: "",
          department: "",
        });
        handleClose();
      };

      // Read the selected file as a data URL
      if (isNewPhoto) {
        reader.readAsDataURL(credentials.photo);
      } else if (isUpdateMode) {
        await handleUpdateStudent(initialValues.id, credentials, dispatch);
        setCredentials({
          ...credentials,
          photo: photoUrl,
        });
        handleClose();
      }
    } catch (error) {
      console.error("Error adding student:", error);
      if (error.message === "Enrollment number must be unique") {
        toast.error("Enrollment number must be unique", { autoClose: 2000 });
      } else {
        toast.error("Error adding student: " + error.message);
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
            {isUpdateMode ? "Update Student" : "Add Student"}
          </Typography>
          <form onSubmit={handleStudent} encType="multipart/form-data">
            <Grid container spacing={2}>
              <Grid item xs={12}>
                {photoUrl && (
                  <img
                    src={photoUrl}
                    alt="Student Photo"
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                      marginBottom: "10px",
                    }}
                  />
                )}
                <TextField
                  fullWidth
                  type="file"
                  label="Photo"
                  name="photo"
                  onChange={handleFileChange}
                  helperText={errors.photo}
                  FormHelperTextProps={{
                    sx: { color: errors.photo ? "#CC0000" : "default" },
                  }}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="text"
                  label="Enrollment"
                  name="enrollment"
                  value={credentials.enrollment}
                  onChange={handleChange}
                  inputProps={{
                    maxLength: 12,
                    onKeyPress: (e) =>
                      /[a-zA-Z]/.test(e.key) && e.preventDefault(),
                  }}
                  disabled={isUpdateMode ? isEnrollmentDisabled : false} 
                  autoComplete="off"
                  helperText={errors.enrollment}
                  FormHelperTextProps={{
                    sx: { color: errors.enrollment ? "#CC0000" : "default" },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="text"
                  label="Name"
                  name="name"
                  value={credentials.name}
                  onChange={handleChange}
                  inputProps={{
                    maxLength: 50,
                  }}
                  autoComplete="off"
                  helperText={errors.name}
                  FormHelperTextProps={{
                    sx: { color: errors.name ? "#CC0000" : "default" },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="text"
                  label="Address"
                  name="address"
                  value={credentials.address}
                  onChange={handleChange}
                  inputProps={{
                    maxLength: 50,
                  }}
                  autoComplete="off"
                  helperText={errors.address}
                  FormHelperTextProps={{
                    sx: { color: errors.address ? "#CC0000" : "default" },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="text"
                  label="Phone"
                  name="phone"
                  value={credentials.phone}
                  onChange={handleChange}
                  inputProps={{
                    maxLength: 10,
                    onKeyPress: (e) =>
                      /[a-zA-Z]/.test(e.key) && e.preventDefault(),
                  }}
                  autoComplete="off"
                  helperText={errors.phone}
                  FormHelperTextProps={{
                    sx: { color: errors.phone ? "#CC0000" : "default" },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Department</InputLabel>
                  <Select
                    value={credentials.department}
                    onChange={handleChange}
                    label="Department"
                    name="department"
                  >
                    <MenuItem value="" disabled>
                      Select department
                    </MenuItem>
                    <MenuItem value="Computer">Computer</MenuItem>
                    <MenuItem value="Mechanical">Mechanical</MenuItem>
                    <MenuItem value="Civil">Civil</MenuItem>
                    <MenuItem value="Automobile">Automobile</MenuItem>
                    <MenuItem value="Electrical">Electrical</MenuItem>
                    <MenuItem value="Electrical & Comm.">
                      Electrical & Comm.
                    </MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </Select>
                  {errors.department && (
                    <FormHelperText
                      sx={{ color: errors.department ? "#CC0000" : "default" }}
                    >
                      {errors.department}
                    </FormHelperText>
                  )}
                </FormControl>
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

export default StudentCrud;

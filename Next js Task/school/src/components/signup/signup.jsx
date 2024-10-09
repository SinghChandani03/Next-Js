"use client";
import React, { useState } from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import SensorOccupiedIcon from "@mui/icons-material/SensorOccupied";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Modal from "@mui/material/Modal";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { signup_validation } from "@/utils/validation/validation";
import { SIGNUP_SUCCESS, SIGNUP_FAIL } from "@/redux/slice/authslice";
import { Close } from "@mui/icons-material";
import { toast } from "react-toastify";
import {
  fetchSignInMethodsForEmail,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth, database } from "../../../config/firebase";
import { push, ref, set } from "firebase/database";

const defaultTheme = createTheme();

const Signup = ({ open, handleClose, handleOpenLoginModal }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState({
    fname: "",
    lname: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    fname: "",
    lname: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const router = useRouter();

  // Handle Change function
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Update the state with the new value
    setCredentials((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    // Reset error message when user starts typing
    setErrors((prevState) => ({
      ...prevState,
      [name]: signup_validation(name, value),
    }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    // Check for errors in the form
    const formErrors = {};
    for (const field in credentials) {
      formErrors[field] = signup_validation(field, credentials[field]);
    }
    setErrors(formErrors);

    // If there are errors, prevent form submission
    if (Object.values(formErrors).some((error) => error !== "")) {
      return;
    }

    try {
      setIsLoading(true);

      // Check if email already exists
      const emailExists = await fetchSignInMethodsForEmail(
        auth,
        credentials.email
      );
      if (emailExists.length > 0) {
        toast.error("Email already exists!");
        setIsLoading(false); // stop loading state
        return; // stop further execution
      }

      // Create a new user with email and password
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        credentials.email,
        credentials.password
      );
      const user = userCredential.user;

      const userRef = push(ref(database, "signup-users"));
      await set(userRef, credentials);

      dispatch(SIGNUP_SUCCESS({ ...credentials, uid: user.uid }));

      // Success notification
      toast.success("Sign-up successful!");
      setCredentials({ fname: "", lname: "", email: "", password: "" });
      handleClose();
      router.push("/login");
    } catch (error) {
      // Check for specific Firebase error codes
      if (error.code === "auth/email-already-in-use") {
        toast.error("Email already exists!");
      } else {
        toast.error("Sign-up failed. Please try again.");
      }
      dispatch(SIGNUP_FAIL(error.message));
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
            width: "100%",
            maxWidth: 450,
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
          <Grid container justifyContent="center" alignItems="center">
            <SensorOccupiedIcon sx={{ fontSize: 30, mb: 2, mr: 1 }} />
            <Typography variant="h5" component="h1" sx={{ mb: 2 }}>
              Sign In
            </Typography>
          </Grid>

          <form onSubmit={handleSignup}>
            <Grid container>
              <Grid item xs={12}>
                <TextField
                  margin="normal"
                  type="text"
                  id="fname"
                  label="First name"
                  name="fname"
                  autoComplete="fname"
                  onChange={handleChange}
                  autoFocus
                  fullWidth
                  helperText={errors.fname}
                  FormHelperTextProps={{
                    sx: { color: errors.fname ? "#CC0000" : "default" },
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  margin="normal"
                  type="text"
                  name="lname"
                  label="Last name"
                  id="lname"
                  autoComplete="lname"
                  onChange={handleChange}
                  fullWidth
                  helperText={errors.lname}
                  FormHelperTextProps={{
                    sx: { color: errors.lname ? "#CC0000" : "default" },
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  margin="normal"
                  type="email"
                  id="email"
                  label="Email"
                  name="email"
                  autoComplete="email"
                  onChange={handleChange}
                  fullWidth
                  helperText={errors.email}
                  FormHelperTextProps={{
                    sx: { color: errors.email ? "#CC0000" : "default" },
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  margin="normal"
                  name="password"
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  id="password"
                  autoComplete="new-password"
                  onChange={handleChange}
                  fullWidth
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={togglePasswordVisibility}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  helperText={errors.password}
                  FormHelperTextProps={{
                    sx: { color: errors.password ? "#CC0000" : "default" },
                  }}
                />
              </Grid>
            </Grid>
            <Button
                type="submit"
                variant="contained"
                sx={{
                  width: "100%",
                  bgcolor: "#7386D5",
                  "&:hover": { bgcolor: "#6778b9" },
                  mt: 2,
                  mb: 2,
                }}
              >
                {isLoading ? "Signing Up" : "Sign In"}
              </Button>

            <Grid container justifyContent="flax-start">
              <Grid item>
                <Typography
                  variant="body2"
                  color="black"
                  onClick={handleOpenLoginModal}
                  sx={{ cursor: "pointer" }}
                >
                  Already have an account? Sign In
                </Typography>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Modal>
    </ThemeProvider>
  );
};

export default Signup;

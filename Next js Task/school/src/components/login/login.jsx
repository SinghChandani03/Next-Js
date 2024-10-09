"use client";
import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { login_validation } from "@/utils/validation/validation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { ref, get } from "firebase/database";
import { auth, database } from "../../../config/firebase";
import { LOGIN_SUCCESS, LOGIN_FAIL } from "@/redux/slice/authslice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const defaultTheme = createTheme();

const Login = ({ handleOpenSignupModal }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(true); // State to manage modal visibility
  const dispatch = useDispatch();
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    setErrors((prevState) => ({
      ...prevState,
      [name]: login_validation(name, value),
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const formErrors = {};
    for (const field in credentials) {
      formErrors[field] = login_validation(field, credentials[field]);
    }
    setErrors(formErrors);
    if (Object.values(formErrors).some((error) => error !== "")) {
      console.log("Form has validation errors:", formErrors);
      return;
    }
    try {
      setIsLoading(true);
      const usersRef = ref(database, "signup-users");
      const snapshot = await get(usersRef);
      if (snapshot.exists()) {
        const users = snapshot.val();
        const user = Object.values(users).find(
          (user) => user.email === credentials.email
        );
        if (user) {
          try {
            const authUser = await signInWithEmailAndPassword(
              auth,
              credentials.email,
              credentials.password
            );
            const userData = {
              uid: authUser.user.uid,
              email: authUser.user.email,
            };
            dispatch(LOGIN_SUCCESS(userData));

            toast.success("Logged in successfully!");
            setCredentials({ email: "", password: "" });
            setIsModalOpen(false); 
            router.push("/");
          } catch (error) {
            console.error("Authentication error:", error);
            toast.error("Please enter valid email or password");
          }
        } else {
          console.log("Email not found:", credentials.email);
          toast.error("Email not found");
        }
      } else {
        console.log("No users found in the database.");
        toast.error("User not found");
        setCredentials({ email: "", password: "" });
      }
    } catch (error) {
      console.error("Error in login:", error.message);
      dispatch(LOGIN_FAIL(error.message));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Check if the user is already authenticated, if yes, close the modal
    const isUserAuthenticated = () => {
      // Replace this with your actual authentication logic
      return false; // Example: assuming user is not authenticated
    };
    if (isUserAuthenticated()) {
      setIsModalOpen(false);
    }
  }, []);

  return (
    <ThemeProvider theme={defaultTheme}>
      {isModalOpen && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            zIndex: 999,
          }}
        >
          <Box
            sx={{
              width: "100%",
              maxWidth: 450,
              bgcolor: "background.paper",
              borderRadius: "2%",
              p: 4,
              position: "relative",
            }}
          >
            <Grid
              container
              alignItems="center"
              justifyContent="center"
              spacing={1}
            >
              <Grid item>
                <LockOpenIcon sx={{ fontSize: 30, mb:2 }} />
              </Grid>
              <Grid item>
                <Typography
                  variant="h5"
                  component="h1"
                  sx={{ textAlign: "center", mb: 2}}
                >
                  Sign In
                </Typography>
              </Grid>
            </Grid>

            <form onSubmit={handleLogin}>
              <TextField
                margin="normal"
                type="email"
                id="email"
                label="Email"
                name="email"
                onChange={handleChange}
                value={credentials.email}
                autoFocus
                fullWidth
                helperText={errors.email}
                FormHelperTextProps={{
                  sx: { color: errors.email ? "#CC0000" : "default" },
                }}
              />
              <TextField
                margin="normal"
                name="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                id="password"
                onChange={handleChange}
                value={credentials.password}
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={togglePasswordVisibility} edge="end">
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
              <Button
                type="submit"
                variant="contained"
                sx={{
                  width: "100%",
                  bgcolor: "#7386D5",
                  "&:hover": { bgcolor: "#6778b9" },
                  mt: 2,
                }}
              >
                {isLoading ? "Signing In" : "Sign In"}
              </Button>
              <Typography
                variant="body2"
                color="black"
                onClick={handleOpenSignupModal}
                sx={{ cursor: "pointer", textAlign: "center", mt: 2 }}
              >
                Don't have an account? Sign Up
              </Typography>
            </form>
          </Box>
        </Box>
      )}
    </ThemeProvider>
  );
};

export default Login;

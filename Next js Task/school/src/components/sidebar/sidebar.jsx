"use client";
import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Drawer,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  Person as PersonIcon,
  CreateNewFolder as CreateNewFolderIcon,
  Info as InfoIcon,
} from "@mui/icons-material";
import Link from "next/link";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Login from "../login/login";
import Signup from "../signup/signup";
import StudentCrud from "../student/studentCrud";
import ProjectCrud from "../project/projectCrud";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { handleLogout } from "../logout/logout";
import { selectIsAuthenticated } from "@/redux/slice/authslice";

const defaultTheme = createTheme();

const Sidebar = () => {
  const [studentMenuOpen, setStudentMenuOpen] = useState(false);
  const [projectMenuOpen, setProjectMenuOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const toggleStudentMenu = () => {
    setStudentMenuOpen(!studentMenuOpen);
  };

  const toggleProjectMenu = () => {
    setProjectMenuOpen(!projectMenuOpen);
  };

  const toggleDrawer = (newOpen) => {
    setDrawerOpen(newOpen);
  };

  const handleOpenModal = (type) => () => {
    setModalType(type);

    if (type === "studentcrud") {
      setIsAddStudentOpen(true);
    } else if (type === "projectcrud") {
      setIsAddProjectOpen(true);
    }
  };

  const handleCloseModal = () => {
    setModalType(null);
    setIsAddStudentOpen(false);
    setIsAddProjectOpen(false);
  };

  const handleLogoutClick = () => {
    handleLogout(dispatch, router);
  };

  if (!isAuthenticated) {
    return (
      <ThemeProvider theme={defaultTheme}>
        <Login
          open={modalType === "login"}
          handleClose={handleCloseModal}
          handleOpenSignupModal={handleOpenModal("signup")}
        />
        <Signup
          open={modalType === "signup"}
          handleClose={handleCloseModal}
          handleOpenLoginModal={handleOpenModal("login")}
        />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={defaultTheme}>
      <div>
        <AppBar position="fixed">
          <Toolbar sx={{ bgcolor: "#7386D5" }}>
            <Button
              variant="text"
              color="inherit"
              aria-label="menu"
              onClick={() => toggleDrawer(true)}
            >
              <MenuIcon />
            </Button>
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1, fontSize: { xs: "18px" } }}
            >
              School Management System
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer
          anchor="left"
          open={drawerOpen}
          onClose={() => toggleDrawer(false)}
        >
          <Box
            sx={{
              width: 240,
              p: 2,
              backgroundColor: "background.paper",
            }}
          >
            <img
              src="/school-logo.png"
              style={{
                width: "150px",
                height: "40px",
                cursor: "pointer",
                margin: "20px 0px",
              }}
              alt="logo of school"
            />
            <Divider />
            <List>
              <ListItem component={Link} href="/home">
                <ListItemIcon>
                  <HomeIcon />
                </ListItemIcon>
                <ListItemText primary="Home" />
              </ListItem>
              <ListItem onClick={toggleStudentMenu}>
                <ListItemIcon>
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText primary="Student" />
              </ListItem>
              {studentMenuOpen && (
                <div>
                  <ListItem onClick={handleOpenModal("studentcrud")}>
                    <ListItemText
                      inset
                      sx={{ paddingLeft: "4.5rem" }}
                      primary="Add Student"
                    />
                  </ListItem>
                  <ListItem component={Link} href="/student/displaystudent">
                    <ListItemText
                      inset
                      sx={{ paddingLeft: "4.5rem" }}
                      primary="Students"
                    />
                  </ListItem>
                </div>
              )}
              <ListItem button onClick={toggleProjectMenu}>
                <ListItemIcon>
                  <CreateNewFolderIcon />
                </ListItemIcon>
                <ListItemText primary="Project" />
              </ListItem>
              {projectMenuOpen && (
                <div>
                  <ListItem button onClick={handleOpenModal("projectcrud")}>
                    <ListItemText
                      inset
                      sx={{ paddingLeft: "4.5rem" }}
                      primary="Add Project"
                    />
                  </ListItem>
                  <ListItem
                    button
                    component={Link}
                    href="/project/displayproject"
                  >
                    <ListItemText
                      inset
                      sx={{ paddingLeft: "4.5rem" }}
                      primary="Projects"
                    />
                  </ListItem>
                </div>
              )}
              <ListItem button component={Link} href="/about">
                <ListItemIcon>
                  <InfoIcon />
                </ListItemIcon>
                <ListItemText primary="About" />
              </ListItem>
            </List>
            <Divider />
            <Button
              variant="contained"
              sx={{
                width: "100%",
                mt: 2,
                bgcolor: "#7386D5",
                "&:hover": {
                  bgcolor: "#6778b9",
                },
              }}
              onClick={handleOpenModal("signup")}
            >
              Sign up
            </Button>
            <Button
              variant="outlined"
              sx={{
                width: "100%",
                mt: 1,
                color: "#7386D5",
                borderColor: "#7386D5",
                "&:hover": {
                  borderColor: "#7386D5",
                },
              }}
              onClick={handleLogoutClick}
            >
              Logout
            </Button>
          </Box>
        </Drawer>

        <StudentCrud open={isAddStudentOpen} handleClose={handleCloseModal} />
        <ProjectCrud open={isAddProjectOpen} handleClose={handleCloseModal} />
      </div>
    </ThemeProvider>
  );
};

export default Sidebar;

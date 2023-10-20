import React, { useState, useEffect } from "react";
import Axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import AspirationForm from "../components/AspirationForm";
import LoginAlert from "../components/LoginAlert";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import { Box } from "@mui/material";
import FavouriteCourseButton from "../components/FavouriteCourseButton";
import CourseDetails from "../components/CourseDetails";
import { Container, Typography, Paper, Grid } from "@mui/material";

function IndividualCourse() {
  const [course, setCourse] = useState(null);
  const { courseName } = useParams();
  const [isLoginAlertOpen, setIsLoginAlertOpen] = useState(false);
  const [isIconClicked, setIsIconClicked] = React.useState();
  const navigate = useNavigate();
  const API_BASE_URL =
    import.meta.env.VITE_BASE_URL || "http://localhost:8000/api";

  const handleLoginAlertClose = () => {
    setIsLoginAlertOpen(false);
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const handleClick = () => {
    setIsIconClicked(!isIconClicked);
  };

  useEffect(() => {
    async function getIndividualCourse() {
      try {
        const response = await Axios.get(
          `${API_BASE_URL}/courses/${courseName}`,
          { withCredentials: true }
        );
        setCourse(response.data);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          setIsLoginAlertOpen(true);
        }
      }
    }
    getIndividualCourse();
  }, [courseName]);

  return (
    <>
      <Box
        sx={{
          height: "68px",
          background:
            "linear-gradient(90deg,rgb(225, 234, 238) 0%,rgb(245, 245, 245) 30%,rgb(245, 245, 245) 60%,rgb(225, 234, 238) 100%",
        }}
      />
      <LoginAlert
        open={isLoginAlertOpen}
        handleClose={handleLoginAlertClose}
        handleLogin={handleLogin}
      />
      {course ? (
        <Grid
          sx={{
            ml: { xs: "6vw", md: "11vw" },
            mr: { xs: "4vw", md: "11vw" },
          }}
        >
          <Grid container sx={{ my: 4 }}>
            <Grid item xs={10}>
              <Paper sx={{ p: 1 }}>
                <Typography
                  variant="h5"
                  align="center"
                  color="main"
                  fontWeight="Bold"
                >
                  {course.course_name}
                </Typography>
              </Paper>
            </Grid>
            <Grid
              item
              xs={2}
              display="flex"
              sx={{ justifyContent: { xs: "flex-end" } }}
            >
              <FavouriteCourseButton
                isIconClicked={isIconClicked}
                onClick={handleClick}
              />
            </Grid>
          </Grid>
          <Paper sx={{ my: 4, p: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Course Description:
            </Typography>
            <Typography
              variant="p"
              sx={{ fontSize: { xs: "1rem", sm: "1.1rem" } }}
            >
              {course.description}
            </Typography>
          </Paper>
          <Paper sx={{ my: 4, p: 2 }}>
            <CourseDetails course={course} />
          </Paper>
          <Paper sx={{ my: 6, p: 2 }}>
            <AspirationForm course={course.course_name} />
          </Paper>
        </Grid>
      ) : (
        <Stack
          spacing={2}
          sx={{
            ml: { xs: "6vw", md: "11vw" },
            mr: { xs: "4vw", md: "11vw" },
            my: 4,
          }}
        >
          <Skeleton variant="rounded" animation="wave" height={48} />
          <Skeleton variant="rounded" animation="wave" height={100} />
          <Skeleton variant="rounded" animation="wave" height={1300} />
          <Skeleton variant="rounded" animation="wave" height={206} />
        </Stack>
      )}
    </>
  );
}

export default IndividualCourse;

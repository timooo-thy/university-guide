import React from "react";
import { useState, useEffect } from "react";
import Axios from "axios";
import AlertSnackbar from "./AlertSnackbar";
import {
  Box,
  Typography,
  Container,
  Button,
  CssBaseline,
  Checkbox,
  Grid,
} from "@mui/material";

export const Favourites = ({ userFavourites, userId }) => {
  const [favouriteCourses, setFavouriteCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [errorSubmit, setErrorSubmit] = useState(false);
  const [severity, setSeverity] = useState("success");
  const [alertMessage, setAlertMessage] = useState("");
  const cloudinaryBaseUrl = "https://res.cloudinary.com/dm9pja9iv/image/upload";
  const transformations = `q_auto,c_crop,ar_16:9`;

  const API_BASE_URL =
    import.meta.env.VITE_BASE_URL || "http://localhost:8000/api";

  const images_url = [
    "mymt9db8e27v04ssrzas",
    "vkdlad7t7owob2dmqffo",
    "b3xyykkrxxz07qq7sbgu",
    "wf9akjqihv5ihfi97sow",
    "wwhqg30nlx6bp2qar95b",
    "idsepyxntjfrfudxtz7a",
    "qavzs3xmovhzvwym8fzm",
    "fnvunm6byiarwvdpeoar",
    "liudpy3zvvzrmfhj9ffs",
    "a8bzn29m9rh2bfzv96xz",
    "potodngpcwgww58sdtb6",
    "m226abwygwbdxexlnwvk",
    "avnvtngniuhxemhbseju",
    "ndpaf7fqzzrz4ubnydgd",
    "xh3wjru6gx81gkcn7yec",
    "ss5ekhnpnnsqynhjhnzp",
    "wc8kmjhy4seg5tozddtn",
    "gzcnnem7dfbl8bakbwge",
    "id9lejzqhr001dkzglnw",
    "xdgeewqdfbnwurfkveke",
  ];

  // Fetch user favourites
  useEffect(() => {
    async function getFavouriteCourses() {
      try {
        const response = await Axios.get(
          `${API_BASE_URL}/profile/${userId}/favourites`,
          {
            params: userFavourites, // Pass query parameters here
            withCredentials: true, // Set withCredentials here
          }
        );

        if (response.status === 200) {
          setFavouriteCourses(response.data);
        }
      } catch (error) {
        ("Failed to fetch user favourites. Please try again later.");
      }
    }
    getFavouriteCourses();
  }, []);

  //on edit click
  const onEditClick = () => {
    setEditMode(true);
  };

  // on select checkbox
  const onCheckboxChange = (courseName) => {
    setSelectedCourse((prevSelectedCourses) => {
      if (prevSelectedCourses.includes(courseName)) {
        return prevSelectedCourses.filter(
          (coursename) => coursename !== courseName
        );
      } else {
        return [...prevSelectedCourses, courseName];
      }
    });
  };
  // //on submit click
  const onSubmitClick = async () => {
    const filteredCourses = favouriteCourses.filter(
      (courseName) => !selectedCourse.includes(courseName)
    );

    setEditMode(false);
    setSelectedCourse([]);
    try {
      const response = await Axios.put(
        `${API_BASE_URL}/profile/${userId}/favourites/submit`,
        {
          filteredCourses,
        },
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        setAlertMessage("Changes saved successfully!");
        setFavouriteCourses(filteredCourses);
        setShowAlert(true);
      }
    } catch (error) {
      setSeverity("error");
      setAlertMessage(
        "An error occurred while saving changes. Please try again later."
      );
      setErrorSubmit(true);
      setShowAlert(true);
    }
  };

  // on cancel click
  const onCancelClick = (e) => {
    e.preventDefault();
    setEditMode(false);
    setErrorSubmit(false);
    setShowAlert(false);
    setSelectedCourse([]);
  };

  return (
    <>
      <AlertSnackbar
        alertMessage={alertMessage}
        open={showAlert}
        setOpen={setShowAlert}
        severity={severity}
      />
      <Container component="main" maxWidth="lg">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography component="h1" variant="h4" sx={{ marginBottom: 3 }}>
            My Favourites
          </Typography>

          <Grid
            container
            spacing={2}
            height="65%"
            width="95%"
            sx={{
              mt: 1,
              border: "1px solid black",
              borderRadius: "10px",
              paddingBottom: "15px",
              display: "flex",
              alignItems: "space-between",
              flexWrap: "wrap",
              backgroundColor: "white",
              overflowY: "auto",
              mx: 0,
              paddingRight: "15px",
            }}
          >
            {Array.isArray(favouriteCourses) &&
              favouriteCourses.map((courseName, index) => (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  key={courseName}
                  sx={{
                    maxHeight: "400px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      objectFit: "cover",
                      backgroundColor: "#f6f6f6",
                      borderRadius: "10px",
                      maxHeight: "370px",
                      border: "1px solid black",
                    }}
                  >
                    <Typography
                      component="h1"
                      variant="h6"
                      fontWeight="bold"
                      sx={{
                        textAlign: "center",
                        backgroundColor: "#f6f6f6",
                        height: "68px",
                        my: 0.5,
                        display: "flex",
                        alignItems: "center",
                        width: "100%",
                        borderRadius: "10px",
                        justifyContent: "space-evenly",
                      }}
                    >
                      <Button
                        variant="contained"
                        href={`/explore/${courseName}`}
                        sx={{
                          backgroundColor: "#f6f6f6",
                          fontSize: {
                            xs: "0.6rem",
                            md: "0.75rem",
                            lg: "1rem",
                          },
                          fontWeight: "bold",
                          color: "primary.main",
                          border: "none",
                          boxShadow: "none",
                          "&:hover": {
                            backgroundColor: "#ebebeb",
                          },
                          flex: 1,
                        }}
                      >
                        {courseName}
                      </Button>
                      {editMode && (
                        <Checkbox
                          onClick={() => onCheckboxChange(courseName)}
                          sx={{ p: 0, marginRight: editMode ? "15px" : "0" }}
                        ></Checkbox>
                      )}
                    </Typography>

                    <img
                      src={`${cloudinaryBaseUrl}/${transformations}/v1/sguniguide/${
                        images_url[index % images_url.length]
                      }`}
                      alt="Course Image"
                      style={{
                        maxWidth: "100%",
                        maxHeight: "300px",
                        loading: "lazy",
                        borderBottomRightRadius: "8px",
                        borderBottomLeftRadius: "8px",
                        borderTop: "1px solid black",
                      }}
                    />
                  </div>
                </Grid>
              ))}
          </Grid>

          {editMode ? (
            <>
              <Button
                type="submit"
                variant="contained"
                sx={{ mt: 3, mb: 1, width: "145px" }}
                onClick={onSubmitClick}
                color="secondary"
              >
                Delete Selected
              </Button>
              <Button
                type="submit"
                variant="contained"
                sx={{ mt: 0, mb: 1, width: "145px" }}
                onClick={onCancelClick}
                color="secondary"
              >
                Cancel Selection
              </Button>
            </>
          ) : (
            <Button
              variant="contained"
              sx={{
                mt: 3,
                mb: 1,
                color: "white",
                width: "145px",
              }}
              onClick={onEditClick}
              color="secondary"
            >
              Edit Favourites
            </Button>
          )}
        </Box>
      </Container>
    </>
  );
};

export default Favourites;

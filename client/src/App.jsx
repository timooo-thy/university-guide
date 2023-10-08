import "./App.css";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";
import Courses from "./pages/Courses";
import Explore from "./pages/Explore";
import Statistics from "./pages/Statistics";
import IndividualCourse from "./pages/IndividualCourse";
import { createTheme, ThemeProvider} from "@mui/material/styles"

const theme = createTheme({
  palette:{
    primary:{
      main:"#A2B29F"
    }
  },
  typography:{
    h6:{
      color: "#FFFFFF"
    }
  }
})

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:courseName" element={<IndividualCourse />} />
          <Route path="/statistics" element={<Statistics />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
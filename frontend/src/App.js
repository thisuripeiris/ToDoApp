import './App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Home from './Pages/Home';
import Signup from './Auth/Signup';
import Login from './Auth/Login';
import Profile from './Pages/Profile';
import AboutUs from './Pages/AboutUs';

function App() {

  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Signup" element={<Signup />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Profile" element={<Profile />} />
          <Route path="/AboutUs" element={<AboutUs />} />

        </Routes>
        <ToastContainer />
      </div>
    </Router>
  );
}

export default App;

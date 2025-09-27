import logo from "./logo.svg";
import "./App.css";

import WorldMap from "./components/WorldMap";
import WelcomePage from "./pages/home/WelcomePage";
import RegistrationLogin from "./pages/auth/RegistrationLogin";
import HUbbleExperience from "./pages/Hubble/Hubble";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/Explora" element={<WelcomePage />} />
        <Route path="/Explora/login" element={<RegistrationLogin />} />
<<<<<<< HEAD
        <Route path="/" element={<WorldMap />} />
        // <Route path="/HUbbleExperience" element={<HUbbleExperience />} />
=======
        <Route path="/Explora/home" element={<WorldMap />} />
>>>>>>> e5d0ef8 (Update ProfileModal, Sidebar, WorldMap, and styles)
      </Routes>
    </Router>
  );
}

export default App;

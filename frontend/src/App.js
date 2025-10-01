import logo from "./logo.svg";
import "./App.css";

import WorldMap from "./components/WorldMap";
import WelcomePage from "./pages/welcome/WelcomePage";
import RegistrationLogin from "./pages/auth/RegistrationLogin";
import Home from './pages/home/Home'
// import HUbbleExperience from "./pages/Hubble/Hubble";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/Explora" element={<WelcomePage />} />
        <Route path="/Explora/login" element={<RegistrationLogin />} />
        <Route path="/Explora/home" element={<Home/>} />
        <Route path="/Explora/worldmap" element={<WorldMap />} />
        

      </Routes>
    </Router>
  );
}

export default App;

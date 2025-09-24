import logo from "./logo.svg";
import "./App.css";

import WorldMap from "./components/WorldMap";
import WelcomePage from "./pages/home/WelcomePage";
import RegistrationLogin from "./pages/auth/RegistrationLogin";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/Explora" element={<WelcomePage />} />
        <Route path="/Explora/login" element={<RegistrationLogin />} />
        <Route path="/" element={<WorldMap />} />
        {/* // <Route path="/Explora/guest" element={<GuestPage />} /> */}
      </Routes>
    </Router>
  );
}

export default App;

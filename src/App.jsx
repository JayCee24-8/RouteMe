import { Routes, Route } from "react-router-dom";
import Splash from "./pages/Splash";
import Login from "./pages/Login";
import Guest from "./pages/Guest";
import Home from "./pages/Home";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Splash />} />
      <Route path="/login" element={<Login />} />
      <Route path="/guest" element={<Guest />} />
      <Route path="/home" element={<Home />} />
    </Routes>
  );
}

export default App;

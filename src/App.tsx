import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Admin from "./admin/Admin"; // Halaman beranda
import Home from "./home/Home"; // Halaman admin
import "./App.css";
import Login from "./admin/Login";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

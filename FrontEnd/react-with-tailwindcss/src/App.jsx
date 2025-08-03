import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home"; 
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PlayerAnalysis from "./pages/PlayerAnalysis";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard/*" element={<Dashboard />}>
          <Route path="player/:id" element={<PlayerAnalysis />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

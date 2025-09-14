// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Header from "./Components/Header";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import Matches from "./pages/Matches";
import Analysis from "./pages/Analysis";
import MatchesPages from "./pages/MatchesPages";
import PlayerProfile from "./pages/PlayerProfile";
import BidPro from "./pages/BidPro";
import Footer from "./components/Footer"; 
import ProtectedRoute from "./Components/ProtectedRoute";
import { useAuth } from "./context/UserContext";

function App() {
  const { user } = useAuth(); // check if user is logged in

  return (
    <Router>
      <Header />
      <Routes>
        {/* Default route → redirect based on auth */}
        <Route path="/" element={user ? <Navigate to="/home" /> : <Navigate to="/signup" />} />

        {/* Auth routes */}
        <Route path="/signup" element={user ? <Navigate to="/home" /> : <Signup />} />
        <Route path="/login" element={user ? <Navigate to="/home" /> : <Login />} />
          <Route path="/bidpro" element={<BidPro />} />
          <Route path="/analysis" element={<Analysis />} />
          <Route path="/player/:id" element={<PlayerProfile />} />

        {/* Protected app routes */}
        <Route path="/home" element={user ? <Home /> : <Navigate to="/login" />} />
        <Route path="/matches" element={user ? <Matches /> : <Navigate to="/login" />} />
        <Route path="/matches/:id" element={user ? <MatchesPages /> : <Navigate to="/login" />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;

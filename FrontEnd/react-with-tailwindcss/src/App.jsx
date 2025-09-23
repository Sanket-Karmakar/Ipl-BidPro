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
import ContestPage from "./pages/ContestPage";
import CreateTeamPage from "./pages/CreateTeamPage";
import CVCSelectionPage from "./pages/CVCSelectionPage";
import TeamPreviewPage from "./pages/TeamPreviewPage";
import ViewTeamPage from "./pages/ViewTeamPage";
import BidPro from "./pages/BidPro";
import Footer from "./components/Footer"; 
import ProtectedRoute from "./Components/ProtectedRoute";
import { useAuth } from "./context/UserContext";

function App() {
  const { user } = useAuth();

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        {/* Fixed Header */}
        <Header />

        {/* Main Content → push below header */}
        <main className="flex-1 pt-16 bg-gray-50">
          <Routes>
            {/* Default route */}
            <Route path="/" element={user ? <Navigate to="/home" /> : <Navigate to="/signup" />} />

            {/* Auth */}
            <Route path="/signup" element={user ? <Navigate to="/home" /> : <Signup />} />
            <Route path="/login" element={user ? <Navigate to="/home" /> : <Login />} />

            {/* Public */}
            <Route path="/bidpro" element={<BidPro />} />
            <Route path="/analysis" element={<Analysis />} />
            <Route path="/player/:id" element={<PlayerProfile />} />

            {/* Matches + Contests */}
            <Route path="/matches/:matchId/contests" element={<ContestPage />} />
            <Route path="/matches/:matchId/create-team" element={<CreateTeamPage />} /> 
            <Route path="/matches/:matchId/select-cvc" element={<CVCSelectionPage />} />
            <Route path="/matches/:matchId/teams/:teamId" element={<TeamPreviewPage />} />
            <Route path="/matches/:matchId/view-team/:teamIndex" element={<ViewTeamPage />} />

            {/* Protected */}
            <Route path="/home" element={user ? <Home /> : <Navigate to="/login" />} />
            <Route path="/matches" element={user ? <Matches /> : <Navigate to="/login" />} />
            <Route path="/matches/:id" element={user ? <MatchesPages /> : <Navigate to="/login" />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/profile" element={<Profile />} />
            </Route>
          </Routes>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;

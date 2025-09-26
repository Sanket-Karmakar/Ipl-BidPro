// src/pages/ContestPage.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/UserContext";
import TeamCard from "../components/TeamCard";
import { normalizeRole } from "../utils/roleUtils";

export default function ContestPage() {
  const [activeTab, setActiveTab] = useState("contests"); // contests | mycontests | teams
  const { matchId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  const [contests, setContests] = useState([]);
  const [myContests, setMyContests] = useState([]);
  const [teams, setTeams] = useState([]);

  const [loadingContests, setLoadingContests] = useState(true);
  const [loadingTeams, setLoadingTeams] = useState(true);
  const [loadingMyContests, setLoadingMyContests] = useState(true);

  const { token, user } = useAuth();

  const isBlocked =
    state?.matchEnded || (state?.status && state.status.toLowerCase().includes("live"));

  // ✅ Fetch available contests for this match
  useEffect(() => {
    let mounted = true;
    async function fetchContests() {
      setLoadingContests(true);
      try {
        const res = await fetch(
          `http://localhost:5001/api/contests/available?matchId=${matchId}`
        );
        if (!res.ok) {
          setContests([]);
          return;
        }
        const data = await res.json();
        if (!mounted) return;
        setContests(Array.isArray(data.contests) ? data.contests : []);
      } catch (err) {
        console.error("Error fetching contests:", err);
        setContests([]);
      } finally {
        setLoadingContests(false);
      }
    }
    fetchContests();
    return () => {
      mounted = false;
    };
  }, [matchId]);

  // ✅ Fetch my joined contests for this match
  useEffect(() => {
    let mounted = true;
    async function fetchMyContests() {
      setLoadingMyContests(true);
      try {
        if (!token || !user?._id) {
          setMyContests([]);
          return;
        }
        const res = await fetch(
          `http://localhost:5001/api/contests/my-contests?userId=${user._id}&matchId=${matchId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!res.ok) {
          setMyContests([]);
          return;
        }
        const data = await res.json();
        if (!mounted) return;
        setMyContests(Array.isArray(data.contests) ? data.contests : []);
      } catch (err) {
        console.error("Error fetching my contests:", err);
        setMyContests([]);
      } finally {
        setLoadingMyContests(false);
      }
    }
    fetchMyContests();
    return () => {
      mounted = false;
    };
  }, [matchId, token, user]);

  // ✅ Fetch teams for this match
  useEffect(() => {
    let mounted = true;
    async function fetchTeams() {
      setLoadingTeams(true);
      try {
        if (!token) {
          setTeams([]);
          return;
        }
        const res = await fetch(`http://localhost:5001/api/teams/${matchId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          setTeams([]);
          return;
        }
        let data = await res.json();
        data = data.map((t) => ({
          ...t,
          players: (t.players || []).map((p) => ({
            ...p,
            role: normalizeRole(p.role),
            playerImg:
              p.playerImg ??
              p.image ??
              (p.playerId
                ? `https://h.cricapi.com/img/players/${p.playerId}.jpg`
                : ""),
            playerName: p.playerName ?? p.name ?? "",
            teamName: p.teamName ?? p.team ?? "",
          })),
        }));
        if (!mounted) return;
        setTeams(data);
      } catch (err) {
        console.error("Error fetching teams:", err);
        setTeams([]);
      } finally {
        setLoadingTeams(false);
      }
    }
    fetchTeams();
    return () => {
      mounted = false;
    };
  }, [matchId, token, activeTab]);

  // ✅ Delete team
  const handleRemove = async (teamId) => {
    if (!token) return alert("You must be logged in to delete a team.");
    if (!window.confirm("Are you sure you want to remove this team?")) return;

    try {
      const res = await fetch(`http://localhost:5001/api/teams/${teamId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to delete team");
      }
      setTeams((prev) => prev.filter((t) => t._id !== teamId));
    } catch (error) {
      console.error("❌ Error deleting team:", error);
      alert(error.message || "Could not delete team");
    }
  };

  // ✅ Join contest
  const handleJoinContest = (contest) => {
    if (isBlocked) {
      alert("Match already live/ended. You can't join contests.");
      return;
    }
    if (!token) {
      navigate("/login");
      return;
    }
    if (!teams || teams.length === 0) {
      if (window.confirm("You have no teams for this match. Create a team now?")) {
        navigate(`/matches/${matchId}/create-team`);
      }
      return;
    }
    navigate(`/matches/${matchId}/contests/${contest._id}/join`, {
      state: { contest, teams },
    });
  };

  // ✅ Render contest card
  const renderContestCard = (contest) => {
    const spotsFilled = Array.isArray(contest.joinedUsers)
      ? contest.joinedUsers.length
      : 0;
    const maxTeams = contest.maxTeams ?? 100;
    const spotsLeft = Math.max(maxTeams - spotsFilled, 0);
    const progress = Math.min(100, Math.round((spotsFilled / maxTeams) * 100));

    return (
      <div
        key={contest._id}
        className="bg-white shadow-md rounded-xl p-4 mb-4 hover:shadow-lg transition"
      >
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-bold text-lg">{contest.title}</h3>
            <p className="text-sm text-gray-500 mt-1">
              Entry Fee: <span className="font-semibold">₹{contest.entryFee}</span>
            </p>
            <p className="text-sm text-gray-500">
              Max Teams: <span className="font-semibold">{maxTeams}</span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-700 font-semibold">
              {contest.status || "Upcoming"}
            </p>
          </div>
        </div>

        {/* Progress */}
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="h-2 bg-green-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-xs text-gray-500 mt-2">
            <span>{spotsFilled} Joined</span>
            <span>{spotsLeft} Spots Left</span>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-4">
          <button
            onClick={() => handleJoinContest(contest)}
            className="w-full bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 disabled:opacity-60"
            disabled={isBlocked}
          >
            JOIN
          </button>
          {(!teams || teams.length === 0) && (
            <button
              onClick={() => navigate(`/matches/${matchId}/create-team`)}
              className="w-full mt-2 border border-gray-300 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-50"
            >
              CREATE A TEAM
            </button>
          )}
        </div>
      </div>
    );
  };

  // ✅ Tab rendering
  const renderContent = () => {
    if (isBlocked) {
      return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center">
          <p className="text-gray-700 mb-4 font-medium">
            This match is live or completed. You can't create or join contests now.
          </p>
        </div>
      );
    }

    switch (activeTab) {
      case "contests":
        return (
          <div className="p-6">
            {loadingContests ? (
              <p className="text-center text-gray-500">Loading contests...</p>
            ) : contests.length === 0 ? (
              <p className="text-center text-gray-500">No Available Contests</p>
            ) : (
              contests.map((c) => renderContestCard(c))
            )}
          </div>
        );
      case "mycontests":
        return (
          <div className="p-6">
            {loadingMyContests ? (
              <p className="text-center text-gray-500">Loading your contests...</p>
            ) : myContests.length === 0 ? (
              <p className="text-center text-gray-500">
                You haven’t joined any contests for this match yet.
              </p>
            ) : (
              myContests.map((c) => renderContestCard(c))
            )}
          </div>
        );
      case "teams":
        return (
          <div className="p-6">
            {loadingTeams ? (
              <p className="text-center text-gray-500">Loading your teams...</p>
            ) : teams.length === 0 ? (
              <div className="flex flex-col items-center text-center">
                <p className="text-gray-600 mb-4">
                  You haven’t created a team yet.
                </p>
                <button
                  onClick={() => navigate(`/matches/${matchId}/create-team`)}
                  className="bg-green-500 text-white px-5 py-2 rounded-md font-bold hover:bg-green-600"
                >
                  CREATE A TEAM
                </button>
              </div>
            ) : (
              teams.map((team) => (
                <TeamCard
                  key={team._id}
                  team={team}
                  onEdit={() =>
                    navigate(`/matches/${matchId}/create-team`, {
                      state: { editTeam: team },
                    })
                  }
                  onView={() =>
                    navigate(`/matches/${matchId}/view-team/${team._id}`)
                  }
                  onRemove={() => handleRemove(team._id)}
                />
              ))
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Tabs */}
      <div className="flex border-b bg-white">
        {["contests", "mycontests", "teams"].map((tab) => (
          <button
            key={tab}
            className={`flex-1 py-3 font-semibold ${
              activeTab === tab
                ? "text-red-600 border-b-2 border-red-600"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === "mycontests"
              ? `My Contests (${myContests.length})`
              : tab === "teams"
              ? `Teams (${teams.length})`
              : "Contests"}
          </button>
        ))}
      </div>

      {renderContent()}
    </div>
  );
}

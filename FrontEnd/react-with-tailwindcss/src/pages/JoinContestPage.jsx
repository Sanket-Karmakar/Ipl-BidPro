// src/pages/JoinContestPage.jsx
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/UserContext";

export default function JoinContestPage() {
  const { matchId, contestId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const { token, user } = useAuth(); // ✅ ensure user is available

  const contestFromState = state?.contest || null;
  const teamsFromState = state?.teams || [];

  const [contest, setContest] = useState(contestFromState);
  const [teams, setTeams] = useState(teamsFromState || []);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [loadingTeams, setLoadingTeams] = useState(false);
  const [joining, setJoining] = useState(false);

  // ✅ Fetch teams if not passed via state
  useEffect(() => {
    let mounted = true;
    async function fetchTeams() {
      if (teamsFromState && teamsFromState.length) return;
      if (!token) {
        setTeams([]);
        return;
      }

      setLoadingTeams(true);
      try {
        const res = await fetch(`http://localhost:5001/api/teams/${matchId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          console.error("Failed to fetch teams", res.status);
          if (!mounted) return;
          setTeams([]);
          return;
        }
        const data = await res.json();
        if (!mounted) return;
        setTeams(data || []);
      } catch (err) {
        console.error("Error fetching teams:", err);
        if (!mounted) return;
        setTeams([]);
      } finally {
        if (mounted) setLoadingTeams(false);
      }
    }
    fetchTeams();
    return () => (mounted = false);
  }, [matchId, token, teamsFromState]);

  // ✅ Fetch contest if not passed via state
  useEffect(() => {
    let mounted = true;
    async function fetchContest() {
      if (contestFromState) return;
      try {
        const res = await fetch(`http://localhost:5001/api/contests/${contestId}`);
        if (!res.ok) return;
        const data = await res.json();
        if (!mounted) return;
        setContest(data.contest ?? data);
      } catch (err) {
        console.error("Error fetching contest details:", err);
      }
    }
    if (contestId) fetchContest();
    return () => (mounted = false);
  }, [contestId, contestFromState]);

  // ✅ ID normalizer
  const getId = (obj) => obj?._id ?? obj?.id ?? null;

  // ✅ Join Contest
  const handleJoin = async () => {
    try {
      if (!token) {
        alert("You must be logged in to join a contest.");
        return;
      }
      if (!selectedTeam) {
        alert("Please select a team to join with.");
        return;
      }
      if (!user?._id) {
        alert("User info missing, please login again.");
        return;
      }

      const payload = {
        userId: user._id,          // ✅ required by backend now
        contestId: contest._id,    // contest being joined
        teamId: getId(selectedTeam),
        matchId,                   // match this contest belongs to
      };

      console.log("Joining with payload:", payload);

      setJoining(true);
      const res = await fetch("http://localhost:5001/api/contests/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to join contest");
      }

      const data = await res.json();
      console.log("✅ Joined contest:", data);

      alert("Successfully joined contest!");
      navigate(`/matches/${matchId}/contests`);
    } catch (error) {
      console.error("❌ Join API error:", error);
      alert(error.message);
    } finally {
      setJoining(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-xl font-bold mb-4">Join Contest</h1>

        {/* Contest Info */}
        <div className="bg-white p-4 rounded-lg shadow mb-4">
          <h2 className="font-semibold text-lg">{contest?.name ?? "Contest"}</h2>
          <p className="text-sm text-gray-600">
            Entry Fee: <span className="font-semibold">₹{contest?.entryFee ?? "-"}</span>
          </p>
          <p className="text-sm text-gray-600">Max Teams: {contest?.maxTeams ?? "-"}</p>
        </div>

        {/* Teams List */}
        <h3 className="text-md font-semibold mb-2">Select Team</h3>

        {loadingTeams ? (
          <p className="text-center text-gray-500">Loading your teams...</p>
        ) : teams.length === 0 ? (
          <div className="text-center">
            <p className="text-gray-600 mb-4">You don't have any teams for this match yet.</p>
            <button
              onClick={() => navigate(`/matches/${matchId}/create-team`)}
              className="px-4 py-2 bg-green-600 text-white rounded"
            >
              Create a Team
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {teams.map((t) => {
              const id = getId(t);
              return (
                <div
                  key={id}
                  onClick={() => setSelectedTeam(t)}
                  className={`p-4 rounded-lg cursor-pointer border ${
                    getId(selectedTeam) === id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-semibold">
                        {t.teamName || t.name || `Team ${id}`}
                      </div>
                      <div className="text-xs text-gray-500">
                        {(t.players?.length ?? 0) + " Players"}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Join Button */}
        <div className="mt-6">
          <button
            onClick={handleJoin}
            disabled={joining || !selectedTeam}
            className={`w-full py-2 rounded-lg font-semibold ${
              !selectedTeam || joining
                ? "bg-gray-400 text-white"
                : "bg-red-600 text-white hover:bg-red-700"
            }`}
          >
            {joining ? "Joining..." : "Join Contest"}
          </button>
        </div>
      </div>
    </div>
  );
}

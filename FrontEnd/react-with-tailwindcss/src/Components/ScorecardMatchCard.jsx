import { useNavigate } from "react-router-dom";

function ScorecardMatchCard({ match }) {
  const { teamInfo, name, venue, status, matchEnded, matchStarted, score, dateTimeGMT, matchId } = match;
  const navigate = useNavigate();

  const isLive = matchStarted && !matchEnded;

  // Format date & time
  const matchDate = new Date(dateTimeGMT);
  const localDate = matchDate.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const localTime = matchDate.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <div
      className={`relative bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-5 cursor-pointer border ${
        isLive
          ? "border-red-200 ring-2 ring-red-100"
          : matchEnded
          ? "border-gray-100"
          : "border-blue-100"
      }`}
      onClick={() => navigate(`/matches/${matchId}/scorecard`)}
    >
      {/* Live badge */}
      {isLive && (
        <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-red-50 px-2.5 py-1 rounded-full">
          <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          <span className="text-red-600 text-xs font-bold uppercase">Live</span>
        </div>
      )}

      {/* Teams */}
      <div className="flex items-center justify-between">
        {teamInfo?.map((team, idx) => (
          <div key={idx} className="flex flex-col items-center w-1/3">
            <img
              src={team.img}
              alt={team.name}
              className="w-12 h-12 object-contain mb-2"
            />
            <p className="text-sm font-semibold text-gray-800">{team.shortname || team.name}</p>
            {/* Live/completed score under team name */}
            {(isLive || matchEnded) && score?.[idx] && (
              <p className={`text-sm font-bold mt-1 ${isLive ? "text-red-600" : "text-gray-700"}`}>
                {score[idx].r}/{score[idx].w}
                <span className="text-xs text-gray-400 font-normal ml-1">
                  ({score[idx].o} ov)
                </span>
              </p>
            )}
          </div>
        ))}
        {/* VS badge in center */}
        <div className="flex flex-col items-center w-1/3">
          <span className="text-gray-300 font-bold text-lg">VS</span>
        </div>
      </div>

      {/* Match Name */}
      <p className="mt-3 text-center text-gray-700 text-sm font-medium">{name}</p>

      {/* Date + Venue */}
      <p className="text-xs text-gray-500 text-center">
        📅 {localDate} • ⏰ {localTime}
      </p>
      <p className="text-xs text-gray-500 text-center">📍 {venue}</p>

      {/* Status */}
      {matchEnded ? (
        <div className="mt-2 text-center">
          <p className="text-sm font-bold text-green-600">{status}</p>
        </div>
      ) : isLive ? (
        <p className="mt-2 text-center text-sm text-red-500 font-semibold">{status}</p>
      ) : (
        <p className="mt-2 text-center text-sm text-blue-500">{status}</p>
      )}

      {/* Action buttons */}
      <div className="mt-3 flex justify-center">
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/matches/${matchId}/scorecard`);
          }}
          className={`px-8 py-2.5 rounded-lg text-sm font-bold transition ${
            isLive
              ? "bg-red-500 text-white hover:bg-red-600"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          {isLive ? "🔴 View Live Scorecard" : "📋 View Scorecard"}
        </button>
      </div>
    </div>
  );
}

export default ScorecardMatchCard;

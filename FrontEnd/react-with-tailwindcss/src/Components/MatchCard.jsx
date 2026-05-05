import { useNavigate } from "react-router-dom";

function MatchCard({ match }) {
  const { teamInfo, name, venue, status, matchEnded, score, dateTimeGMT, matchId } = match;
  const navigate = useNavigate();

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
      onClick={() =>
  navigate(`/matches/${matchId}/contests`, {
    state: { status, matchEnded },
  })
}
      className="bg-white rounded-2xl shadow-md p-5 cursor-pointer border border-gray-100"
    >
      {/* Teams */}
      <div className="flex items-center justify-between">
        {teamInfo?.map((team, idx) => (
          <div key={idx} className="flex flex-col items-center w-1/2">
            <img
              src={team.img}
              alt={team.name}
              className="w-12 h-12 object-contain mb-2"
            />
            <p className="text-sm font-semibold">{team.shortname || team.name}</p>
          </div>
        ))}
      </div>

      {/* Match Name */}
      <p className="mt-3 text-center text-gray-700 text-sm font-medium">{name}</p>

      {/* Date + Venue */}
      <p className="text-xs text-gray-500 text-center">
        📅 {localDate} • ⏰ {localTime}
      </p>
      <p className="text-xs text-gray-500 text-center">📍 {venue}</p>

      {/* Completed Match → show result + score */}
      {matchEnded ? (
        <div className="mt-2 text-center">
          {score?.length > 0 ? (
            <div className="space-y-1">
              {score.map((s, i) => (
                <p key={i} className="text-xs text-gray-700">
                  <span className="font-semibold">{s.inning}</span>: {s.r}/{s.w} ({s.o} ov)
                </p>
              ))}
            </div>
          ) : null}
          <p className="mt-1 text-sm font-bold text-green-600">{status}</p>
        </div>
      ) : (
        // Upcoming/Ongoing
        <div className="mt-2 text-center">
          <p className="text-sm text-blue-500 mb-3">{status}</p>
          {status === 'UPCOMING' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/matches/${matchId}/preview`);
              }}
              className="w-full py-2 bg-gradient-to-r from-[#0f172a] to-[#1e293b] text-white text-xs font-bold rounded-lg shadow-sm hover:from-[#1e293b] hover:to-[#334155] transition flex items-center justify-center gap-1"
            >
              <svg className="w-4 h-4 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Fantasy Tips & Preview
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default MatchCard;

import React from 'react';

const PlayerCard = ({ player }) => {
  return (
    <div className="bg-white shadow-md rounded-2xl p-6 w-full max-w-3xl mx-auto my-6">
      {/* Header */}
      <div className="flex items-center gap-6 mb-4">
        <img
          src={player.playerImg || "/placeholder.jpg"}
          alt={player.name}
          className="w-24 h-24 object-cover rounded-full border"
        />
        <div>
          <h2 className="text-2xl font-bold">{player.name}</h2>
          <p className="text-gray-600">{player.role}</p>
          <p className="text-sm text-gray-500">{player.country}</p>
        </div>
      </div>

      {/* Basic Info */}
      <div className="grid grid-cols-2 gap-4 text-sm mb-6">
        {player.dateOfBirth && (
          <div>
            <span className="font-medium text-gray-700">DOB: </span>
            {new Date(player.dateOfBirth).toLocaleDateString()}
          </div>
        )}
        {player.placeOfBirth && (
          <div>
            <span className="font-medium text-gray-700">Place of Birth: </span>
            {player.placeOfBirth}
          </div>
        )}
        {player.battingStyle && (
          <div>
            <span className="font-medium text-gray-700">Batting Style: </span>
            {player.battingStyle}
          </div>
        )}
        {player.bowlingStyle && (
          <div>
            <span className="font-medium text-gray-700">Bowling Style: </span>
            {player.bowlingStyle}
          </div>
        )}
      </div>

      {/* Stats Section */}
      <div>
        <h3 className="text-xl font-semibold mb-3">Career Stats</h3>
        <div className="space-y-4">
          {groupStatsByMatchType(player.stats).map(({ matchType, functions }) => (
            <div key={matchType}>
              <h4 className="text-lg font-bold capitalize">{matchType}</h4>
              {Object.entries(functions).map(([fn, stats]) => (
                <div key={fn} className="ml-4 mt-1">
                  <p className="font-semibold capitalize">{fn}</p>
                  <ul className="list-disc list-inside text-sm text-gray-700">
                    {stats.map((s, i) => (
                      <li key={i}>
                        <span className="font-medium">{s.stat}:</span> {s.value}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Helper function to group stats
const groupStatsByMatchType = (stats = []) => {
  const grouped = {};

  stats.forEach((s) => {
    if (!grouped[s.matchType]) {
      grouped[s.matchType] = {};
    }
    if (!grouped[s.matchType][s.fn]) {
      grouped[s.matchType][s.fn] = [];
    }
    grouped[s.matchType][s.fn].push(s);
  });

  return Object.entries(grouped).map(([matchType, functions]) => ({
    matchType,
    functions,
  }));
};

export default PlayerCard;




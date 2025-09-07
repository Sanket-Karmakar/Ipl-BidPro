import { motion } from "framer-motion";

const MatchCard = ({ match }) => {
  const team1 = match.teamInfo[0];
  const team2 = match.teamInfo[1];

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-md p-4 w-80 flex flex-col justify-between hover:shadow-xl transition"
      whileHover={{ scale: 1.05 }}
    >
      {/* Match Title */}
      <h2 className="text-sm font-semibold text-gray-600 text-center mb-2">
        {match.name}
      </h2>

      {/* Teams */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex flex-col items-center">
          <img
            src={team1?.img}
            alt={team1?.name}
            className="h-12 w-12 object-contain mb-1"
          />
          <p className="text-sm font-bold text-gray-800">{team1?.shortname}</p>
        </div>

        <span className="text-gray-500 font-bold">VS</span>

        <div className="flex flex-col items-center">
          <img
            src={team2?.img}
            alt={team2?.name}
            className="h-12 w-12 object-contain mb-1"
          />
          <p className="text-sm font-bold text-gray-800">{team2?.shortname}</p>
        </div>
      </div>

      {/* Venue & Date */}
      <p className="text-xs text-gray-500 text-center mb-1">📍 {match.venue}</p>
      <p className="text-xs text-gray-500 text-center">
        🕒 {new Date(match.dateTimeGMT).toLocaleString()}
      </p>

      {/* Status */}
      <div
        className={`mt-3 text-center px-3 py-1 rounded-full text-white text-xs font-semibold ${
          match.matchStarted
            ? "bg-red-500 animate-pulse"
            : "bg-green-500"
        }`}
      >
        {match.status}
      </div>
    </motion.div>
  );
};

export default MatchCard;

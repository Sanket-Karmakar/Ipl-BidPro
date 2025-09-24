// src/components/TeamCard.jsx
export default function TeamCard({ team, onEdit, onView, onRemove }) {
  const { teamName, players, captain, viceCaptain } = team;

  // Count roles
  const counts = players.reduce(
    (acc, p) => {
      if (p.role.toLowerCase().includes("wk")) acc.WK++;
      else if (p.role.toLowerCase().includes("bat")) acc.BAT++;
      else if (p.role.toLowerCase().includes("allrounder") || p.role.toLowerCase().includes("ar"))
        acc.AR++;
      else if (p.role.toLowerCase().includes("bowl")) acc.BOWL++;
      return acc;
    },
    { WK: 0, BAT: 0, AR: 0, BOWL: 0 }
  );

  return (
    <div className="border rounded-lg shadow bg-gradient-to-r from-green-50 to-white p-4 mb-4">
      {/* Team Header */}
      <div className="flex justify-between items-center mb-3">
        <h2 className="font-bold">{teamName}</h2>
        <div className="flex gap-3">
          <button onClick={onView} className="text-blue-600 text-sm font-semibold">
            👀 View
          </button>
          <button onClick={onEdit} className="text-yellow-600 text-sm font-semibold">
            ✏️ Edit
          </button>
          <button
            onClick={() => {
              if (window.confirm("Are you sure you want to remove this team?")) {
                onRemove();
              }
            }}
            className="text-red-600 text-sm font-semibold"
          >
            ❌ Remove
          </button>
        </div>
      </div>

      {/* Counts */}
      <div className="grid grid-cols-4 text-center text-xs font-semibold mb-3">
        <p>WK {counts.WK}</p>
        <p>BAT {counts.BAT}</p>
        <p>AR {counts.AR}</p>
        <p>BOWL {counts.BOWL}</p>
      </div>

      {/* Captain + Vice Captain */}
      <div className="flex gap-6 items-center justify-center">
        <div className="flex flex-col items-center">
          <img
            src={captain?.playerImg || "https://via.placeholder.com/60"}
            alt={captain?.name}
            className="w-12 h-12 rounded-full border-2 border-blue-500"
          />
          <p className="text-xs font-semibold">{captain?.name}</p>
          <span className="text-[10px] text-blue-600 font-bold">C</span>
        </div>

        <div className="flex flex-col items-center">
          <img
            src={viceCaptain?.playerImg || "https://via.placeholder.com/60"}
            alt={viceCaptain?.name}
            className="w-12 h-12 rounded-full border-2 border-green-500"
          />
          <p className="text-xs font-semibold">{viceCaptain?.name}</p>
          <span className="text-[10px] text-green-600 font-bold">VC</span>
        </div>
      </div>
    </div>
  );
}

// src/components/SavedTeamModal.jsx
import { Dialog } from "@headlessui/react";

export default function SavedTeamModal({ isOpen, onClose, onDone, team }) {  // ✅ take onDone as prop
  if (!team) return null;

  const { teamName, players, captain, viceCaptain } = team; // ✅ only destructure from team

  // Count by roles
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
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50" aria-hidden="true" />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
          <Dialog.Title className="text-lg font-bold text-gray-800 mb-4">
            Team Saved Successfully 🎉
          </Dialog.Title>

          {/* Team card like Dream11 */}
          <div className="border rounded-lg shadow p-4 bg-gradient-to-r from-green-50 to-white">
            <h2 className="text-base font-semibold mb-2">{teamName}</h2>

            <div className="grid grid-cols-4 text-center text-sm font-semibold mb-3">
              <p>WK {counts.WK}</p>
              <p>BAT {counts.BAT}</p>
              <p>AR {counts.AR}</p>
              <p>BOWL {counts.BOWL}</p>
            </div>

            <div className="flex items-center justify-center gap-6">
              {/* Captain */}
              <div className="flex flex-col items-center">
                <img
                  src={captain?.playerImg || "https://via.placeholder.com/60"}
                  alt={captain?.name}
                  className="w-12 h-12 rounded-full border-2 border-blue-500"
                />
                <p className="text-xs font-semibold">{captain?.name}</p>
                <span className="text-[10px] text-blue-600 font-bold">C</span>
              </div>

              {/* Vice Captain */}
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

          {/* Buttons */}
          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded-md font-semibold hover:bg-gray-300"
            >
              Close
            </button>
            <button
              onClick={onDone} // ✅ this will now work
              className="bg-blue-600 text-white px-4 py-2 rounded-md"
            >
              Done
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}

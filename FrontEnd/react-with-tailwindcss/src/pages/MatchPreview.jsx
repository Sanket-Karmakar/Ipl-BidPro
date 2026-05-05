import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function MatchPreview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [preview, setPreview] = useState(null);
  const [matchDetails, setMatchDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPreview = async () => {
      try {
        setLoading(true);
        // Fetch match details for the header
        const matchRes = await fetch(`/api/matches/${id}`);
        const matchData = await matchRes.json();
        setMatchDetails(matchData);

        // Fetch AI Preview
        const previewRes = await fetch(`/api/matches/${id}/preview`);
        const previewData = await previewRes.json();
        
        if (!previewRes.ok || !previewData.success) {
          throw new Error(previewData.message || 'Failed to load preview');
        }
        
        setPreview(previewData.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPreview();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f0f2f5] pt-24 pb-12 flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#009270] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 font-medium">Generating AI Fantasy Insights...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f0f2f5] pt-24 pb-12 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-md text-center max-w-md w-full mx-4">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Failed to load Preview</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button onClick={() => navigate(-1)} className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition">Go Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f0f2f5] pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
        
        {/* Header Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-[#0f172a] to-[#1e293b] p-6 text-white text-center">
            <h1 className="text-2xl font-bold mb-1">Match Preview & Fantasy Tips</h1>
            <p className="text-gray-300 text-sm">{matchDetails?.name || 'Upcoming Match'}</p>
          </div>
          <div className="p-6 bg-white flex flex-col md:flex-row items-center justify-center gap-8 border-b border-gray-100">
            <div className="text-center">
              <img src={matchDetails?.teamInfo?.[0]?.img || "https://via.placeholder.com/60"} alt="Team 1" className="w-20 h-20 object-contain mx-auto mb-2" />
              <h3 className="font-bold text-gray-900">{matchDetails?.teams?.[0]}</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-500 shrink-0">VS</div>
            <div className="text-center">
              <img src={matchDetails?.teamInfo?.[1]?.img || "https://via.placeholder.com/60"} alt="Team 2" className="w-20 h-20 object-contain mx-auto mb-2" />
              <h3 className="font-bold text-gray-900">{matchDetails?.teams?.[1]}</h3>
            </div>
          </div>
          <div className="p-4 bg-gray-50 flex items-center justify-center gap-2 text-sm text-gray-600 font-medium">
            <svg className="w-4 h-4 text-[#009270]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {matchDetails?.venue || 'Venue TBD'}
          </div>
        </div>

        {/* Pitch & Weather */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 border-t-4 border-t-[#009270]">
            <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span className="text-2xl">🏏</span> Pitch Report
            </h3>
            <p className="text-gray-700 leading-relaxed">{preview?.pitchReport || 'No pitch report available.'}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 border-t-4 border-t-blue-500">
            <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span className="text-2xl">⛅</span> Weather Condition
            </h3>
            <p className="text-gray-700 leading-relaxed">{preview?.weatherCondition || 'No weather forecast available.'}</p>
          </div>
        </div>

        {/* Top Picks */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span className="text-2xl">⭐</span> Top Fantasy Picks
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {preview?.topPicks?.map((pick, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-5 border border-gray-100 hover:shadow-md transition">
                <h4 className="font-bold text-gray-900 text-lg mb-2">{pick.name}</h4>
                <p className="text-sm text-gray-600">{pick.reason}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Fantasy Tips */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 border-l-4 border-l-yellow-400">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="text-2xl">💡</span> Expert Tips
          </h3>
          <ul className="space-y-3">
            {preview?.fantasyTips?.map((tip, index) => (
              <li key={index} className="flex items-start gap-3 text-gray-700">
                <svg className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {tip}
              </li>
            ))}
          </ul>
        </div>
        
        {/* Action button */}
        <div className="text-center mt-8">
          <button 
            onClick={() => navigate(`/matches/${id}/create-team`)}
            className="px-8 py-3 bg-[#009270] text-white font-bold rounded-lg shadow-md hover:bg-[#007b5e] transition transform hover:-translate-y-1"
          >
            Create Your Team Now
          </button>
        </div>

      </div>
    </div>
  );
}

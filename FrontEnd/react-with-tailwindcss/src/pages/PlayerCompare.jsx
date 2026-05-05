// src/pages/PlayerCompare.jsx
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend
} from 'recharts';

// Debounce hook for search
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

// Search input with autocomplete suggestions
function PlayerSearchInput({ value, onChange, onSelect, placeholder, accentColor }) {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const debouncedQuery = useDebounce(value, 300);
  const wrapperRef = useRef(null);

  // Close suggestions on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch suggestions
  useEffect(() => {
    if (debouncedQuery.length < 2) { setSuggestions([]); return; }
    let cancelled = false;
    const fetchSuggestions = async () => {
      setLoadingSuggestions(true);
      try {
        const res = await fetch(`/api/players/search?q=${encodeURIComponent(debouncedQuery)}`);
        const data = await res.json();
        if (!cancelled && data.success) {
          setSuggestions(data.data?.slice(0, 8) || []);
          setShowSuggestions(true);
        }
      } catch { /* ignore */ }
      if (!cancelled) setLoadingSuggestions(false);
    };
    fetchSuggestions();
    return () => { cancelled = true; };
  }, [debouncedQuery]);

  return (
    <div ref={wrapperRef} className="relative w-full">
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 outline-none transition"
        style={{ '--tw-ring-color': accentColor }}
      />
      {loadingSuggestions && (
        <div className="absolute right-3 top-3.5">
          <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
        </div>
      )}
      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((s, i) => (
            <li
              key={s.id || i}
              onClick={() => {
                onSelect(s.name);
                setShowSuggestions(false);
              }}
              className="px-4 py-3 cursor-pointer hover:bg-gray-50 flex items-center gap-3 border-b border-gray-50 last:border-b-0 transition"
            >
              {s.playerImg && (
                <img src={s.playerImg} alt="" className="w-8 h-8 rounded-full object-cover shrink-0" />
              )}
              <div>
                <p className="font-medium text-gray-900 text-sm">{s.name}</p>
                <p className="text-xs text-gray-500">{s.country || ''}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// Detect the dominant role category
function getRoleCategory(role) {
  if (!role) return 'unknown';
  const r = role.toLowerCase();
  if (r.includes('allrounder') || r.includes('all-rounder') || r.includes('all rounder')) return 'allrounder';
  if (r.includes('bowl')) return 'bowler';
  if (r.includes('bat') || r.includes('wk')) return 'batsman';
  return 'unknown';
}

// Decide which charts to show based on both players' roles
function getChartMode(role1, role2) {
  const r1 = getRoleCategory(role1);
  const r2 = getRoleCategory(role2);
  // If either is an allrounder, show both
  if (r1 === 'allrounder' || r2 === 'allrounder') return 'both';
  // If both bowlers, show bowling
  if (r1 === 'bowler' && r2 === 'bowler') return 'bowling';
  // If both batsmen, show batting
  if (r1 === 'batsman' && r2 === 'batsman') return 'batting';
  // Mixed (bowler vs batsman) → show both
  return 'both';
}

export default function PlayerCompare() {
  const [player1Input, setPlayer1Input] = useState('');
  const [player2Input, setPlayer2Input] = useState('');
  const [player1, setPlayer1] = useState(null);
  const [player2, setPlayer2] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [format, setFormat] = useState('T20I');

  const handleCompare = useCallback(async () => {
    if (!player1Input.trim() || !player2Input.trim()) {
      setError('Please enter both player names');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/players/compare?p1=${encodeURIComponent(player1Input.trim())}&p2=${encodeURIComponent(player2Input.trim())}`);
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || 'Failed to compare players');
      setPlayer1(data.data.player1);
      setPlayer2(data.data.player2);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [player1Input, player2Input]);

  // Helper to extract stat
  const getStat = useCallback((player, fn, statKey) => {
    if (!player?.stats) return 0;
    const stat = player.stats.find(s => s.matchType === format && s.fn === fn && s.stat === statKey);
    return stat ? stat.numericValue || 0 : 0;
  }, [format]);

  // Memoized chart mode
  const chartMode = useMemo(() => {
    if (!player1 || !player2) return 'both';
    return getChartMode(player1.role, player2.role);
  }, [player1, player2]);

  // Show batting chart?
  const showBatting = chartMode === 'batting' || chartMode === 'both';
  // Show bowling chart?
  const showBowling = chartMode === 'bowling' || chartMode === 'both';

  const renderComparison = () => {
    if (!player1 || !player2) return null;

    const battingData = [
      { name: 'Average', [player1.name]: getStat(player1, 'batting', 'average'), [player2.name]: getStat(player2, 'batting', 'average') },
      { name: 'Strike Rate', [player1.name]: getStat(player1, 'batting', 'strikeRate'), [player2.name]: getStat(player2, 'batting', 'strikeRate') },
      { name: 'Highest', [player1.name]: getStat(player1, 'batting', 'highScore'), [player2.name]: getStat(player2, 'batting', 'highScore') },
      { name: '50s', [player1.name]: getStat(player1, 'batting', 'fifties'), [player2.name]: getStat(player2, 'batting', 'fifties') },
      { name: '100s', [player1.name]: getStat(player1, 'batting', 'hundreds'), [player2.name]: getStat(player2, 'batting', 'hundreds') },
      { name: 'Sixes', [player1.name]: getStat(player1, 'batting', 'sixes'), [player2.name]: getStat(player2, 'batting', 'sixes') },
    ];

    const bowlingData = [
      { name: 'Wickets', [player1.name]: getStat(player1, 'bowling', 'wickets'), [player2.name]: getStat(player2, 'bowling', 'wickets') },
      { name: 'Economy', [player1.name]: getStat(player1, 'bowling', 'economy'), [player2.name]: getStat(player2, 'bowling', 'economy') },
      { name: 'Average', [player1.name]: getStat(player1, 'bowling', 'average'), [player2.name]: getStat(player2, 'bowling', 'average') },
      { name: 'Strike Rate', [player1.name]: getStat(player1, 'bowling', 'strikeRate'), [player2.name]: getStat(player2, 'bowling', 'strikeRate') },
      { name: '5 Wickets', [player1.name]: getStat(player1, 'bowling', 'fiveWicketHaul'), [player2.name]: getStat(player2, 'bowling', 'fiveWicketHaul') },
    ];

    // Batting radar
    const battingRadar = [
      { subject: 'Average', A: getStat(player1, 'batting', 'average'), B: getStat(player2, 'batting', 'average'), fullMark: 60 },
      { subject: 'Strike Rate', A: getStat(player1, 'batting', 'strikeRate') / 2, B: getStat(player2, 'batting', 'strikeRate') / 2, fullMark: 100 },
      { subject: 'Runs', A: Math.min(getStat(player1, 'batting', 'runs') / 50, 100), B: Math.min(getStat(player2, 'batting', 'runs') / 50, 100), fullMark: 100 },
      { subject: '50s', A: getStat(player1, 'batting', 'fifties'), B: getStat(player2, 'batting', 'fifties'), fullMark: 40 },
      { subject: '100s', A: getStat(player1, 'batting', 'hundreds') * 5, B: getStat(player2, 'batting', 'hundreds') * 5, fullMark: 50 },
    ];

    // Bowling radar
    const bowlingRadar = [
      { subject: 'Wickets', A: getStat(player1, 'bowling', 'wickets'), B: getStat(player2, 'bowling', 'wickets'), fullMark: 200 },
      { subject: 'Economy (Inv)', A: Math.max(0, (12 - getStat(player1, 'bowling', 'economy')) * 10), B: Math.max(0, (12 - getStat(player2, 'bowling', 'economy')) * 10), fullMark: 100 },
      { subject: 'Avg (Inv)', A: Math.max(0, (50 - getStat(player1, 'bowling', 'average'))), B: Math.max(0, (50 - getStat(player2, 'bowling', 'average'))), fullMark: 50 },
      { subject: 'SR (Inv)', A: Math.max(0, (40 - getStat(player1, 'bowling', 'strikeRate'))), B: Math.max(0, (40 - getStat(player2, 'bowling', 'strikeRate'))), fullMark: 40 },
      { subject: '5W Hauls', A: getStat(player1, 'bowling', 'fiveWicketHaul') * 10, B: getStat(player2, 'bowling', 'fiveWicketHaul') * 10, fullMark: 50 },
    ];

    // Stat card for a player
    const StatCard = ({ player, color }) => {
      const role = getRoleCategory(player.role);
      const showBat = role !== 'bowler';
      const showBowl = role !== 'batsman';
      return (
        <div className="grid grid-cols-2 gap-3 mt-4">
          {showBat && (
            <>
              <div className="bg-gray-50 p-3 rounded-lg text-center">
                <p className="text-xs text-gray-500">Batting Avg</p>
                <p className="text-lg font-bold text-gray-900">{getStat(player, 'batting', 'average') || '-'}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg text-center">
                <p className="text-xs text-gray-500">Strike Rate</p>
                <p className="text-lg font-bold text-gray-900">{getStat(player, 'batting', 'strikeRate') || '-'}</p>
              </div>
            </>
          )}
          {showBowl && (
            <>
              <div className="bg-gray-50 p-3 rounded-lg text-center">
                <p className="text-xs text-gray-500">Wickets</p>
                <p className="text-lg font-bold text-gray-900">{getStat(player, 'bowling', 'wickets') || '-'}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg text-center">
                <p className="text-xs text-gray-500">Economy</p>
                <p className="text-lg font-bold text-gray-900">{getStat(player, 'bowling', 'economy') || '-'}</p>
              </div>
            </>
          )}
          {/* Always show runs and matches */}
          <div className="bg-gray-50 p-3 rounded-lg text-center">
            <p className="text-xs text-gray-500">Runs</p>
            <p className="text-lg font-bold text-gray-900">{getStat(player, 'batting', 'runs') || '-'}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg text-center">
            <p className="text-xs text-gray-500">Matches</p>
            <p className="text-lg font-bold text-gray-900">{getStat(player, 'batting', 'matches') || getStat(player, 'bowling', 'matches') || '-'}</p>
          </div>
        </div>
      );
    };

    return (
      <div className="mt-8 space-y-8" style={{ animation: 'fadeIn 0.4s ease-out' }}>
        {/* Format selector */}
        <div className="flex justify-center mb-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-1 inline-flex gap-1">
            {['Test', 'ODI', 'T20I', 'T20', 'IPL'].map(fmt => (
              <button
                key={fmt}
                onClick={() => setFormat(fmt)}
                className={`px-4 py-2 rounded-md font-medium text-sm transition-all ${format === fmt ? 'bg-[#009270] text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                {fmt}
              </button>
            ))}
          </div>
        </div>

        {/* Player Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-md p-6 border-t-4 border-[#009270]">
            <div className="flex items-center gap-4">
              <img src={player1.playerImg || "https://via.placeholder.com/80"} alt={player1.name} className="w-16 h-16 rounded-full object-cover border-2 border-gray-200" />
              <div>
                <h3 className="text-xl font-bold text-gray-900">{player1.name}</h3>
                <p className="text-sm text-gray-500">{player1.role || 'Unknown'} • {player1.country}</p>
              </div>
            </div>
            <StatCard player={player1} color="#009270" />
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 border-t-4 border-[#1e88e5]">
            <div className="flex items-center gap-4 flex-row-reverse">
              <img src={player2.playerImg || "https://via.placeholder.com/80"} alt={player2.name} className="w-16 h-16 rounded-full object-cover border-2 border-gray-200" />
              <div className="text-right">
                <h3 className="text-xl font-bold text-gray-900">{player2.name}</h3>
                <p className="text-sm text-gray-500">{player2.country} • {player2.role || 'Unknown'}</p>
              </div>
            </div>
            <StatCard player={player2} color="#1e88e5" />
          </div>
        </div>

        {/* Charts Row 1: Bar Charts */}
        <div className={`grid grid-cols-1 ${showBatting && showBowling ? 'lg:grid-cols-2' : ''} gap-6`}>
          {showBatting && (
            <div className="bg-white p-6 rounded-2xl shadow-md">
              <h4 className="text-lg font-bold text-gray-800 mb-4 text-center">🏏 Batting Comparison ({format})</h4>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={battingData} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey={player1.name} fill="#009270" radius={[4, 4, 0, 0]} />
                    <Bar dataKey={player2.name} fill="#1e88e5" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
          {showBowling && (
            <div className="bg-white p-6 rounded-2xl shadow-md">
              <h4 className="text-lg font-bold text-gray-800 mb-4 text-center">🎯 Bowling Comparison ({format})</h4>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={bowlingData} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey={player1.name} fill="#009270" radius={[4, 4, 0, 0]} />
                    <Bar dataKey={player2.name} fill="#1e88e5" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>

        {/* Charts Row 2: Radar Charts */}
        <div className={`grid grid-cols-1 ${showBatting && showBowling ? 'lg:grid-cols-2' : ''} gap-6`}>
          {showBatting && (
            <div className="bg-white p-6 rounded-2xl shadow-md">
              <h4 className="text-lg font-bold text-gray-800 mb-4 text-center">🏏 Batting Potential ({format})</h4>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="75%" data={battingRadar}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={false} />
                    <Radar name={player1.name} dataKey="A" stroke="#009270" fill="#009270" fillOpacity={0.45} />
                    <Radar name={player2.name} dataKey="B" stroke="#1e88e5" fill="#1e88e5" fillOpacity={0.45} />
                    <Tooltip />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
          {showBowling && (
            <div className="bg-white p-6 rounded-2xl shadow-md">
              <h4 className="text-lg font-bold text-gray-800 mb-4 text-center">🎯 Bowling Potential ({format})</h4>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="75%" data={bowlingRadar}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={false} />
                    <Radar name={player1.name} dataKey="A" stroke="#009270" fill="#009270" fillOpacity={0.45} />
                    <Radar name={player2.name} dataKey="B" stroke="#1e88e5" fill="#1e88e5" fillOpacity={0.45} />
                    <Tooltip />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#f0f2f5] py-12 px-4 pt-24">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-1">Player Comparison</h1>
          <p className="text-gray-500">Compare stats and fantasy potential of any two players.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 lg:p-8 border border-gray-100">
          <div className="flex flex-col md:flex-row items-end gap-4 justify-center">
            <div className="w-full md:w-1/3">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Player 1</label>
              <PlayerSearchInput
                value={player1Input}
                onChange={setPlayer1Input}
                onSelect={setPlayer1Input}
                placeholder="e.g. Virat Kohli"
                accentColor="#009270"
              />
            </div>

            <div className="hidden md:flex shrink-0 items-center justify-center w-12 h-12 rounded-full bg-gray-100 text-gray-500 font-bold">
              VS
            </div>

            <div className="w-full md:w-1/3">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Player 2</label>
              <PlayerSearchInput
                value={player2Input}
                onChange={setPlayer2Input}
                onSelect={setPlayer2Input}
                placeholder="e.g. Jasprit Bumrah"
                accentColor="#1e88e5"
              />
            </div>

            <div className="w-full md:w-auto">
              <button
                onClick={handleCompare}
                disabled={loading}
                className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-gray-900 to-gray-800 text-white font-bold rounded-lg hover:from-gray-800 hover:to-gray-700 transition-all shadow-md disabled:opacity-70 flex justify-center items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Comparing...
                  </>
                ) : 'Compare Players'}
              </button>
            </div>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg text-center text-sm font-medium">
              {error}
            </div>
          )}
        </div>

        {renderComparison()}
      </div>
    </div>
  );
}

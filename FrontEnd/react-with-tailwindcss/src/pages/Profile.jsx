import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../utils/axios';
import { Card, CardContent } from './components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './components/ui/avatar';
import { Badge } from './components/ui/badge';

const UserProfile = () => {
  const { username } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`/api/users/${username}`);
        setUser(res.data.user);
      } catch (error) {
        console.error("Failed to load user", error);
      }
    };

    fetchProfile();
  }, [username]);

  if (!user) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-5 bg-white shadow rounded-xl">
      <div className="flex items-center space-x-6">
        <Avatar className="h-20 w-20">
          <AvatarImage src={user.profileImage} alt={user.username} />
          <AvatarFallback>{user.username[0]?.toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-semibold capitalize">{user.fullname}</h1>
          <p className="text-sm text-gray-500">@{user.username}</p>
          <p className="text-sm text-gray-600">{user.email}</p>
          <Badge className="mt-2 bg-yellow-500 text-white">
            Coins: {user.fantasyCoins}
          </Badge>
        </div>
      </div>

      {/* Favorites Section */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-3">Favorite Players</h2>
        {user.favorites.length === 0 ? (
          <p className="text-gray-500">No favorites yet.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {user.favorites.map(player => (
              <Card key={player._id}>
                <CardContent className="p-4">
                  <img src={player.playerImg} alt={player.name} className="h-24 w-full object-cover rounded" />
                  <div className="mt-2 text-center">
                    <p className="font-semibold">{player.name}</p>
                    <p className="text-sm text-gray-500">{player.country}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Team History */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-3">Team History</h2>
        {user.teamHistory.length === 0 ? (
          <p className="text-gray-500">No teams created yet.</p>
        ) : (
          <ul className="list-disc list-inside text-gray-700">
            {user.teamHistory.map(teamId => (
              <li key={teamId}>Team ID: {teamId}</li>
            ))}
          </ul>
        )}
      </div>

      {/* Match History */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-3">Match History</h2>
        {user.matchHistory.length === 0 ? (
          <p className="text-gray-500">No match history available.</p>
        ) : (
          <ul className="list-disc list-inside text-gray-700">
            {user.matchHistory.map(matchId => (
              <li key={matchId}>Match ID: {matchId}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default UserProfile;

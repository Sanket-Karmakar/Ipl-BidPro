import axios from "axios";
import dotenv from 'dotenv';

dotenv.config();

const http = axios.create({
  baseURL: process.env.CRICAPI_BASE_URL,  // matches .env
  timeout: 15000,
});

const withKey = (params = {}) => ({
  apikey: process.env.CRIC_API_KEY,  // matches .env
  ...params,
});

function assertConfig() {
  if (!process.env.CRICAPI_BASE_URL) {
    throw new Error('[cricket.service] CRICAPI_BASE_URL missing in .env');
  }
  if (!process.env.CRIC_API_KEY) {
    throw new Error('[cricket.service] CRIC_API_KEY missing in .env');
  }
}

export async function searchPlayers(name) {
  assertConfig();
  const { data } = await http.get('/players', {
    params: withKey({ search: name })
  });
  return data;
}

export async function getPlayerInfo(playerId) {
  assertConfig();
  const { data } = await http.get('/players_info', {
    params: withKey({ id: playerId })
  });
  return data;
}
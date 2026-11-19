'use strict';


// ---------- 1. Константы ----------
const GEO_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_URL = 'https://api.open-meteo.com/v1/forecast';
const HISTORY_KEY = 'weatherHistory';
const HISTORY_LIMIT = 5;

const WEATHER_CODES = {
  0:  { text: 'Ясно',                    icon: '☀️',  nightIcon: '🌙', theme: 'clear' },
  1:  { text: 'Преимущественно ясно',    icon: '🌤️', nightIcon: '🌙', theme: 'clear' },
  2:  { text: 'Переменная облачность',   icon: '⛅',  nightIcon: '☁️', theme: 'cloudy' },
  3:  { text: 'Пасмурно',                icon: '☁️',  theme: 'cloudy' },
  45: { text: 'Туман',                   icon: '🌫️', theme: 'fog' },
  48: { text: 'Изморозь',                icon: '🌫️', theme: 'fog' },
  51: { text: 'Лёгкая морось',           icon: '🌦️', theme: 'rain' },
  53: { text: 'Морось',                  icon: '🌦️', theme: 'rain' },
  55: { text: 'Сильная морось',          icon: '🌧️', theme: 'rain' },
  56: { text: 'Ледяная морось',          icon: '🌧️', theme: 'rain' },
  57: { text: 'Сильная ледяная морось',  icon: '🌧️', theme: 'rain' },
  61: { text: 'Небольшой дождь',         icon: '🌦️', theme: 'rain' },
  63: { text: 'Дождь',                   icon: '🌧️', theme: 'rain' },
  65: { text: 'Сильный дождь',           icon: '🌧️', theme: 'rain' },
  66: { text: 'Ледяной дождь',           icon: '🌧️', theme: 'rain' },
  67: { text: 'Сильный ледяной дождь',   icon: '🌧️', theme: 'rain' },
  71: { text: 'Небольшой снег',          icon: '🌨️', theme: 'snow' },
  73: { text: 'Снег',                    icon: '🌨️', theme: 'snow' },
  75: { text: 'Сильный снег',            icon: '❄️',  theme: 'snow' },
  77: { text: 'Снежная крупа',           icon: '❄️',  theme: 'snow' },
  80: { text: 'Небольшой ливень',        icon: '🌦️', theme: 'rain' },
  81: { text: 'Ливень',                  icon: '🌧️', theme: 'rain' },
  82: { text: 'Сильный ливень',          icon: '🌧️', theme: 'rain' },
  85: { text: 'Снегопад',                icon: '🌨️', theme: 'snow' },
  86: { text: 'Сильный снегопад',        icon: '❄️',  theme: 'snow' },
  95: { text: 'Гроза',                   icon: '⛈️',  theme: 'storm' },
  96: { text: 'Гроза с градом',          icon: '⛈️',  theme: 'storm' },
  99: { text: 'Сильная гроза с градом',  icon: '⛈️',  theme: 'storm' },
};

// ---------- 2. Элементы страницы ----------
const $ = (id) => document.getElementById(id);

const els = {
  form: $('searchForm'),
  input: $('cityInput'),
  suggestions: $('suggestions'),
  geoBtn: $('geoBtn'),
  history: $('history'),
  status: $('status'),
  weather: $('weather'),
  cityName: $('cityName'),
  dateText: $('dateText'),
  icon: $('weatherIcon'),
  temp: $('temp'),
  description: $('description'),
  feelsLike: $('feelsLike'),
  humidity: $('humidity'),
  wind: $('wind'),
  pressure: $('pressure'),
  forecast: $('forecast'),
  dayTemplate: $('dayTemplate'),
};

// ---------- 3. Работа с API ----------
async function fetchJSON(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Ошибка сервера: ${response.status}`);
  return response.json();
}

async function searchCities(name, count = 5) {
  const params = new URLSearchParams({ name, count, language: 'ru', format: 'json' });
  const data = await fetchJSON(`${GEO_URL}?${params}`);
  return data.results ?? [];
}

async function getWeather(latitude, longitude) {
  const params = new URLSearchParams({
    latitude,
    longitude,
    current: 'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m,surface_pressure',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min',
    timezone: 'auto',
    forecast_days: 5,
  });
  return fetchJSON(`${WEATHER_URL}?${params}`);
}
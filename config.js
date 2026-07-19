// config.js

// 🗄️ Configurações do Supabase
const SUPABASE_URL = "https://ifjfixlgacvnieuxfyjs.supabase.co"; 
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlmamZpeGxnYWN2bmlldXhmeWpzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE4OTAyMjksImV4cCI6MjA4NzQ2NjIyOX0.7hGgUF--P5uITdbFmvhLyrSn_zX4rfKshIs_rGs9v3w"; 

// 🤖 Configuração da Inteligência Artificial (Item 2)
// Hítallo, insira abaixo a sua API Key gerada no Google AI Studio
const GEMINI_API_KEY = "AIzaSyDVwEnpkvG-M2dmoFr5sC6i3jQesRiRhQo"; 

// Inicializa o cliente global do Supabase
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// config.js
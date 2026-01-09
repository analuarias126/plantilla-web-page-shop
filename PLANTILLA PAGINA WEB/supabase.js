// js/supabase.js
// ⚠️ Este archivo funciona SOLO con Supabase v1 (UMD)

const SUPABASE_URL = "https://oriennkzsriahlbqsywf.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9yaWVubmt6c3JpYWhsYnFzeXdmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ4NTQxNjYsImV4cCI6MjA4MDQzMDE2Nn0.pVczg0dAD4TGTWvvzRDY4pFGjtjbteQX7G4VZBq2B9E";

// Crear cliente Supabase (v1)
window.supabase = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

/* =========================
   Helpers globales
   ========================= */

// Obtener usuario actual
window.getUser = async function () {
  const user = supabase.auth.user(); // v1
  return user; // null si no hay sesión
};

// Obtener perfil desde tabla users
window.getProfileByAuthId = async function (auth_id) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('auth_id', auth_id)
    .single();

  if (error) {
    console.error('Error obteniendo perfil:', error);
    return null;
  }

  return data;
};


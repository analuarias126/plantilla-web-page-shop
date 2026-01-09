// auth.js — COMPATIBLE CON SUPABASE v2
// Requiere supabase.js cargado antes

/* ================================
   UTIL: asegurar que exista perfil
================================ */
async function ensureProfile(user) {
  if (!user) return null;

  const { data: existing, error } = await supabase
    .from('users')
    .select('*')
    .eq('auth_id', user.id)
    .maybeSingle();

  if (existing) return existing;

  const { data: created, error: insertError } = await supabase
    .from('users')
    .insert([{
      auth_id: user.id,
      nombre: user.email,
      email: user.email
    }])
    .select()
    .single();

  if (insertError) {
    console.error('Error creando perfil:', insertError);
    return null;
  }

  return created;
}

/* ================================
   HEADER
================================ */
async function updateHeader() {
  const userGreeting = document.getElementById('user-greeting');
  const perfilLink = document.getElementById('perfil-link');
  const loginLink = document.getElementById('login-link');
  const logoutBtn = document.getElementById('logout-btn');

  if (!userGreeting || !perfilLink || !loginLink || !logoutBtn) return;

  const { data: { session } } = await supabase.auth.getSession();
  const user = session?.user || null;

  if (user) {
    const profile = await ensureProfile(user);
    const displayName = profile?.nombre || user.email;

    userGreeting.textContent = `Hola, ${displayName}`;
    userGreeting.style.display = '';
    perfilLink.style.display = '';
    loginLink.style.display = 'none';
    logoutBtn.style.display = '';
  } else {
    userGreeting.style.display = 'none';
    perfilLink.style.display = 'none';
    loginLink.style.display = '';
    logoutBtn.style.display = 'none';
  }
}

/* ================================
   LOGOUT
================================ */
async function signOutAndRedirect() {
  await supabase.auth.signOut();
  window.location.href = 'index.html';
}

/* ================================
   INIT
================================ */
document.addEventListener('DOMContentLoaded', async () => {
  await updateHeader();

  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) logoutBtn.addEventListener('click', signOutAndRedirect);

  supabase.auth.onAuthStateChange(async (_event, session) => {
    await updateHeader();
  });
});

/* ================================
   PROTECCIÓN DE PÁGINAS
================================ */
window.requireAuth = async function (redirectTo = 'login.html') {
  const { data: { session } } = await supabase.auth.getSession();
  const user = session?.user || null;

  if (!user) {
    window.location.href = redirectTo;
    return null;
  }

  await ensureProfile(user);
  return user;
};


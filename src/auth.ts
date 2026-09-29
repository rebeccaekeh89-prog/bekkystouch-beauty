type AuthUser = { email: string; user_metadata?: { full_name?: string } };
const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const storageKey = 'bekkys_touch_session';

async function request(path: string, body: object, method: string = 'POST', headers: Record<string, string> = {}) {
  if (!url || !key) {
    throw new Error('Supabase authentication is not configured yet. Please check VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.');
  }
  const response = await fetch(`${url}/auth/v1/${path}`, {
    method,
    headers: { apikey: key, 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(body)
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.msg || data.error_description || data.message || 'Account request failed.');
  }
  return data;
}

export interface SignUpResult {
  email: string;
  name: string;
  requiresEmailConfirmation: boolean;
}

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(storageKey);
  if (!raw) return null;
  try {
    const session = JSON.parse(raw);
    return session.access_token || null;
  } catch {
    return null;
  }
}

export async function signIn(email: string, password: string) {
  const data = await request('token?grant_type=password', { email, password });
  localStorage.setItem(storageKey, JSON.stringify({ access_token: data.access_token, refresh_token: data.refresh_token }));
  return { email: data.user.email as string, name: data.user.user_metadata?.full_name || data.user.email };
}

export async function signUp(name: string, email: string, password: string): Promise<SignUpResult> {
  const data = await request('signup', { email, password, data: { full_name: name } });
  if (data.session?.access_token) {
    localStorage.setItem(storageKey, JSON.stringify({ access_token: data.session.access_token, refresh_token: data.session.refresh_token }));
    return { email: data.user.email as string, name, requiresEmailConfirmation: false };
  }
  return { email: data.user?.email || email, name, requiresEmailConfirmation: true };
}

export async function updateUserProfile(name: string) {
  if (!url || !key) {
    throw new Error('Supabase authentication is not configured yet.');
  }
  const raw = localStorage.getItem(storageKey);
  if (!raw) {
    throw new Error('No active authentication session.');
  }
  const session = JSON.parse(raw);
  const data = await request('user', { data: { full_name: name } }, 'PUT', {
    Authorization: `Bearer ${session.access_token}`
  });
  return { email: data.email as string, name: data.user_metadata?.full_name || name };
}

export async function resetPassword(email: string) {
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const redirectUrl = origin ? `${origin}/#reset-password` : '';
  const path = redirectUrl ? `recover?redirect_to=${encodeURIComponent(redirectUrl)}` : 'recover';
  await request(path, { email });
}

export async function updatePassword(password: string) {
  if (!url || !key) {
    throw new Error('Supabase authentication is not configured yet.');
  }
  const raw = localStorage.getItem(storageKey);
  if (!raw) {
    throw new Error('No active authentication session. Please request a new password reset link.');
  }
  const session = JSON.parse(raw);
  const data = await request('user', { password }, 'PUT', {
    Authorization: `Bearer ${session.access_token}`
  });
  return { email: data.email as string, name: data.user_metadata?.full_name || data.email };
}

export function signOut() {
  localStorage.removeItem(storageKey);
}

export async function restoreUser() {
  if (!url || !key) return null;

  // Check if user followed a recovery or confirmation hash link from email
  if (typeof window !== 'undefined' && window.location.hash) {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const hashAccessToken = params.get('access_token');
    const hashRefreshToken = params.get('refresh_token');

    if (hashAccessToken) {
      const session = {
        access_token: hashAccessToken,
        refresh_token: hashRefreshToken || ''
      };
      localStorage.setItem(storageKey, JSON.stringify(session));
      // Keep hash clean if it was an OAuth or recovery token
      if (params.get('type') !== 'recovery') {
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
      }
    }
  }

  const raw = localStorage.getItem(storageKey);
  if (!raw) return null;
  try {
    let session = JSON.parse(raw);
    let response = await fetch(`${url}/auth/v1/user`, {
      headers: { apikey: key, Authorization: `Bearer ${session.access_token}` }
    });
    if (response.status === 401 && session.refresh_token) {
      const refreshed = await request('token?grant_type=refresh_token', { refresh_token: session.refresh_token });
      session = { access_token: refreshed.access_token, refresh_token: refreshed.refresh_token };
      localStorage.setItem(storageKey, JSON.stringify(session));
      response = await fetch(`${url}/auth/v1/user`, {
        headers: { apikey: key, Authorization: `Bearer ${session.access_token}` }
      });
    }
    if (!response.ok) throw new Error('Session expired');
    const user: AuthUser = await response.json();
    return { email: user.email, name: user.user_metadata?.full_name || user.email };
  } catch {
    signOut();
    return null;
  }
}

import { app } from '../firebase';

export async function createAuthUser(email: string, password: string): Promise<string> {
  const apiKey = app.options.apiKey;
  if (!apiKey) throw new Error("Firebase API Key not found");

  const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email,
      password,
      returnSecureToken: false
    })
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error?.message || 'Failed to create user');
  }

  return data.localId; // This is the Firebase Auth UID
}

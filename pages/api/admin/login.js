import { serialize } from 'cookie';

const ADMIN_USERNAME = 'sarang';
const ADMIN_PASSWORD = 'panjabzindabad';
const SESSION_SECRET = 'pt_admin_auth_2024';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { username, password } = req.body;

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    // Set a signed session cookie valid for 8 hours
    const cookie = serialize('pt_admin_session', SESSION_SECRET, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 8,
      path: '/',
    });

    res.setHeader('Set-Cookie', cookie);
    return res.status(200).json({ success: true });
  }

  return res.status(401).json({ success: false, message: 'Invalid credentials' });
}

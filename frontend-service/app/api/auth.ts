export const backendUrl = process.env.BACKEND_URL || "http://localhost:3001";

type AuthResponse = {
  accessToken: string;
  refreshToken: string;
};

export async function login(
  email: string,
  password: string
): Promise<[AuthResponse | any, boolean]> {
  const res = await fetch(`${backendUrl}/api/user/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const json = res.json();
  return [json, res.ok];
}

export async function register(
  email: string,
  password: string,
  username: string,
  role: "user" | "admin"
): Promise<[AuthResponse | any, boolean]> {
  const res = await fetch(`${backendUrl}/api/user/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, username, role }),
  });
  const json = res.json();
  return [json, res.ok];
}

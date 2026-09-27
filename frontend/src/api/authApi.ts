export interface LoginRequest {
  username: string;
  password: string;
}

export async function login(request: LoginRequest): Promise<string> {
  const response = await fetch("http://localhost:8080/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error("Error al iniciar sesión");
  }

  return response.text();
}

export interface User extends Login {
  username: string;
  role: string;
}

export interface Login {
  email: string;
  password: string;
}
  
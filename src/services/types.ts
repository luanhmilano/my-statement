export interface UserAuthData {
    userid: string,
    password: string
}

export interface UserData {
  userid: string;
  password: string;
  fullname: string;
  birthdate: string;
}

export interface AuthResponse {
	access_token: string;
	token_type: string;
}

export interface RegisterResponse {
	msg: string;
}
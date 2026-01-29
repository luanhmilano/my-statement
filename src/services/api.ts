import axios from "axios"
import type { UserData } from "../pages/register/interfaces/user-data.interface";

export interface UserAuthData {
    userid: string,
    password: string
}

const USERS_URL: string = import.meta.env.VITE_USERS_URL;

export const createUser = async (userData: UserData): Promise<void> => {
    try {
        const response = await axios.post(USERS_URL, JSON.stringify(userData), {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        console.log("Create user response:", response.data);
    } catch (error) {
        console.error("Create user error:", error);
        throw error;
    }
}

const AUTH_URL: string = import.meta.env.VITE_AUTH_URL;

export const authUser = async (authData: UserAuthData): Promise<string> => {
    try {
        const response = await axios.post(AUTH_URL, JSON.stringify(authData), {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        console.log("Auth response:", response.data);

        return response.data.access_token;
    } catch (error) {
        console.error("Auth user error:", error);
        throw error;
    }
}
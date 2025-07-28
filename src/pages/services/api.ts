import axios from "axios"
import type { UserData } from "../CreateAccount/interfaces/user-data.interface";

const USERS_URL: string = import.meta.env.VITE_USERS_URL;

export const createUser = async (userData: UserData): Promise<void> => {
    try {
        const response = await axios.post(USERS_URL, JSON.stringify(userData), {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        console.log("Create user response:", response.data);
        if (response.status === 422) {
            // Tratar Validation Error
        }
        return response.data;
    } catch (error) {
        console.error("Create user error:", error);
        
    }
}
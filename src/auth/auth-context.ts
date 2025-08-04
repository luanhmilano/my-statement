import { createContext } from "react";
import type { AuthContextType } from "./interfaces/auth-context-type.interface";

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
import { createContext } from "react";
import type { AuthContextContract } from "./interfaces/auth-context-type.interface";

export const AuthContext = createContext<AuthContextContract | undefined>(undefined);
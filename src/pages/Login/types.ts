import type { LoginData } from "./utils/login-schema";

export interface LoginFormProps {
    onSubmit: (data: LoginData) => Promise<void>;
    isLoading: boolean;
    register: ReturnType<typeof import("react-hook-form").useForm<LoginData>>['register'];
    handleSubmit: ReturnType<typeof import("react-hook-form").useForm<LoginData>>['handleSubmit'];
    errors: ReturnType<typeof import("react-hook-form").useForm<LoginData>>['formState']['errors'];
    navigate: (path: string) => void;
}


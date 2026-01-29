import type { LoginData } from "../../schemas/loginSchema";

export interface FormProps {
    onSubmit: (data: LoginData) => Promise<void>;
    isLoading: boolean;
    register: ReturnType<typeof import("react-hook-form").useForm<LoginData>>['register'];
    handleSubmit: ReturnType<typeof import("react-hook-form").useForm<LoginData>>['handleSubmit'];
    errors: ReturnType<typeof import("react-hook-form").useForm<LoginData>>['formState']['errors'];
    navigate: (path: string) => void;
}


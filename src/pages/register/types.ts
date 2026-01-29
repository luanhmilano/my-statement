import type { RegisterData } from "./utils/register-schema";

export interface RegisterFormProps {
    onSubmit: (data: RegisterData) => Promise<void>;
    isLoading: boolean;
    register: ReturnType<typeof import("react-hook-form").useForm<RegisterData>>['register'];
    handleSubmit: ReturnType<typeof import("react-hook-form").useForm<RegisterData>>['handleSubmit'];
    errors: ReturnType<typeof import("react-hook-form").useForm<RegisterData>>['formState']['errors'];
}


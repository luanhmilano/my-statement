import type { RegisterData } from "./utils/register-schema";
import type { UseFormRegister, FieldErrors, UseFormHandleSubmit } from "react-hook-form";

export interface RegisterFormProps {
    onSubmit: (data: RegisterData) => Promise<void>;
    isLoading: boolean;
    register: UseFormRegister<RegisterData>;
    handleSubmit: UseFormHandleSubmit<RegisterData>;
    errors: FieldErrors<RegisterData>;
}


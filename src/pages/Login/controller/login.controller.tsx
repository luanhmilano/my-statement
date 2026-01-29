import { useState } from "react";
import LoginView from "../view/login.view";
import { useAuth } from "../../../auth/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { loginSchema, type LoginData } from "../../../schemas/loginSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { toast } from "react-toastify";
import { authUser } from "../../../services/api";
import { RoutesUrls } from "../../../utils/enums/routes-url";

export default function LoginController() {
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginData) => {
    const payload = {
      userid: data.email,
      password: data.password,
    };

    try {
      setIsLoading(true);
      const token = await authUser(payload);
      login(token);
      toast.success("Login successfully!");
      navigate(RoutesUrls.DASHBOARD);
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 422) {
        const detail = error.response.data.detail;
        console.warn("Validation error from API:", detail);
        toast.error("Validation error. Check the data.");
      } else {
        console.error("Unexpected error:", error);
        toast.error("Invalid credentials.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LoginView
      onSubmit={onSubmit}
      isLoading={isLoading}
      errors={errors}
      register={register}
      handleSubmit={handleSubmit}
      navigate={navigate}
    />
  )
}

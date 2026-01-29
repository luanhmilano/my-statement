import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createUser } from "../../../services/api";
import { type RegisterData, registerSchema } from "../utils/register-schema";
import RegisterView from "../view/register.view";
import { RoutesUrls } from "../../../utils/enums/routes-url";

export default function RegisterController() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterData) => {
    const payload = {
      userid: data.email,
      password: data.password,
      fullname: `${data.firstName} ${data.lastName}`,
      birthdate: data.birthdate,
    };

    try {
      setIsLoading(true);
      await createUser(payload);
      toast.success("User Created!");
      navigate(RoutesUrls.DASHBOARD);
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 422) {
        const detail = error.response.data.detail;
        console.warn("Validation error from API:", detail);
        toast.error("Validation error. Please check your data.");
      } else {
        console.error("Unexpected error:", error);
        toast.error("Oops! Something went wrong.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return <RegisterView
    register={register}
    handleSubmit={handleSubmit}
    onSubmit={onSubmit}
    isLoading={isLoading}
    errors={errors}
  />;
}

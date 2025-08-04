import axios from 'axios';
import styles from '../styles/login-form.module.css';
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod';
import { authUser } from '../../services/api';
import { ToastContainer, toast } from 'react-toastify';
import { useState } from 'react';
import { Spinner } from '../../../components/Spinner';
import { useNavigate } from 'react-router-dom';
import { loginSchema, type LoginData } from '../../../schemas/loginSchema';
import { useAuth } from '../../../auth/hooks/useAuth';

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginData) => {
    const payload = {
      userid: data.email,
      password: data.password
    };

    try {
      setIsLoading(true);
      const token = await authUser(payload);
      login(token);
      toast.success('Login realizado com sucesso!');
      navigate('/dashboard');
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 422) {
        const detail = error.response.data.detail;
        console.warn("Validation error from API:", detail);
        toast.error('Erro de validação. Cheque os dados.');
      } else {
        console.error("Unexpected error:", error);
        toast.error('Credenciais inválidas.');
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
      <h1 className={styles.title}>Log in</h1>
      <p className={styles.subtitle}>
        Welcome to My Statement, please fill in the fields below to log into your account.
      </p>

      <div className={styles.field}>
        <label className={styles.label}>E-mail</label>
        <span className={styles.inputContainer}>
          <input
              type="email"
              className={styles.input}
              placeholder="E-mail"
              {...register("email")}
           />
          {errors.email && <span className={styles.error}>{errors.email.message}</span>}
        </span>
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Password</label>
        <span className={styles.inputContainer}>
          <input
            type="password"
            className={styles.input}
            placeholder="Enter your password"
            {...register("password")}
          />
          {errors.password && <span className={styles.error}>{errors.password.message}</span>}
        </span>
      </div>

      <button type="submit" className={styles.button} disabled={isLoading}>
        {isLoading ? <Spinner /> : "Log in"}
      </button>
      <p><strong>or</strong></p>
      <button type="button" className={styles.buttonSecondary} onClick={() => navigate('/create-account')}>
        Create account
      </button>
      <ToastContainer />
    </form>
  );
}

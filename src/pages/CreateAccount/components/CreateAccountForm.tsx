import { useForm } from 'react-hook-form';
import styles from '../styles/create-account-form.module.css';
import { createAccountSchema, type CreateAccountData } from '../../../schemas/createAccountSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { createUser } from '../../services/api';
import { ToastContainer, toast } from 'react-toastify';
import { useState } from 'react';
import { Spinner } from '../../../components/Spinner';

export default function CreateAccountForm() {
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<CreateAccountData>({
    resolver: zodResolver(createAccountSchema),
  });

  const onSubmit = async (data: CreateAccountData) => {
    const payload = {
      userid: data.email,
      password: data.password,
      fullname: `${data.firstName} ${data.lastName}`,
      birthdate: data.birthdate
    };

    try {
      setIsLoading(true);
      await createUser(payload);
      toast.success('Usuário Criado!');
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 422) {
        const detail = error.response.data.detail;
        console.warn("Validation error from API:", detail);
        toast.error('Erro de validação. Cheque os dados.');
      } else {
        console.error("Unexpected error:", error);
        toast.error('Opa! Algo errado aconteceu.');
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
      <h1 className={styles.title}>Create account</h1>
      <p className={styles.subtitle}>
        Please fill in the fields below to create an account.
      </p>

      <div className={styles.row}>
        <div className={styles.fieldColumn}>
          <label className={styles.label}>Last Name</label>
          <span className={styles.inputContainer}>
            <input
              type="text"
              className={styles.input}
              placeholder="Enter your last name"
              {...register("lastName")}
            />
            {errors.lastName && <span className={styles.error}>{errors.lastName.message}</span>}
          </span>
        </div>

        <div className={styles.fieldColumn}>
          <label className={styles.label}>First Name</label>
          <span className={styles.inputContainer}>
            <input
              type="text"
              className={styles.input}
              placeholder="Enter your first name"
              {...register("firstName")}
            />
            {errors.firstName && <span className={styles.error}>{errors.firstName.message}</span>}
          </span>
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.fieldColumn}>
          <label className={styles.label}>E-mail</label>
          <span className={styles.inputContainer}>
            <input
              type="email"
              className={styles.input}
              placeholder="Enter your e-mail"
              {...register("email")}
            />
            {errors.email && <span className={styles.error}>{errors.email.message}</span>}
          </span>
        </div>

        <div className={styles.fieldColumn}>
          <label className={styles.label}>Birth Date</label>
          <span className={styles.inputContainer}>
            <input
              type="date"
              className={styles.input}
              {...register("birthdate")}
            />
            {errors.birthdate && <span className={styles.error}>{errors.birthdate.message}</span>}
          </span>
        </div>
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

      <div className={styles.field}>
        <label className={styles.label}>Confirm Password</label>
        <span className={styles.inputContainer}>
          <input
            type="password"
            className={styles.input}
            placeholder="Confirm your password"
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && <span className={styles.error}>{errors.confirmPassword.message}</span>}
        </span>
      </div>

      <button type="submit" className={styles.button} disabled={isLoading}>
        {isLoading ? <Spinner /> : "Create Account"}
      </button>
      <ToastContainer />
    </form>
  );
}

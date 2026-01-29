import styles from '../styles/login-form.module.css';
import { ToastContainer } from 'react-toastify';
import { Spinner } from '../../../../components/spinner';
import type { LoginFormProps } from '../../types';
import { RoutesUrls } from '../../../../utils/enums/routes-url';

export default function LoginForm({
    onSubmit,
    isLoading,
    register,
    handleSubmit,
    errors,
    navigate,
}: LoginFormProps) {
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
      <button type="button" className={styles.buttonSecondary} onClick={() => navigate(RoutesUrls.REGISTER)}>
        Create account
      </button>
      <ToastContainer />
    </form>
  );
}

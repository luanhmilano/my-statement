import styles from './styles/login.module.css';
import logo from '../../../assets/my_statement-logo.png';
import mainImage from '../../../assets/login-register-image.png';
import LoginForm from '../components/login-form';
import type { FormProps } from '../types';

export default function LoginView({
    onSubmit,
    isLoading,
    register,
    handleSubmit,
    errors,
    navigate,
}: FormProps) {
  return (
    <div className={styles.container}>
      <div className={styles.leftSide}>
        <img src={logo} alt="Logo" className={styles.logo} />
        <img src={mainImage} alt="Main" className={styles.mainImage} />
      </div>

      <div className={styles.rightSide}>
        <div className={styles.formContainer}>
          <LoginForm
            onSubmit={onSubmit}
            isLoading={isLoading}
            register={register}
            handleSubmit={handleSubmit}
            errors={errors}
            navigate={navigate}
          />
        </div>
      </div>
    </div>
  );
}
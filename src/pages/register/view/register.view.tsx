import styles from '../styles/register.module.css';
import logo from '@assets/my_statement-logo.png';
import mainImage from '@assets/login-register-image.png';
import RegisterForm from '../components/register-form';
import type { RegisterFormProps } from '../types';

export default function RegisterView({
  register,
  handleSubmit,
  onSubmit,
  isLoading,
  errors,
}: RegisterFormProps) {
  return (
    <div data-testid="register-view" className={styles.container}>
      <div className={styles.leftSide}>
        <img src={logo} alt="Logo" className={styles.logo} />
        <img src={mainImage} alt="Main" className={styles.mainImage} />
      </div>

      <div className={styles.rightSide}>
        <div className={styles.formContainer}>
          <RegisterForm
            register={register}
            handleSubmit={handleSubmit}
            onSubmit={onSubmit}
            isLoading={isLoading}
            errors={errors}
          />
        </div>
      </div>
    </div>
  );
}

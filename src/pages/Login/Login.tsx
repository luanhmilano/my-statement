import styles from './styles/login.module.css';
import logo from '../../../assets/my_statement-logo.png';
import mainImage from '../../../assets/login-register-image.png';
import LoginForm from './components/LoginForm';

export default function Login() {
  return (
    <div className={styles.container}>
      <div className={styles.leftSide}>
        <img src={logo} alt="Logo" className={styles.logo} />
        <img src={mainImage} alt="Main" className={styles.mainImage} />
      </div>

      <div className={styles.rightSide}>
        <div className={styles.formContainer}>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
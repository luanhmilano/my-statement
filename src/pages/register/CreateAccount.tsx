import styles from './styles/create-account.module.css'
import logo from '../../../assets/my_statement-logo.png';
import mainImage from '../../../assets/login-register-image.png';
import CreateAccountForm from './components/CreateAccountForm';

export default function CreateAccount() {
  return (
    <div className={styles.container}>
      <div className={styles.leftSide}>
        <img src={logo} alt="Logo" className={styles.logo} />
        <img src={mainImage} alt="Main" className={styles.mainImage} />
      </div>

      <div className={styles.rightSide}>
        <div className={styles.formContainer}>
          <CreateAccountForm />
        </div>
      </div>
    </div>
  );
}
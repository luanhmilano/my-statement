import { useState } from 'react';
import styles from './styles/create-account.module.css'
import type { UserData } from './interfaces/user-data.interface';
import logo from '../../../assets/my_statement-logo.png';
import mainImage from '../../../assets/login-register-image.png';
import CreateAccountForm from './components/CreateAccountForm';

export default function CreateAccount() {
  const [formData, setFormData] = useState<UserData>({
    userid: '',
    password: '',
    fullname: '',
    birthdate: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setFieldErrors({});

    try {
      const response = await fetch('https://dev-challenge.micheltlutz.me/users/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setMessage('Usuário criado com sucesso!');
        setFormData({ userid: '', password: '', fullname: '', birthdate: '' });
      } else {
        const errorData = await response.json();
        if (errorData.detail) {
          const errors: Record<string, string> = {};
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          errorData.detail.forEach((error: any) => {
            const field = error.loc[error.loc.length - 1];
            errors[field] = error.msg;
          });
          setFieldErrors(errors);
        } else {
          setMessage('Erro ao criar usuário. Tente novamente.');
        }
      }
    } catch (error) {
      console.error('Erro de conexão:', error);
      setMessage('Erro de conexão. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

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
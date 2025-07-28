import { useState } from 'react';
import styles from './styles/create-account.module.css'
import type { UserData } from './interfaces/user-data.interface';
import logo from '../../../assets/my_statement-logo.png';
import mainImage from '../../../assets/login-register-image.png';

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
        <img src={logo} alt="logo" />
        <img src={mainImage} alt="register" />
      </div>
      <div className={styles.rightSide}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <h1 className={styles.title}>Criar Conta</h1>

          <div className={styles.field}>
            <label htmlFor="userid">Email</label>
            <input
              type="email"
              id="userid"
              name="userid"
              value={formData.userid}
              onChange={handleChange}
              className={fieldErrors.userid ? styles.inputError : ''}
              required
            />
            {fieldErrors.userid && <span className={styles.error}>{fieldErrors.userid}</span>}
          </div>

          <div className={styles.field}>
            <label htmlFor="password">Senha</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={fieldErrors.password ? styles.inputError : ''}
              required
            />
            {fieldErrors.password && <span className={styles.error}>{fieldErrors.password}</span>}
          </div>

          <div className={styles.field}>
            <label htmlFor="fullname">Nome Completo</label>
            <input
              type="text"
              id="fullname"
              name="fullname"
              value={formData.fullname}
              onChange={handleChange}
              className={fieldErrors.fullname ? styles.inputError : ''}
              required
            />
            {fieldErrors.fullname && <span className={styles.error}>{fieldErrors.fullname}</span>}
          </div>

          <div className={styles.field}>
            <label htmlFor="birthdate">Data de Nascimento</label>
            <input
              type="date"
              id="birthdate"
              name="birthdate"
              value={formData.birthdate}
              onChange={handleChange}
              className={fieldErrors.birthdate ? styles.inputError : ''}
              required
            />
            {fieldErrors.birthdate && <span className={styles.error}>{fieldErrors.birthdate}</span>}
          </div>

          <button type="submit" disabled={loading} className={styles.button}>
            {loading ? 'Criando...' : 'Criar Conta'}
          </button>

          {message && <p className={styles.message}>{message}</p>}
        </form>
      </div>
    </div>
  );
}
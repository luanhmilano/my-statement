import styles from '../styles/create-account-form.module.css';

export default function CreateAccountForm() {
  return (
    <form className={styles.form}>
      <h1 className={styles.title}>Create account</h1>
      <p className={styles.subtitle}>
        Please fill in the fields below to create an account.
      </p>

      <div className={styles.row}>
        <div className={styles.fieldColumn}>
          <label className={styles.label}>Last Name</label>
          <input
            type="text"
            className={styles.input}
            placeholder="Enter your last name"
          />
        </div>
        <div className={styles.fieldColumn}>
          <label className={styles.label}>First Name</label>
          <input
            type="text"
            className={styles.input}
            placeholder="Enter your first name"
          />
        </div>
      </div>

      <div className={styles.field}>
        <label className={styles.label}>E-mail</label>
        <input
          type="email"
          className={styles.input}
          placeholder="Enter your e-mail"
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Password</label>
        <input
          type="password"
          className={styles.input}
          placeholder="Enter your password"
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Confirm Password</label>
        <input
          type="password"
          className={styles.input}
          placeholder="Confirm your password"
        />
      </div>

      <button type="submit" className={styles.button}>
        Create Account
      </button>
    </form>
  );
}

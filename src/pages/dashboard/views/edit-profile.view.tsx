import styles from '../styles/edite-profile.module.css';
import Avatar from '@assets/avatar-full.jpg';

const EditIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
  </svg>
);

export default function EditProfileView() {
  return (
    <div className={styles.scrollablePage}>
      <div className={styles.editProfileContainer}>
        <div className={styles.avatarWrapper}>
          <div className={styles.imageContainer}>
            <img
              src={Avatar}
              alt="User Avatar"
              className={styles.avatarImage}
            />
            <button
              className={styles.editButton}
              aria-label="Edit profile picture"
            >
              <EditIcon />
            </button>
          </div>
        </div>
        <form className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              placeholder="Last name"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              placeholder="First name"
            />
          </div>
          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label htmlFor="dateOfBirth">Date of birth</label>
            <input
              type="date"
              id="dateOfBirth"
              name="dateOfBirth"
              placeholder="Date of birth"
            />
          </div>
          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label htmlFor="email">E-mail</label>
            <input type="email" id="email" name="email" placeholder="E-mail" />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="address">Address</label>
            <input
              type="text"
              id="address"
              name="address"
              placeholder="Address"
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="country">Countries</label>
            <input
              type="text"
              id="country"
              name="country"
              placeholder="Countries"
            />
          </div>
          <button type="button" className={styles.saveButton}>
            Save
          </button>
        </form>
      </div>
    </div>
  );
}

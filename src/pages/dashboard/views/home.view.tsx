import mainImage from '@assets/dashboard-image.png';
import styles from '../styles/home.module.css';

export default function HomeView() {
  return (
    <div className={styles.container}>
      <img src={mainImage} alt="Dashboard" className={styles.image} />
    </div>
  );
}

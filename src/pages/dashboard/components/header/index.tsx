import styles from '../../styles/header.module.css';
import { LuCircleUser, LuSettings, LuBell, LuSearch } from "react-icons/lu";

export default function Header() {
  return (
    <div className={styles.container}>
      <div className={styles.searchContainer}>
        <div className={styles.searchInputWrapper}>
          <LuSearch className={styles.searchIcon} />
          <input 
            type="text" 
            placeholder="Search something" 
            className={styles.searchInput}
          />
        </div>
      </div>
      
      <div className={styles.iconContainer}>
        <button className={styles.iconButton}>
          <span className={styles.icon}><LuSettings /></span>
        </button>
        
        <button className={styles.iconButton}>
          <span className={styles.icon}><LuBell /></span>
        </button>
        
        <button className={styles.iconButton}>
          <span className={styles.icon}><LuCircleUser /></span>
        </button>
      </div>
    </div>
  );
}
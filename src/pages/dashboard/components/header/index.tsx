import styles from '../../styles/header.module.css';
import { LuCircleUser, LuSettings, LuBell, LuSearch, LuMenu } from "react-icons/lu";
import type { HeaderProps } from '../../types';

export default function Header({ onToggleMenu, isMobile = false }: HeaderProps) {
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
      
      {isMobile ? (
        <button className={styles.menuButton} onClick={onToggleMenu}>
          <LuMenu className={styles.menuIcon} />
        </button>
      ) : (
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
      )}
    </div>
  );
}
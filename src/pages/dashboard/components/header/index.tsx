import styles from '../../styles/header.module.css';
import Avatar from '@assets/Avatars.png';

import { LuSettings, LuBell, LuSearch } from 'react-icons/lu';
import type { HeaderProps } from '../../types';

export default function Header({
  onToggleMenu,
  isMobile = false,
}: HeaderProps) {
  return (
    <div className={styles.container}>
      {isMobile && (
        <button
          className={styles.menuButton}
          onClick={onToggleMenu}
          aria-label="Open menu"
        >
          <img src={Avatar} alt="User Avatar" />
        </button>
      )}

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

      {!isMobile && (
        <div className={styles.iconContainer}>
          <button className={styles.iconButton} aria-label="Open settings">
            <span className={styles.icon}>
              <LuSettings />
            </span>
          </button>

          <button className={styles.iconButton} aria-label="Open notifications">
            <span className={styles.icon}>
              <LuBell />
            </span>
          </button>

          <button className={styles.iconButton} aria-label="Open user menu">
            <span className={styles.icon}>
              <img src={Avatar} alt="User Avatar" />
            </span>
          </button>
        </div>
      )}
    </div>
  );
}

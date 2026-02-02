import styles from '../../styles/side-menu.module.css';
import logo from '@assets/my_statement-logo-black.png';
import type { SideMenuProps } from '../../types';
import { LuHouse, LuCreditCard, LuCircleUser, LuSettings, LuBell, LuLogOut, LuX } from "react-icons/lu";

const menuItems = [
  { id: 'home' as const, label: 'Home', icon: <LuHouse /> },
  { id: 'statement' as const, label: 'Statement', icon: <LuCreditCard /> },
  { id: 'profile' as const, label: 'Profile', icon: <LuCircleUser /> },
  { id: 'settings' as const, label: 'Settings', icon: <LuSettings /> },
  { id: 'notifications' as const, label: 'Notifications', icon: <LuBell /> },
];

export default function SideMenu({ logout, activeView, onNavigate, isMobile, isOpen, onClose }: SideMenuProps) {
  const containerClass = isMobile 
    ? `${styles.container} ${styles.mobileContainer} ${isOpen ? styles.open : ''}`
    : styles.container;

  return (
    <>
      {isMobile && isOpen && <div className={styles.overlay} onClick={onClose} />}
      <div className={containerClass}>
        {isMobile && (
          <button className={styles.closeButton} onClick={onClose} aria-label='Close menu'>
            <LuX />
          </button>
        )}
        
        <div className={styles.logo}>
          <img src={logo} width={200} alt="My Statement Logo" />
        </div>
        
        <ul className={styles.menuList} aria-label="Main menu">
          {menuItems.map((item) => (
            <li key={item.id} className={styles.menuItem}>
              <button
                onClick={() => onNavigate(item.id)}
                className={activeView === item.id ? 'selected': ''}
              >
                <div className={styles.menuContent}>
                  <span className={styles.menuIcon}>{item.icon}</span>
                  <span className={styles.menuText}>{item.label}</span>
                </div>
              </button>
            </li>
          ))}
          <li className={styles.menuItem}>
            <button onClick={logout} className={styles.logoutButton} aria-label="Logout">
              <span className={styles.menuIcon}><LuLogOut /></span>
              <span className={styles.menuText}>Logout</span>
            </button>
          </li>
        </ul>
      </div>
    </>
  );
}

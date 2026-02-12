import styles from '../styles/profile.module.css';
import type { ProfileViewProps } from '../types';
import EditProfileView from './edit-profile.view';

export default function ProfileView({
  activeView,
  onNavigate,
}: ProfileViewProps) {
  const menuItems = [
    { id: 'edit' as const, label: 'Edit Profile' },
    { id: 'preferences' as const, label: 'Preferences' },
    { id: 'security' as const, label: 'Security' },
  ];

  const renderActiveView = () => {
    switch (activeView) {
      case 'edit':
        return <EditProfileView />;
      case 'preferences':
        return <EditProfileView />;
      case 'security':
        return <EditProfileView />;
      default:
        return <EditProfileView />;
    }
  };

  return (
    <div className={styles.container}>
      <div className={`${styles.sideMenu}`}>
        <nav className={styles.menuNav}>
          {menuItems.map(item => (
            <button
              key={item.id}
              className={`${styles.menuItem} ${activeView === item.id ? styles.menuItemActive : ''}`}
              onClick={() => {
                onNavigate(item.id);
              }}
            >
              <span className={styles.menuLabel}>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
      <div className={styles.mainContent}>
        <div className={styles.profileContent}>{renderActiveView()}</div>
      </div>
    </div>
  );
}

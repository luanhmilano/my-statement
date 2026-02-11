import type { DashboardProps } from '../types';
import Header from '../components/header';
import SideMenu from '../components/side-menu';
import styles from '../styles/dashboard.module.css';
import HomeView from './home.view';
import ProfileView from './profile.view';
import StatementController from '../controllers/statement.controller';

export default function DashboardView({
  logout,
  activeView,
  onNavigate,
  isMobile,
  isMobileMenuOpen,
  onToggleMobileMenu,
}: DashboardProps) {
  const renderActiveView = () => {
    switch (activeView) {
      case 'home':
        return <HomeView />;
      case 'statement':
        return <StatementController />;
      case 'profile':
        return <ProfileView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className={styles.container}>
      <SideMenu
        logout={logout}
        activeView={activeView}
        onNavigate={onNavigate}
        isMobile={isMobile}
        isOpen={!isMobile || isMobileMenuOpen}
        onClose={onToggleMobileMenu}
      />

      <div className={styles.mainContent}>
        <Header onToggleMenu={onToggleMobileMenu} isMobile={isMobile} />
        <main className={styles.main}>{renderActiveView()}</main>
      </div>
    </div>
  );
}

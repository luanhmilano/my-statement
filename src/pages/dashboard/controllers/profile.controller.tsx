import ProfileView from '../views/profile.view';
import { useState } from 'react';
import type { ProfileNavigationItem } from '../types';

export default function ProfileController() {
  const [activeView, setActiveView] = useState<ProfileNavigationItem>('edit');

  const handleNavigate = (view: ProfileNavigationItem) => {
    setActiveView(view);
  };

  return (
    <ProfileView
      activeView={activeView}
      onNavigate={handleNavigate}
    />
  );
}

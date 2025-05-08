// src/components/layout/Navigation.tsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import type { GlobalLayoutLabelsBundle } from '@/types';

interface NavigationProps {
  labels: GlobalLayoutLabelsBundle | undefined;
}

const Navigation: React.FC<NavigationProps> = ({ labels }) => {
  // Provide fallbacks for label properties
  const navHomeText = labels?.navHome || "Home";
  const navSettingsText = labels?.navSettings || "Settings";

  if (!labels) { // Can show a minimal loading state or just render with fallbacks
    return <nav>Loading navigation...</nav>;
  }

  return (
    <nav>
      <NavLink to="/" className={({isActive}) => isActive ? 'active' : ''}>{navHomeText}</NavLink>
      <NavLink to="/settings" className={({isActive}) => isActive ? 'active' : ''}>{navSettingsText}</NavLink>
    </nav>
  );
};
export default Navigation; 
// src/components/layout/Header.tsx
import React from 'react';
import type { GlobalLayoutLabelsBundle } from '@/types';

interface HeaderProps {
  labels: GlobalLayoutLabelsBundle | undefined;
  isFetching?: boolean;
}

const Header: React.FC<HeaderProps> = ({ labels, isFetching }) => {
  // Provide a minimal fallback if labels are still undefined during initial render pass
  const title = labels?.appTitle || "App Loading...";

  return (
    <header style={{ opacity: isFetching ? 0.7 : 1 }}>
      <h1>
        {title}
        {isFetching && labels && <small style={{ marginLeft: '10px', fontStyle: 'italic', color: '#555' }}>(syncing layout...)</small>}
      </h1>
    </header>
  );
};
export default Header; 
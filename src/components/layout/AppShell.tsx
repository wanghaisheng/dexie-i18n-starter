// src/components/layout/AppShell.tsx
import React, { ReactNode } from 'react';
import { useLocalizedView } from '@/hooks/useLocalizedView';
import { fetchGlobalLayoutView } from '@/services';
import Header from './Header';
import Navigation from './Navigation';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorDisplay from '../common/ErrorDisplay';
import type { GlobalLayoutLabelsBundle, ApiError } from '@/types';

interface AppShellProps { children: ReactNode; }

const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const {
    labels: globalLabels, isPending, isError, error, isFetching, refetch
  } = useLocalizedView<null, GlobalLayoutLabelsBundle>(
    'globalLayoutViewContent', // Unique query key for this "view"
    fetchGlobalLayoutView
  );

  if (isPending && !globalLabels) {
    // Use a very generic loading text if global labels themselves are not available
    return <LoadingSpinner text={globalLabels?.loadingGeneric || "Initializing Application..."} />;
  }

  if (isError || !globalLabels) { // Critical error if global labels fail
    return (
      <div style={{ padding: '20px' }}>
        <ErrorDisplay
          error={error} // Error from the hook
          title={globalLabels?.appErrorHeading || "Application Shell Error"}
          messageTemplate={globalLabels?.appErrorGeneralMessage || "Core UI failed. Details: {message}"}
          onRetry={refetch}
          retryButtonText="Retry Loading Shell"
        />
      </div>
    );
  }

  return (
    <div className="app-shell">
      <Header labels={globalLabels} isFetching={isFetching && !!globalLabels}/> {/* Pass fetching only if labels are loaded */}
      <Navigation labels={globalLabels} />
      <hr />
      <main>{children}</main>
      <hr />
      <footer style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.9em', color: '#7f8c8d' }}>
        <p>{globalLabels.footerText || "App Footer"}</p>
      </footer>
    </div>
  );
};
export default AppShell; 
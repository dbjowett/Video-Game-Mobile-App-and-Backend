import { NavigationProgress, nprogress } from '@mantine/nprogress';
import { useRouterState } from '@tanstack/react-router';
import { useEffect } from 'react';

export const RouteProgress = () => {
  const status = useRouterState({ select: (s) => s.status });

  useEffect(() => {
    if (status === 'pending') nprogress.start();
    else nprogress.complete();
  }, [status]);

  return <NavigationProgress />;
};

import { createRouter, RouterProvider } from '@tanstack/react-router';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import './assets/index.css';
import { auth } from './utils/auth';

import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';

// Import the generated route tree
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { routeTree } from './routeTree.gen';
import { theme } from './theme/mantineTheme';

const queryClient = new QueryClient();
// Create a new router instance
const router = createRouter({
  routeTree,
  context: {
    auth: undefined!,
  },
});

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById('root')!;

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <MantineProvider theme={theme}>
          <Notifications />
          <RouterProvider context={{ auth }} router={router} />
        </MantineProvider>
      </QueryClientProvider>
    </StrictMode>
  );
}

import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';

import { CommandPalette } from '../components/CommandPalette/CommandPalette';
import { RouteProgress } from '../components/RouteProgress/RouteProgress';
import { Auth } from '../utils/auth';

const RootComponent = () => (
  <div>
    <RouteProgress />
    <CommandPalette />
    <Outlet />
    <TanStackRouterDevtools position="bottom-right" />
  </div>
);

export const Route = createRootRouteWithContext<{
  auth: Auth;
}>()({
  component: RootComponent,
});

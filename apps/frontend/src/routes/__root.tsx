import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { Auth } from '../utils/auth';

const RootComponent = () => (
  <div>
    <Outlet />
    <TanStackRouterDevtools position="bottom-right" />
  </div>
);

export const Route = createRootRouteWithContext<{
  auth: Auth;
}>()({
  loader: async ({ context }) => {
    await context.auth.loadUser();
  },
  component: RootComponent,
});

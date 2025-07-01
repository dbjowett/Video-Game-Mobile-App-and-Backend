import { IconVideo } from '@tabler/icons-react';
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { DashboardLayout } from '../components/AppLayout/AppLayout';

export const Route = createFileRoute('/_auth')({
  loader: async ({ context, location }) => {
    await context.auth.loadUser();

    if (context.auth.status === 'loggedOut') {
      throw redirect({
        to: '/login',
        search: { redirect: location.href },
      });
    }

    return { user: context.auth.user };
  },
  component: AppLayoutComponent,
});

function AppLayoutComponent() {
  return (
    <div>
      <DashboardLayout linkItems={[{ Icon: IconVideo, path: '/about', content: 'About' }]}>
        <Outlet />
      </DashboardLayout>
    </div>
  );
}

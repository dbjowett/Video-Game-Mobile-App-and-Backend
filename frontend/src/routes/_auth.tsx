import { IconCalendar, IconList, IconSearch } from '@tabler/icons-react';
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';

import { DashboardLayout } from '../components/AppLayout/AppLayout';

const linkItems = [
  { Icon: IconSearch, path: '/', content: 'Explore' },
  { Icon: IconCalendar, path: '/upcoming', content: 'Upcoming' },
  { Icon: IconList, path: '/lists', content: 'Game Lists' },
];

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
      <DashboardLayout linkItems={linkItems}>
        <Outlet />
      </DashboardLayout>
    </div>
  );
}

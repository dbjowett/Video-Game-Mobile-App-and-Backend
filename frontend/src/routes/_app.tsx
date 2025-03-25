import { IconVideo } from '@tabler/icons-react';
import { Outlet, createFileRoute } from '@tanstack/react-router';
import { DashboardLayout } from '../components/AppLayout/AppLayout';

export const Route = createFileRoute('/_app')({
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

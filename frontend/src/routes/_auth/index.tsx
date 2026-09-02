import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_auth/')({
  component: RouteComponent,
});

function RouteComponent() {
  const {
    auth: { user },
  } = Route.useRouteContext();

  return <div>Hello {user?.email}!</div>;
}

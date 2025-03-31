import { createFileRoute } from '@tanstack/react-router';
import { api } from '../utils/api';
import { User } from '../utils/auth';

const loader = async () => await api.get('profile').json<User>();

export const Route = createFileRoute('/_app/')({
  component: RouteComponent,
  loader,
});

function RouteComponent() {
  const user = Route.useLoaderData();
  console.log(user);
  return <div>Hello {user.name}!</div>;
}

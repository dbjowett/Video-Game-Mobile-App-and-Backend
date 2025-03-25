import { createFileRoute } from '@tanstack/react-router';

const fetchProfile = async () => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/profile`, { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to fetch profile');
  return res.json();
};

export const Route = createFileRoute('/_app/home')({
  component: RouteComponent,
  loader: async () => fetchProfile(),
});

function RouteComponent() {
  return <div>Hello "/home"!</div>;
}

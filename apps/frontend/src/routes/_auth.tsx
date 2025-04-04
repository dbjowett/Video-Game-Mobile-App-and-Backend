import { createFileRoute, redirect } from '@tanstack/react-router';

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
});

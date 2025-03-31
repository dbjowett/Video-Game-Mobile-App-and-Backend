// import ky from 'ky';

// export const api = ky.create({
//   prefixUrl: 'http://localhost:3000',
//   credentials: 'include',
//   hooks: {
//     afterResponse: [
//       async (_, __, response) => {
//         if (response.status === 403) {
//           location.assign('/login');
//           return;
//         }
//         return response;
//       },
//     ],
//   },
// });

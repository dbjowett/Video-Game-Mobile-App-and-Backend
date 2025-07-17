import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const favourites = await prisma.favouriteGame.findMany();

  console.log(`Migrating ${favourites.length} favourite(s)...`);

  await prisma.$transaction(
    favourites.map((fav, index) =>
      prisma.userGameList.create({
        data: {
          userId: fav.userId,
          gameId: fav.gameId,
          listType: 'FAVOURITES',
          position: index,
        },
      }),
    ),
  );

  console.log('Migration complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });

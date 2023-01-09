import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.user.create({
    data: {
      login: 'admin',
      password: await bcrypt.hash('admin', 10),
      settings: {
        create: {
          particleNumber: 230,
          connectionDistance: 180,
          lineThickness: 2.6,
          particleSize: 3.7,
        },
      },
    },
  });
}

async function createUser({ login, password }: { login: string; password: string }) {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  return { login, password: hash };
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(-1);
  });

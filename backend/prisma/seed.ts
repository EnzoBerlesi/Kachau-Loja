import { PrismaClient, Role, OrderStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash('senha123', 10);
  const customerPassword = await bcrypt.hash('senha123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@kachauloja.com' },
    update: {},
    create: {
      name: 'Administrador',
      email: 'admin@kachauloja.com',
      password: adminPassword,
      role: Role.ADMIN,
    },
  });

  const customer = await prisma.user.upsert({
    where: { email: 'cliente@teste.com' },
    update: {},
    create: {
      name: 'Cliente Teste',
      email: 'cliente@teste.com',
      password: customerPassword,
      role: Role.CUSTOMER,
      address: {
        create: {
          street: 'Rua Exemplo',
          number: '123',
          city: 'São Paulo',
          state: 'SP',
          zipCode: '01310-000',
        },
      },
    },
  });

  const informatica = await prisma.category.create({
    data: { name: 'Informática', description: 'Notebooks, desktops e componentes' },
  });
  const perifericos = await prisma.category.create({
    data: { name: 'Periféricos', description: 'Mouses, teclados e acessórios' },
  });
  const celulares = await prisma.category.create({
    data: { name: 'Celulares', description: 'Smartphones e acessórios' },
  });

  const notebook = await prisma.product.create({
    data: {
      name: 'Notebook Gamer Kachau X1',
      description: 'Ryzen 7, 16GB RAM, RTX 4060, SSD 512GB',
      price: 4599.9,
      stock: 8,
      categoryId: informatica.id,
    },
  });
  await prisma.product.create({
    data: {
      name: 'Monitor 24" Full HD',
      description: 'IPS, 144Hz, HDMI/DisplayPort',
      price: 899.0,
      stock: 15,
      categoryId: informatica.id,
    },
  });
  const mouse = await prisma.product.create({
    data: {
      name: 'Mouse Gamer RGB 7200 DPI',
      description: 'Sensor óptico, 6 botões programáveis',
      price: 129.9,
      stock: 40,
      categoryId: perifericos.id,
    },
  });
  await prisma.product.create({
    data: {
      name: 'Teclado Mecânico TKL',
      description: 'Switch blue, RGB, ABNT2',
      price: 249.9,
      stock: 25,
      categoryId: perifericos.id,
    },
  });
  await prisma.product.create({
    data: {
      name: 'Smartphone Kachau Z5 128GB',
      description: 'Tela 6.5", câmera tripla, 5G',
      price: 1899.0,
      stock: 12,
      categoryId: celulares.id,
    },
  });
  await prisma.product.create({
    data: {
      name: 'Capinha Silicone Universal',
      description: 'Anti-impacto, várias cores',
      price: 39.9,
      stock: 100,
      categoryId: celulares.id,
    },
  });

  await prisma.order.create({
    data: {
      userId: customer.id,
      status: OrderStatus.PAID,
      total: notebook.price + mouse.price,
      items: {
        create: [
          { productId: notebook.id, quantity: 1, price: notebook.price },
          { productId: mouse.id, quantity: 1, price: mouse.price },
        ],
      },
    },
  });

  console.log('Seed concluído.');
  console.log(`Admin: admin@kachauloja.com / senha123`);
  console.log(`Cliente: cliente@teste.com / senha123`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

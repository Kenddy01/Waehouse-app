const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function test() {
  try {
    // Inserta un producto de prueba
    await prisma.product.upsert({
      where: { code: 'TEST001' },
      update: {},
      create: {
        code: 'TEST001',
        vendor: 'Test Vendor',
        name: 'Test Product',
        tie: 1,
        height: 1,
      }
    })

    // Lee todos los productos
    const products = await prisma.product.findMany()
    console.log(products)
  } catch (e) {
    console.error(e)
  } finally {
    await prisma.$disconnect()
  }
}

test()

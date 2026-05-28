import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const q = (req.query.q as string || '').trim().toUpperCase()

  if (!q) {
    return res.status(400).json({ message: 'Missing query parameter q' })
  }

  try {
    const products = await prisma.product.findMany({
      where: { code: q },
      take: 20,
    })

    return res.status(200).json(products)
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching products' })
  }
}

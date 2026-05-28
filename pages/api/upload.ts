import type { NextApiRequest, NextApiResponse } from 'next'
import formidable from 'formidable'
import fs from 'fs'
import * as XLSX from 'xlsx'
import { PrismaClient } from '@prisma/client'

export const config = {
  api: {
    bodyParser: false,
  },
}

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' })
  }

  const form = formidable()

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ message: 'Error parsing form data', error: err })
    }

    try {
      const file = Array.isArray(files.file) ? files.file[0] : files.file

      if (!file) {
        return res.status(400).json({ message: 'No file uploaded' })
      }

      const fileBuffer = fs.readFileSync(file.filepath)
      const workbook = XLSX.read(fileBuffer, { type: 'buffer' })
      const sheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[sheetName]
      const jsonData = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet, { defval: '' })

      for (const row of jsonData) {
        const vendor = String(row['vendor'] ?? '').trim()
        let code = String(row['code'] ?? '').trim().toUpperCase()
        const name = String(row['name'] ?? '').trim()
        const tie = Number(row['tie'] ?? 0)
        const height = Number(row['height'] ?? 0)

        if (code && name) {
          await prisma.product.upsert({
            where: { code },
            update: { vendor, name, tie, height },
            create: { vendor, code, name, tie, height },
          })
        }
      }

      res.status(200).json({ message: 'File processed and data saved successfully.' })
    } catch (error) {
      res.status(500).json({ message: 'Error processing file', error })
    }
  })
}

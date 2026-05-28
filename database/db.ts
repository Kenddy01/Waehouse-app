import Database from 'better-sqlite3'
import path from 'path'

// Ruta absoluta al archivo de la base de datos SQLite
const dbPath = path.resolve(process.cwd(), 'prisma', 'warehouse.db')

const db = new Database(dbPath, { verbose: console.log })

export default db

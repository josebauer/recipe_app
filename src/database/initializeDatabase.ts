import { type SQLiteDatabase } from "expo-sqlite";

export async function initializeDatabase(database: SQLiteDatabase) {
  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL
    );
  `)

  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS recipes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      instructions TEXT,
      category_id INTEGER,
      FOREIGN KEY (category_id) REFERENCES categories(id)
    );  
  `)

  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS ingredients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL
    );
  `)

  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS measures (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      unit TEXT NOT NULL UNIQUE
    );
  `)

  const defaultMeasures = [
    "xícaras",
    "ml",
    "litros",
    "kg",
    "gramas",
    "unidade",
    "colheres de sopa",
    "colheres de chá",
    "pacote",
    "pedaço",
    "caixinha"
  ]

  for (const unit of defaultMeasures) {
    await database.execAsync(`
      INSERT OR IGNORE INTO measures (unit) VALUES ('${unit}');
    `)
  }

  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS recipe_ingredients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      recipe_id INTEGER NOT NULL,
      ingredient_id INTEGER NOT NULL,
      quantity REAL NOT NULL,
      measure_id INTEGER NOT NULL,
      FOREIGN KEY (recipe_id) REFERENCES recipes(id),
      FOREIGN KEY (ingredient_id) REFERENCES ingredients(id),
      FOREIGN KEY (measure_id) REFERENCES measures(id)
    );
  `)
}

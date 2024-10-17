import { useSQLiteContext } from "expo-sqlite"

export type CategoryDatabase = {
  id: number
  name: string
}

export function useCategoryDatabase() {
  const database = useSQLiteContext()

  async function create(data: Omit<CategoryDatabase, "id">) {
    const statement = await database.prepareAsync(
      "INSERT INTO categories (name) VALUES ($name)"
    )

    try { 
      const result = await statement.executeAsync({
        $name: data.name
      })

      const insertedRowId = result.lastInsertRowId.toLocaleString()

      return { insertedRowId }
    } catch (error) {
      throw error
    } finally {
      await statement.finalizeAsync()
    }
  }

  async function searchByName(name: string) {
    try {
      const query = "SELECT * FROM categories WHERE name LIKE ?"
      const response = await database.getAllAsync<CategoryDatabase>(query, `%${name}%`)

      return response
    } catch (error) {
      throw error
    }
  }

  return { create, searchByName }
}
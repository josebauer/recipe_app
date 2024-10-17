import { useSQLiteContext } from "expo-sqlite"

export type CategoryDatabase = {
  id: number
  name: string
}

export function useCategoryDatabase() {
  const database = useSQLiteContext()

  async function create(name: string) {
    const statement = await database.prepareAsync(
      "INSERT INTO categories (name) VALUES ($name)"
    )

    try { 
      const result = await statement.executeAsync({
        $name: name
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

  async function update(data: CategoryDatabase) {
    const statement = await database.prepareAsync(
      "UPDATE categories SET name = $name WHERE id = $id"
    )

    try { 
      await statement.executeAsync({
        $id: data.id,
        $name: data.name
      })
    } catch (error) {
      throw error
    } finally {
      await statement.finalizeAsync()
    }
  }

  async function remove(id: number) {
    try {
      await database.execAsync("DELETE FROM categories WHERE id = " + id)
    } catch(error) {
      throw error
    }
  }

  async function show(id: number) {
    try {
      const query = "SELECT * FROM categories WHERE id = ?"
      const response = await database.getFirstAsync<CategoryDatabase>(query, id) 
      return response
    } catch (error) {
      throw error
    }
  }

  return { create, searchByName, update, remove, show }
}
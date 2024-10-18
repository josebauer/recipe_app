import { initializeDatabase } from "@/database/initializeDatabase";
import { Slot } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import { StatusBar } from "react-native";

export default function Layout() {
  return (
    <SQLiteProvider databaseName="recipesManagement.db" onInit={initializeDatabase}>
      <StatusBar
        animated={true}
        backgroundColor="#ad0000"
        barStyle="light-content"
      />
      <Slot />
    </SQLiteProvider>
  )
}
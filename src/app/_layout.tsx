import { initializeDatabase } from "@/database/initializeDatabase";
import { NavigationContainer } from "@react-navigation/native";
import { Slot } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import { StatusBar } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function Layout() {
  return (
    <GestureHandlerRootView>
      <SQLiteProvider databaseName="recipesManagement.db" onInit={initializeDatabase}>
        <StatusBar
          animated={true}
          backgroundColor="#ad0000"
          barStyle="light-content"
        />
        <Slot />
      </SQLiteProvider>
    </GestureHandlerRootView >
  )
}
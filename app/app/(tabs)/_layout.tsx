import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function Layout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: "#2c2c2c" }}>
      <Tabs.Screen
        name="list"
        options={{
          title: "Alla händerlser",
          headerShown: true,
          tabBarShowLabel: false,
          tabBarIcon: ({ color }) => (
            <Ionicons size={24} color={color} name="list" />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerShown: false,
          tabBarShowLabel: false,
          tabBarIcon: ({ color }) => (
            <Ionicons size={32} color={color} name="map" />
          ),
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: "Statistik",
          headerShown: true,
          tabBarShowLabel: false,
          tabBarIcon: ({ color }) => (
            <Ionicons size={24} color={color} name="stats-chart" />
          ),
        }}
      />
    </Tabs>
  );
}

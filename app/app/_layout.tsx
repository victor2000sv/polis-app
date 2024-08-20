import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { Button, Text, TouchableWithoutFeedback, View } from "react-native";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="event" options={{ headerShown: false }} />
      <Stack.Screen
        name="type"
        options={({ route }) => ({
          headerShown: true,
          title: route.params.title,
          headerLeft: () => {
            const router = useRouter();
            return (
              <TouchableWithoutFeedback onPress={() => router.back()}>
                <View style={{ display: "flex", flexDirection: "row" }}>
                  <Ionicons name="chevron-back" color="#202020" size={18} />
                  <Text style={{ marginLeft: 4 }}>Tillbaka</Text>
                </View>
              </TouchableWithoutFeedback>
            );
          },
        })}
      />
    </Stack>
  );
}

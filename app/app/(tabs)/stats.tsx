import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Text, TouchableWithoutFeedback, View } from "react-native";

export default function Stats() {
  const router = useRouter();

  const [rankedTypes, setRankedTypes] = useState<any>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  async function getTypes() {
    const typesResult = await fetch("http://localhost:8080/events/types/rank");
    const types = await typesResult.json();

    setRankedTypes(types);
  }

  async function onRefresh() {
    setRefreshing(true);
    setRankedTypes([]);

    await getTypes();
    setRefreshing(false);
  }

  useEffect(() => {
    getTypes();
  }, []);

  return (
    <FlatList
      data={rankedTypes}
      keyExtractor={(type) => type.type.toString()}
      onRefresh={onRefresh}
      refreshing={refreshing}
      renderItem={({ item }: { item: any }) => {
        return (
          <TouchableWithoutFeedback
            onPress={() => {
              router.push({
                pathname: "/type",
                params: { id: item.type, title: item.title },
              });
            }}
          >
            <View
              style={{
                padding: 16,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexDirection: "row",
                backgroundColor: "#fff",
                marginBottom: 1,
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                {item.title}
              </Text>
              <Text>{item.occurrences} st</Text>
            </View>
          </TouchableWithoutFeedback>
        );
      }}
    />
  );
}

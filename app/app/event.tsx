import Map from "@/components/Map";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Text, TouchableWithoutFeedback, View } from "react-native";
import { Region } from "react-native-maps";

export default function event() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const INITIAL_REGION: Region = {
    latitude: 57.78145,
    longitude: 14.15618,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  };

  // BORDE BARA FINNAS ETT
  const [events, setEvents] = useState<Event[]>([]);

  async function getEvent() {
    const eventResult = await fetch("http://localhost:8080/events/" + id);
    const eventData = await eventResult.json();
    console.log(eventData);

    setEvents([eventData]);
  }

  useEffect(() => {
    getEvent();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={() => router.back()}>
        <View
          style={{
            width: 48,
            height: 48,
            position: "absolute",
            left: 16,
            top: 70,
            zIndex: 199,
            backgroundColor: "#f8f8f8",
            shadowColor: "#000",
            shadowOpacity: 0.1,
            shadowRadius: 6,
            borderRadius: 16,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Ionicons name="chevron-back-sharp" size={24} color="#202020" />
        </View>
      </TouchableWithoutFeedback>
      <Map
        events={events}
        initialRegion={INITIAL_REGION}
        onSelect={() => {}}
        classList={{
          width: "100%",
          height: "50%",
        }}
      />
      <View style={{ backgroundColor: "#fff", flex: 1, padding: 26 }}>
        {events.length > 0 && (
          <>
            <View
              style={{
                display: "flex",
                width: "100%",
                position: "relative",
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 16,
              }}
            >
              <View>
                <Text style={{ fontSize: 22, fontWeight: "bold" }}>
                  {events[0].type_title}
                </Text>
              </View>
            </View>
            <Text style={{ fontSize: 18 }}>{events[0].summary}</Text>

            {events[0].statistics != null && (
              <View
                style={{
                  marginTop: 26,
                  display: "flex",
                  flexWrap: "wrap",
                  flexDirection: "row",
                  width: "100%",
                  gap: 8,
                }}
              >
                <StatView
                  title="trophy"
                  helpText="Rank"
                  stat={events[0].statistics.eventRank}
                />
                <StatView
                  title="locate"
                  helpText="Antalet fall i området"
                  stat={events[0].statistics.numberOfOccurencesInTheArea}
                />
                <StatView
                  title="earth"
                  helpText="Antallet fall i Sverige"
                  stat={events[0].statistics.occurencesOfTypeByYear}
                />
              </View>
            )}
          </>
        )}
      </View>
    </View>
  );
}

function StatView({
  title,
  stat,
  helpText,
}: {
  title: any;
  stat: string;
  helpText: string;
}) {
  return (
    <View
      style={{
        backgroundColor: "#f8f8f8",
        borderColor: "#ccc",
        borderWidth: 1,
        borderStyle: "solid",
        padding: 16,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
        borderRadius: 8,
      }}
    >
      <Ionicons name={title} size={24} color={"#999"} />
      <Text
        style={{
          fontSize: 16,
          fontWeight: "bold",
          marginTop: 8,
        }}
      >
        {stat}
      </Text>
    </View>
  );
}

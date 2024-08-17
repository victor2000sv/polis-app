import Map from "@/components/Map";
import { Event } from "@/types";
import { FontAwesome5 } from "@expo/vector-icons";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import {
  Button,
  Dimensions,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import MapView, { Camera, Marker, Point, Region } from "react-native-maps";

export default function Home() {
  const INITIAL_REGION: Region = {
    latitude: 57.78145,
    longitude: 14.15618,
    latitudeDelta: 2,
    longitudeDelta: 2,
  };

  const [events, setEvents] = useState<Event[]>([]);
  const [eventTypes, setEventTypes] = useState<any[]>([]);
  const [selectedEvents, setSelectedEvents] = useState<Event[]>([]);

  const { width: deviceWidth, height: deviceHeight } = Dimensions.get("screen");

  async function getEvents() {
    const eventsResult = await fetch(
      "http://localhost:8080/events/all?date=2024-08-14"
    );
    const eventsData = await eventsResult.json();
    setEvents(eventsData);

    const typesResult = await fetch("http://localhost:8080/events/types");
    const types = await typesResult.json();

    const sortedTypes: any[] = [];
    types.forEach((type: any) => {
      sortedTypes[type.type_id] = type.title;
    });

    setEventTypes(sortedTypes);
  }

  function onMarkerSelected(events: Event[]) {
    console.log(events);
    setSelectedEvents(events);
  }

  useEffect(() => {
    getEvents();
  }, []);

  return (
    <View
      style={{
        flex: 1,
        height: deviceHeight,
      }}
    >
      <Map
        events={events}
        initialRegion={INITIAL_REGION}
        onSelect={onMarkerSelected}
        classList={{
          width: "100%",
          height: selectedEvents.length > 0 ? "50%" : "100%",
        }}
      />
      <View style={{ backgroundColor: "#fff", flex: 1, padding: 26 }}>
        {selectedEvents.length > 1 &&
          selectedEvents.map((event) => (
            <TouchableWithoutFeedback onPress={() => {}}>
              <View>
                <Text>{eventTypes[event.type]}</Text>
              </View>
            </TouchableWithoutFeedback>
            // <Button title="Event">
            //   <Text>{eventTypes[event.event_id]}</Text>
            // </Button>
          ))}
        {selectedEvents.length == 1 && (
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
                  {eventTypes[selectedEvents[0].type]}
                </Text>
              </View>
              <View>
                <TouchableWithoutFeedback onPress={() => setSelectedEvents([])}>
                  <Text style={{ color: "#999", fontSize: 24 }}>&times;</Text>
                </TouchableWithoutFeedback>
              </View>
            </View>
            <Text style={{ fontSize: 18 }}>{selectedEvents[0].summary}</Text>
          </>
        )}
      </View>
    </View>
  );
}

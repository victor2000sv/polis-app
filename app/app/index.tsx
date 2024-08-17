import DateSelector from "@/components/DateSelector";
import EventHeader from "@/components/EventHeader";
import Map from "@/components/Map";
import { Event } from "@/types";
import { FontAwesome5 } from "@expo/vector-icons";
import { useEffect, useState } from "react";
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
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  };

  const [events, setEvents] = useState<Event[]>([]);
  const [eventTypes, setEventTypes] = useState<any[]>([]);
  const [selectedEvents, setSelectedEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const { width: deviceWidth, height: deviceHeight } = Dimensions.get("screen");

  async function getEvents(date: Date = new Date()) {
    setLoading(true);
    setSelectedEvents([]);
    const eventsResult = await fetch(
      "http://localhost:8080/events/all?date=" + date.toISOString().slice(0, 10)
    );
    const eventsData = await eventsResult.json();
    setEvents(eventsData);

    if (eventTypes.length === 0) {
      const typesResult = await fetch("http://localhost:8080/events/types");
      const types = await typesResult.json();

      const sortedTypes: any[] = [];
      types.forEach((type: any) => {
        sortedTypes[type.type_id] = type.title;
      });

      setEventTypes(sortedTypes);
    }
    setLoading(false);
  }

  function onMarkerSelected(events: Event[]) {
    setSelectedEvents(events);
  }

  async function onDateChange(date: Date) {
    await getEvents(date);
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
      <DateSelector onDateChange={onDateChange} />
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
        {selectedEvents.length > 1 && (
          <>
            <EventHeader
              title={`Det finns ${selectedEvents.length} event här.`}
              onClose={() => setSelectedEvents([])}
            />
            {selectedEvents.map((event) => (
              <TouchableWithoutFeedback
                key={event.event_id}
                onPress={() => setSelectedEvents([event])}
              >
                <View
                  style={{
                    padding: 16,
                    borderStyle: "solid",
                    borderWidth: 2,
                    borderColor: "#F2F2F2",
                    marginBottom: 6,
                    borderRadius: 6,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexDirection: "row",
                  }}
                >
                  <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                    {eventTypes[event.type]}
                  </Text>
                  <FontAwesome5 name="chevron-right" size={16} color="#999" />
                </View>
              </TouchableWithoutFeedback>
            ))}
          </>
        )}
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
      {loading && (
        <View
          style={{
            zIndex: 80,
            position: "absolute",
            width: "100%",
            height: "100%",
            backgroundColor: "#00000020",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text>Loading ...</Text>
        </View>
      )}
    </View>
  );
}

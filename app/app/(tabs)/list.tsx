import { Event, EventSection } from "@/types";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  FlatList,
  SafeAreaView,
  SectionList,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";

export default function list() {
  const [currentPage, setCurrentPage] = useState(1);
  const [events, setEvents] = useState<EventSection[]>([]);
  const [eventTypes, setEventTypes] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const router = useRouter();

  async function getList(page = 1, perPage = 10) {
    const eventsResult = await fetch(
      "http://localhost:8080/events/list?page=" + page + "&perPage=" + perPage
    );
    const eventsData = await eventsResult.json();

    if (eventTypes.length === 0) {
      const typesResult = await fetch("http://localhost:8080/events/types");
      const types = await typesResult.json();

      const sortedTypes: any[] = [];
      types.forEach((type: any) => {
        sortedTypes[type.type_id] = type.title;
      });

      setEventTypes(sortedTypes);
    }

    setEvents(groupByDate(events, eventsData));
  }

  function groupByDate(
    alreadyGroupedEvents: EventSection[],
    eventsData: Event[]
  ) {
    let groupedEvents: EventSection[] = alreadyGroupedEvents;
    let lastDate: string | null =
      groupedEvents.length > 0
        ? groupedEvents[groupedEvents.length - 1].title
        : null;
    for (let i = 0; i < eventsData.length; i++) {
      const eventDate = eventsData[i].date.slice(0, 10);
      if (eventDate != lastDate) {
        lastDate = eventDate;
        groupedEvents.push({
          title: eventDate,
          data: [eventsData[i]],
        });
      } else {
        groupedEvents[groupedEvents.length - 1].data.push(eventsData[i]);
      }
    }

    return groupedEvents;
  }

  async function onRefresh() {
    setRefreshing(true);
    setEvents([]);
    setCurrentPage(1);
    await getList();
    setRefreshing(false);
  }

  async function onReechBottom() {
    const nextPage = currentPage + 1;
    await getList(nextPage);

    setCurrentPage(nextPage);
    return true;
  }

  useEffect(() => {
    getList();
  }, []);

  return (
    <>
      <SafeAreaView>
        <SectionList
          sections={events}
          onEndReached={onReechBottom}
          onEndReachedThreshold={0.5}
          onRefresh={onRefresh}
          refreshing={refreshing}
          ListEmptyComponent={() => <Text>Inga händelser.</Text>}
          renderItem={({ item }: { item: Event }) => (
            <TouchableWithoutFeedback
              onPress={() => {
                router.push({
                  pathname: "/event",
                  params: { id: item.event_id },
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
                  {eventTypes[item.type]}
                </Text>
                <Text>{item.city}</Text>
              </View>
            </TouchableWithoutFeedback>
          )}
          renderSectionHeader={({ section }: { section: EventSection }) => (
            <Text
              style={{
                padding: 16,
                color: "#202020",
                fontWeight: "bold",
                backgroundColor: "#f8f8f8",
              }}
            >
              {section.title}
            </Text>
          )}
          keyExtractor={(item, index) =>
            item.event_id.toString() + index.toString()
          }
        />
      </SafeAreaView>
    </>
  );
}

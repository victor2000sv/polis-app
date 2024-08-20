import { Day, WeekDay } from "@/types";
import { useMemo, useState } from "react";
import {
  PanResponder,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";

export default function DateSelector({
  onDateChange,
}: {
  onDateChange?: (newDate: Date) => void;
}) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedWeek, setSelectedWeek] = useState<Day[]>(getWeekDates());
  const [selectedWeekNumber, setSelectedWeekNumber] = useState(
    getWeekNumber(new Date())
  );
  const swipeThreshold = 50;

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: () => true,
        onPanResponderRelease: (e, gestureState) => {
          const { dx } = gestureState;
          onSwipeRelease(dx);
        },
      }),
    [selectedWeekNumber]
  );

  function onSwipeRelease(dx: number) {
    // FÖRBÄTTRING: Om det byter år så måste detta ändras!
    const newWeek =
      dx < -swipeThreshold
        ? selectedWeekNumber + 1
        : dx > swipeThreshold
        ? selectedWeekNumber - 1
        : selectedWeekNumber;

    setSelectedWeekNumber(newWeek);
    setSelectedWeek(getWeekDates(newWeek, selectedWeek[0].year));
  }

  function getWeekNumber(date: Date) {
    const currentDate: any = new Date(date.getTime());
    currentDate.setDate(
      currentDate.getDate() + 4 - (currentDate.getDay() || 7)
    );
    const yearStart: any = new Date(currentDate.getFullYear(), 0, 1);
    const weekNumber = Math.ceil(
      ((currentDate - yearStart) / 86400000 + 1) / 7
    );
    return weekNumber;
  }

  function getWeekDates(
    weekNumber: number = getWeekNumber(new Date()),
    year: number = new Date().getFullYear()
  ): Day[] {
    const startDate = new Date(year, 0, 1);
    const dayOfWeek = startDate.getDay();
    const todaysDate = new Date();

    //Ser till att veckan börjar på en måndag
    const offset = dayOfWeek <= 4 ? dayOfWeek - 1 : dayOfWeek - 8;
    const weekStartDate = new Date(
      startDate.setDate(startDate.getDate() - offset + (weekNumber - 1) * 7)
    );

    const daysOfWeek: WeekDay[] = [
      "Måndag",
      "Tisdag",
      "Onsdag",
      "Torsdag",
      "Fredag",
      "Lördag",
      "Söndag",
    ];

    const weekDates: Day[] = [];
    for (let i = 0; i < 7; i++) {
      const currentDay = new Date(weekStartDate);
      currentDay.setDate(weekStartDate.getDate() + i);

      weekDates.push({
        date: currentDay.getDate(),
        day: daysOfWeek[
          currentDay.getDay() === 0 ? 6 : currentDay.getDay() - 1
        ],
        month: currentDay.getMonth() + 1,
        year: currentDay.getFullYear(),
        fullDate: new Date(
          `${currentDay.getFullYear()}-${
            currentDay.getMonth() + 1
          }-${currentDay.getDate()}`
        ),
        isCurrent: areDatesOnSameDay(currentDay, todaysDate),
      });
    }

    return weekDates;
  }

  function areDatesOnSameDay(date1: Date, date2: Date): boolean {
    const year1 = date1.getFullYear();
    const month1 = date1.getMonth();
    const day1 = date1.getDate();

    const year2 = date2.getFullYear();
    const month2 = date2.getMonth();
    const day2 = date2.getDate();

    return year1 === year2 && month1 === month2 && day1 === day2;
  }

  return (
    <View
      style={{
        position: "absolute",
        top: 70,
        zIndex: 99,
        left: 16,
        right: 16,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: "white",
        padding: 12,
        borderRadius: 16,
        shadowColor: "#000000",
        shadowOpacity: 0.1,
        shadowRadius: 6,
      }}
      {...panResponder.panHandlers}
    >
      {selectedWeek.map((day) => (
        <TouchableWithoutFeedback
          key={day.date}
          onPress={() => {
            if (
              day.fullDate > new Date() ||
              areDatesOnSameDay(day.fullDate, selectedDate)
            )
              return;
            setSelectedDate(day.fullDate);
            if (onDateChange !== undefined) onDateChange(day.fullDate);
          }}
        >
          <View
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: areDatesOnSameDay(day.fullDate, selectedDate)
                ? "#2c2c2c"
                : "white",
              width: 40,
              padding: 5,
              paddingVertical: 12,
              borderRadius: 8,
            }}
          >
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 10,
                textTransform: "uppercase",
                color:
                  day.day == "Lördag" || day.day == "Söndag"
                    ? "#ff5e57"
                    : areDatesOnSameDay(day.fullDate, selectedDate)
                    ? "#fff"
                    : day.fullDate > new Date()
                    ? "#999"
                    : "#202020",
              }}
            >
              {day.day.slice(0, 3)}
            </Text>
            <Text
              style={{
                fontWeight: "bold",
                marginTop: 3,
                color: areDatesOnSameDay(day.fullDate, selectedDate)
                  ? "white"
                  : day.fullDate > new Date()
                  ? "#999"
                  : "#202020",
              }}
            >
              {day.date}
            </Text>
          </View>
        </TouchableWithoutFeedback>
      ))}
    </View>
  );
}

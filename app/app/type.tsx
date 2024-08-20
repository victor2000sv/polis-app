import Chart from "@/components/Chart";
import { ChartPillar } from "@/types";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { SafeAreaView, ScrollView, Text, View } from "react-native";

export default function Type() {
  const [currentType, setCurrentType] = useState<any>(null);
  const { id, title } = useLocalSearchParams();
  const [facts, setFacts] = useState<any>(null);

  const listOfNumberSayings = [
    "mest",
    "näst",
    "tredje",
    "fjärde",
    "femte",
    "sjätte",
    "sjunde",
    "åttonde",
    "nionde",
    "tionde",
    "elfte",
    "tolfte",
  ];

  const allMonths = [
    "januari",
    "februari",
    "mars",
    "april",
    "maj",
    "juni",
    "juli",
    "augusti",
    "september",
    "oktober",
    "november",
    "december",
  ];

  function formatNumber(num: number) {
    if (num <= 12) return listOfNumberSayings[num - 1];
    const lastDigit = num.toString().charAt(num.toString().length - 1);
    if (lastDigit == "1" || lastDigit == "2") return `${num}:a`;

    return `${num}:e`;
  }

  async function getType() {
    const typesResult = await fetch(
      "http://localhost:8080/events/types/stats?type=" + id
    );
    const type = await typesResult.json();

    setCurrentType(type);

    const calmestMonth = type.months.filter(
      (month: any) => month.monthIndex === type.calmestMonthIndex
    )[0];
    const busiestMonth = type.months.filter(
      (month: any) => month.monthIndex === type.busiestMonthIndex
    )[0];

    setFacts({
      title,
      rank: type.rank,
      year: new Date().getFullYear(),
      totalEvents: type.totalEvents,
      cityWithMostEvents: type.cityWithMostEvents,
      calmestMonth,
      busiestMonth,
    });
  }

  function mapMonths(months: any): ChartPillar[] {
    let monthsArray: ChartPillar[] = Array.from({ length: 12 });
    for (let i = 0; i < months.length; i++) {
      const month = months[i];
      monthsArray[month.monthIndex] = {
        title: allMonths[month.monthIndex],
        value: month.totalEvents,
        active: true,
      };
    }

    return monthsArray;
  }

  useEffect(() => {
    getType();
  }, []);

  return (
    <>
      {currentType != null && facts != null && (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
          <ScrollView
            style={{
              flex: 1,
              paddingTop: 16,
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            <Chart
              data={mapMonths(currentType.months)}
              borderColor="#999"
              activeColor="#ff5e57"
              pillarColor="#ff5e57"
            />
            <Text
              style={{ paddingHorizontal: 16, fontSize: 16, lineHeight: 22 }}
            >
              {facts.title} är rankad som den {formatNumber(facts.rank)}{" "}
              vanligaste händelsen under {facts.year}. Hittils har{" "}
              {facts.totalEvents} fall rapporterats i år, med{" "}
              {facts.cityWithMostEvents} som den stad där flest incidenter
              inträffat.{" "}
              {allMonths[facts.calmestMonth.monthIndex]
                .charAt(0)
                .toUpperCase() +
                allMonths[facts.calmestMonth.monthIndex].slice(1)}{" "}
              vart den lugnaste månaden, med {facts.calmestMonth.totalEvents}{" "}
              fall, där majoriteten inträffade i{" "}
              {facts.calmestMonth.cityWithMostEvents}.{" "}
              {allMonths[facts.busiestMonth.monthIndex]
                .charAt(0)
                .toUpperCase() +
                allMonths[facts.busiestMonth.monthIndex].slice(1)}{" "}
              var den mest intensiva månaden, med totalt{" "}
              {facts.busiestMonth.totalEvents} fall, varav de flesta inträffade
              i {facts.busiestMonth.cityWithMostEvents}.
            </Text>
          </ScrollView>
        </SafeAreaView>
      )}
    </>
  );
}

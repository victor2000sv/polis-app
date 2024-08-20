import { ChartPillar } from "@/types";
import { Dimensions, Text, View } from "react-native";

export default function Chart({
  data,
  color = "#ccc",
  activeColor = "#202020",
  pillarColor = color,
  borderColor = color,
  gap = 12,
  padding = 16,
  chartHeight = 280,
}: {
  data: ChartPillar[];
  color?: string;
  pillarColor?: string;
  activeColor?: string;
  deactiveColor?: string;
  borderColor?: string;
  gap?: number;
  padding?: number;
  chartHeight?: number;
}) {
  let highestValue = Math.max(
    ...data
      .filter((pillar) => pillar !== undefined)
      .map((pillar) => pillar.value)
  );
  highestValue *= 1.1;

  const valueBreaks = Array.from(
    { length: 5 },
    (_, i) => (highestValue / 4) * (4 - i)
  );

  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        height: chartHeight,
        width: "100%",
        padding,
        paddingLeft: padding - 5,
        gap: 8,
      }}
    >
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-end",
          height: "100%",
          gap,
          position: "relative",

          borderWidth: 0,
          borderRightWidth: 1,
          borderBottomWidth: 1,
          borderColor,
          flex: 1,
          paddingLeft: 5,
        }}
      >
        <View
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "space-between",
            flexDirection: "column",
          }}
        >
          {valueBreaks.map((breakPoint, index) => {
            return (
              <View
                style={{
                  borderColor,
                  opacity: index === 0 ? 0 : 0.3,
                  borderStyle: "solid",
                  borderWidth: 0,
                  borderTopWidth: 1,
                  width: "100%",
                }}
                key={index}
              />
            );
          })}
        </View>
        {data.map((pillar, index) => {
          const pillarHeight =
            pillar !== undefined ? (pillar.value / highestValue) * 100 : 2;
          const pcolor =
            pillar !== undefined
              ? pillar.active
                ? activeColor
                : pillarColor
              : pillarColor;
          return (
            <View
              key={index}
              style={{
                backgroundColor: pcolor,
                flex: 1,
                height: `${pillarHeight}%`,
              }}
            ></View>
          );
        })}
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          height: chartHeight - padding * 2 + 11,
          position: "relative",
          top: -10,
        }}
      >
        {valueBreaks.map((breakPoint, index) => {
          return (
            <Text
              key={index}
              style={{
                color: borderColor,
                fontWeight: "bold",
                fontSize: 12,
                position: "relative",
                top: 4,
              }}
            >
              {parseInt(breakPoint.toString())}
            </Text>
          );
        })}
      </View>
    </View>
  );
}

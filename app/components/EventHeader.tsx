import { Text, TouchableWithoutFeedback, View } from "react-native";

export default function EventHeader({
  title,
  onClose,
}: {
  title: string;
  onClose: () => void;
}) {
  return (
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
        <Text style={{ fontSize: 22, fontWeight: "bold" }}>{title}</Text>
      </View>
      <View>
        <TouchableWithoutFeedback onPress={() => onClose()}>
          <Text style={{ color: "#999", fontSize: 24 }}>&times;</Text>
        </TouchableWithoutFeedback>
      </View>
    </View>
  );
}

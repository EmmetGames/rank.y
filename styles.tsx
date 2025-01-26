import { StyleSheet } from "react-native";
import { PlusButton } from "./components/PlusButton";

const styles = StyleSheet.create({
  titleContainer: { flexDirection: "row", alignItems: "center", gap: 8 },
  stepContainer: { gap: 8, marginBottom: 8 },
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 16 },
  heading: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  items: { marginTop: 30 },
  sectionTitle: { fontSize: 24, fontWeight: "bold" },
  writeTaskWrapper: {
    position: "absolute",
    bottom: 16,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  input: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 60,
    borderWidth: 1,
    width: 250,
  },
  addWrapper: {
    width: 60,
    height: 60,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  plusButton: {
    backgroundColor: '#2196F3',
  }
});

export default styles;

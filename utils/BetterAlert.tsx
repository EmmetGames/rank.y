import { Platform, Alert } from "react-native";

type BetterAlertProps = {
  title: string;
  message: string;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
};


// Better alert is an alert that works on both web and mobile platforms.
// If onConfirm is provided, it will show a two-button alert with the confirm and cancel buttons.
export function betterAlert({
  title,
  message,
  onConfirm,
  confirmText = "OK",
  cancelText = "Cancel",
}: BetterAlertProps) {
  if (Platform.OS === "web") {
    if (onConfirm) {
      // Show a confirm dialog
      const confirmed = window.confirm(message);
      if (confirmed) onConfirm();
    } else {
      // Simple alert
      window.alert(message);
    }
  } else {
    // Native iOS/Android
    if (onConfirm) {
      // Two-button Alert
      Alert.alert(title, message, [
        { text: cancelText, style: "cancel" },
        { text: confirmText, onPress: onConfirm },
      ]);
    } else {
      // One-button Alert
      Alert.alert(title, message, [{ text: confirmText }]);
    }
  }
}

import { Platform, Alert } from "react-native";

type BetterAlertProps = {
  title: string;
  message: string;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
};


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

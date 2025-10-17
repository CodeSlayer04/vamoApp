import * as Notifications from "expo-notifications";
import { doc, updateDoc } from "firebase/firestore";
import { db, auth } from "../config/firebaseconfig";

async function guardarTokenExpo() {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== "granted") return;

  const token = (await Notifications.getExpoPushTokenAsync()).data;
  const uid = auth.currentUser?.uid;

  if (uid) {
    await updateDoc(doc(db, "usuarios", uid), { tokenExpo: token });
  }
}

import {
  collection,
  getDoc,
  doc,
  Firestore,
  arrayUnion,
  updateDoc,
} from "firebase/firestore";
import { PanelObj } from "../App";

interface DBPanel {
  audio: string;
  index: number;
  video: string;
  transition: string;
}

export function loadChapter(
  db: Firestore,
  comicName: string,
  customID: string,
  setPanels: (panels: PanelObj[]) => void
) {
  const comicRef = doc(db, "comics", comicName); // Reference to the comic document
  const chaptersCollectionRef = collection(comicRef, "chapters"); // Reference to the nested chapters collection
  const chapterRef = doc(chaptersCollectionRef, "ch" + customID); // ref to chapter

  const docSnap = getDoc(chapterRef);
  docSnap.then((doc) => {
    if (doc.exists()) {
      console.log("Document data:", doc.data());
      const panels: PanelObj[] = doc
        .data()
        .panels.map((panel: DBPanel) => ({
          video: panel.video,
          sound: panel.audio,
          tran: panel.transition,
        }));
      setPanels(panels);
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }
  });
}

// import { getAnalytics } from "firebase/analytics";
import {
  collection,
  setDoc,
  doc,
  Firestore,
  arrayUnion,
  updateDoc,
  getDoc,
  addDoc,
} from "firebase/firestore";
import { PanelObj } from "../App";

export function makePasskey(length: number) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

export function createChapterObject(panels: PanelObj[]) {
  const data = panels.map(({ video, sound, tran }, index) => ({
    audio: sound,
    index,
    video,
    transition: tran !== undefined ? tran : "",
  }));
  console.log(data);
  return data;
}

// add a chapter to the firestore for a comic, ** overwrites chapter if it already exists **
export async function updateSoundsDB(
  db: Firestore,
  comicName: string,
  sounds: string[],
  audioFileNames: string[]
) {
  const musicRef = doc(db, "music", comicName);
  let docSnap = await getDoc(musicRef);
  if (!docSnap.exists()) {
    await setDoc(musicRef, {
      songs: [],
    });
  }
  docSnap = await getDoc(musicRef);
  if (!docSnap.exists()) {
    console.error("Error getting document");
    return;
  }
  let dbSounds: any[] = [];
  let newSoundsItems: any[] = [];

  console.log(docSnap.data());
  dbSounds = docSnap
    .data()
    .songs.map((music) => ({ name: music.name, url: music.url }));

  for (let i = 0; i < audioFileNames.length; i++) {
    let found = false;
    dbSounds.forEach((music) => {
      if (music.name === audioFileNames[i]) {
        found = true;
      }
    });
    if (!found) {
      let newSound = {
        name: audioFileNames[i],
        url: sounds[i],
      };
      newSoundsItems.push(newSound);
    }
  }

  console.log("dbSounds: ", dbSounds);
  console.log("newSoundsItems: ", newSoundsItems);

  if (newSoundsItems.length > 0) {
    await updateDoc(musicRef, {
      songs: [...dbSounds, ...newSoundsItems],
    });
  }
}

// add a chapter to the firestore for a comic, ** overwrites chapter if it already exists **
export async function addComicToFirestore(
  db: Firestore,
  userID: string,
  customID: string,
  comicName: string,
  description: string,
  imageSource: string,
  panObjs: PanelObj[]
) {
  try {
    const comicRef = doc(db, "users", userID); // Reference to the comic document
    const chaptersCollectionRef = collection(comicRef, "chapters"); // Reference to the nested chapters collection
    const chapterRef = doc(chaptersCollectionRef, customID); // Create a reference for a new chapter

    const list = createChapterObject(panObjs); // add indexes to panels for uploading
    // if (update) {
    //   const data = { chapter: parseInt(customID), panels: list };
    //   await updateDoc(chapterRef, data); // Set the chapter data
    // } else {
    const data = {
      title: comicName,
      description: description,
      panels: list,
      imageSource: imageSource,
    };
    await setDoc(chapterRef, data); // Set the chapter data
    // }
    console.log("Chapter added with ID: ", chapterRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

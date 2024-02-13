import React, { useRef } from "react";
import "./UploadPage.css";
import "./UserPage.css";
import { PanelObj } from "../App";
import { db } from "../utility/config";
import {
  collection,
  getDocs,
  doc,
  Firestore,
  arrayUnion,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { useState, useEffect } from "react";

interface UserPageProps {
  shown: boolean;
  setShown: (shown: boolean) => void;
  setSounds: (sounds: string[]) => void;
  setAudioFileNames: (fileNames: string[]) => void;
  audioFileNames: string[];
  sounds: string[];
  setPanels: (panels: PanelObj[]) => void;
  currentUserId: string;
  comicList: ComicItem[];
}

interface DBPanel {
  audio: string;
  index: number;
  video: string;
  transition: string;
}

interface ComicItem {
  title: string;
  imageSource: string;
  description: string;
  id: string;
}

export const UserPage = ({
  shown,
  setSounds,
  sounds,
  setAudioFileNames,
  setPanels,
  audioFileNames,
  setShown,
  currentUserId,
  comicList,
}: UserPageProps) => {
  const [classView, setClassView] = useState<string>(
    shown ? "music-page-shown" : "upload-page-hidden"
  );
  const [currComic, setCurrComic] = useState<string>("One-Punch-Man");
  const [musicListItems, setMusicList] = useState<any[]>([]);
  const audioRefs = useRef({});

  const loadChapter = async (comic) => {
    // try {
    const chapter = doc(db, "users", currentUserId);
    const chapterCollection = collection(chapter, "chapters");
    const docSnap = getDoc(doc(chapterCollection, comic));
    docSnap.then((doc) => {
      if (doc.exists()) {
        console.log("Document data:", doc.data());
        const panels: PanelObj[] = doc.data().panels.map((panel: DBPanel) => ({
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

    return [];
  };

  useEffect(() => {
    setClassView(shown ? "music-page-shown" : "upload-page-hidden");
  }, [shown]);

  useEffect(() => {
    loadChapter(currComic);
  }, [currComic]);

  useEffect(() => {
    Object.keys(audioRefs.current).forEach((key) => {
      if (audioRefs.current[key] && audioRefs.current[key].current)
        audioRefs.current[key].current.load();
    });
  }, [musicListItems]);

  const comicListItems = comicList.map((comic) => (
    <div className="comic-item">
      <button
        className={"comic-item-button"}
        onClick={() => loadChapter(comic.id)}
      >
        {comic.title}
        <img src={comic.imageSource} alt={comic.title} width={100} />
        {comic.description}
      </button>
    </div>
  ));

  return (
    <div className={classView}>
      <div className="page-buttons">
        <button
          className="hide-page"
          onClick={() => {
            setShown(false);
          }}
        >
          X
        </button>
      </div>
      <div className="comic-list">{comicListItems}</div>
    </div>
  );
};

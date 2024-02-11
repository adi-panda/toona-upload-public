import React, { useRef } from "react";
import "./UploadPage.css";
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

interface MusicPageProps {
  shown: boolean;
  setShown: (shown: boolean) => void;
  setSounds: (sounds: string[]) => void;
  setAudioFileNames: (fileNames: string[]) => void;
  audioFileNames: string[];
  sounds: string[];
  comicList: string[];
}

const loadMusic = async (comic, setMusicList) => {
  try {
    const musicRef = doc(db, "music", comic);
    const docSnap = await getDoc(musicRef);

    if (docSnap.exists()) {
      console.log(docSnap.data());
      setMusicList(
        docSnap
          .data()
          .songs.map((music) => ({ name: music.name, url: music.url }))
      );
    } else {
      console.log("No such document!");
    }
  } catch (error) {
    console.error("Error getting document:", error);
  }
  return [];
};

const sampleMusic = [
  {
    name: "brobrobrobrorboarbuodhnboia",
    url: "https://d1ugggz6h4f19m.cloudfront.net/Battlestar+Galactica+Deadlock+music%2C+full+OST_+Strategy+Map+4.mp3",
  },
  {
    name: "sample2",
    url: "https://d1ugggz6h4f19m.cloudfront.net/Battlestar+Galactica+Deadlock+music%2C+full+OST_+Strategy+Map+4.mp3",
  },
];

const comicListSample = ["One Punch Man", "One Piece", "Superman"];

export const MusicPage = ({
  shown,
  setSounds,
  sounds,
  setAudioFileNames,
  audioFileNames,
  setShown,
  comicList,
}: MusicPageProps) => {
  const [classView, setClassView] = useState<string>(
    shown ? "music-page-shown" : "upload-page-hidden"
  );
  const [currComic, setCurrComic] = useState<string>("One-Punch-Man");
  const [musicListItems, setMusicList] = useState<any[]>([]);
  const audioRefs = useRef({});

  useEffect(() => {
    setClassView(shown ? "music-page-shown" : "upload-page-hidden");
  }, [shown]);

  useEffect(() => {
    loadMusic(currComic, setMusicList);
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
        className={
          currComic === comic
            ? "comic-item-button-selected"
            : "comic-item-button"
        }
        onClick={() => {
          setCurrComic(comic);
        }}
      >
        {comic}
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
      <div className="musicContainer">
        <div className="comic-list">{comicListItems}</div>
        <div className="musicList">
          {musicListItems.map((music) => (
            <div className="music-item">
              <div className="music-item-name">
                {music.name}
                <button
                  className="music-item-button"
                  onClick={() => {
                    let url: string = music.url;
                    let name: string = music.name;
                    setSounds([...sounds, url]);
                    setAudioFileNames([...audioFileNames, name]);
                  }}
                >
                  Add
                </button>
              </div>
              <audio
                key={music.name} // Assuming each item has a unique 'id'.
                ref={(el) => (audioRefs.current[music.name] = el)}
                controls
              >
                <source src={music.url} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

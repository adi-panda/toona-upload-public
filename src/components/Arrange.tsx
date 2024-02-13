import React from "react";
import "./Arrange.css";
import ListItem from "./ListItem";
import { PanelObj, HandleListFuctions } from "../App";
import { UploadPage } from "./UploadPage";
import { MusicPage } from "./MusicPage";
import { UserPage } from "./UserPage";
import { useState } from "react";
import { loadChapter } from "../utility/load_chapter";
import { db } from "../utility/config";
import { collection, doc, getDocs } from "firebase/firestore";
import { SignOutButton } from "@clerk/clerk-react";

interface ArrangeItemProps {
  videos: string[];
  videoFileNames: string[];
  audioFileNames: string[];
  currentUserId: string;
  setAudioFileNames: (fileNames: string[]) => void;
  sounds: string[];
  setSounds: (sounds: string[]) => void;
  transitions: string[];
  panels: PanelObj[];
  funcs: HandleListFuctions;
}

interface ComicItem {
  title: string;
  imageSource: string;
  description: string;
  id: string;
}

const Arrange = ({
  videos,
  currentUserId,
  videoFileNames,
  audioFileNames,
  setAudioFileNames,
  sounds,
  setSounds,
  transitions,
  panels,
  funcs,
}: ArrangeItemProps) => {
  const [done, setDone] = useState<boolean>(false);
  const [musicShown, setMusicShown] = useState<boolean>(false);
  const [usersShown, setUsersShown] = useState<boolean>(false);
  const [comicList, setComicList] = useState<ComicItem[]>([]);
  const [chapterNumber, setchapterNumber] = useState("");
  const [comicName, setComicName] = useState("");

  const handleChapterChange = (event: any) => {
    setchapterNumber(event.target.value);
  };

  const handleComicChange = (event: any) => {
    setComicName(event.target.value);
  };

  const handleReset = () => {
    console.log("Reset");
    funcs.resetPanels();
  };

  const loadUserSeries = async () => {
    const comicRef = doc(db, "users", currentUserId); // Reference to the comic document
    const chaptersCollectionRef = collection(comicRef, "chapters"); // Reference to the nested chapters collection
    let result: ComicItem[] = [];
    await await getDocs(chaptersCollectionRef)
      .then((snapshot) => {
        snapshot.docs.forEach((doc) => {
          result.push({
            id: doc.id,
            title: doc.data().title,
            imageSource: doc.data().imageSource,
            description: doc.data().description,
          });
        });
      })
      .catch((error) => {
        console.error("Error getting documents: ", error);
      });

    console.log("result: ", result[0]);
    return result;
  };

  const handleDone = () => {
    console.log("Done");
    setDone(true);
  };

  const handleLoad = async () => {
    console.log("Load");
    setComicList(await loadUserSeries());
    setUsersShown(true);
  };

  return (
    <>
      <UploadPage
        shown={done}
        setShown={setDone}
        panels={panels}
        sounds={sounds}
        audioFileNames={audioFileNames}
        userID={currentUserId}
      />
      <UserPage
        shown={usersShown}
        setSounds={setSounds}
        sounds={sounds}
        currentUserId={currentUserId}
        setPanels={funcs.setPanels}
        setAudioFileNames={setAudioFileNames}
        audioFileNames={audioFileNames}
        setShown={setUsersShown}
        comicList={comicList}
      />
      <div className="area">
        <div className="list-area">
          <div className="tool-area">
            <div className="load-button-cont">
              <button className="load" onClick={handleLoad}>
                Load Chapter!
              </button>
            </div>
            <button className="reset" onClick={handleReset}>
              Reset
            </button>
            <button className="done" onClick={handleDone}>
              Done
            </button>
            {/* <button
              title="music"
              className="music"
              onClick={async () => {
                setMusicShown(true);
                setComicList(await loadUserSeries());
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="15"
                height="15"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M21 3v12.5a3.5 3.5 0 0 1-3.5 3.5a3.5 3.5 0 0 1-3.5-3.5a3.5 3.5 0 0 1 3.5-3.5c.54 0 1.05.12 1.5.34V6.47L9 8.6v8.9A3.5 3.5 0 0 1 5.5 21A3.5 3.5 0 0 1 2 17.5A3.5 3.5 0 0 1 5.5 14c.54 0 1.05.12 1.5.34V6z"
                />
              </svg>
            </button> */}
            <SignOutButton />
          </div>
          <div className="panel-list">
            {panels.map((panel, index) => (
              <ListItem
                videos={videos}
                videoFileNames={videoFileNames}
                audioFileNames={audioFileNames}
                sounds={sounds}
                transitions={transitions}
                index={index}
                vid={panel.video}
                audio={panel.sound}
                tran={panel.tran}
                funcs={funcs}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Arrange;

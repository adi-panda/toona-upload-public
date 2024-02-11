import React from "react";
import "./Arrange.css";
import ListItem from "./ListItem";
import { PanelObj, HandleListFuctions } from "../App";
import { UploadPage } from "./UploadPage";
import { MusicPage } from "./MusicPage";
import { useState } from "react";
import { loadChapter } from "../utility/load_chapter";
import { db } from "../utility/config";
import { collection, getDocs } from "firebase/firestore";

interface ArrangeItemProps {
  videos: string[];
  videoFileNames: string[];
  audioFileNames: string[];
  setAudioFileNames: (fileNames: string[]) => void;
  sounds: string[];
  setSounds: (sounds: string[]) => void;
  transitions: string[];
  panels: PanelObj[];
  funcs: HandleListFuctions;
}

const Arrange = ({
  videos,
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
  const [comicList, setComicList] = useState<string[]>([]);
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

  const loadComicNames = async () => {
    const music = collection(db, "music");
    let result: string[] = [];
    await getDocs(music)
      .then((snapshot) => {
        snapshot.docs.forEach((doc) => {
          result.push(doc.id);
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

  const handleLoad = () => {
    console.log("Load");
    loadChapter(db, comicName, chapterNumber, funcs.setPanels);
  };

  return (
    <>
      <UploadPage
        shown={done}
        setShown={setDone}
        panels={panels}
        sounds={sounds}
        audioFileNames={audioFileNames}
      />
      <MusicPage
        shown={musicShown}
        setSounds={setSounds}
        sounds={sounds}
        setAudioFileNames={setAudioFileNames}
        audioFileNames={audioFileNames}
        setShown={setMusicShown}
        comicList={comicList}
      />
      <div className="area">
        <div className="list-area">
          <div className="tool-area">
            <div className="load-button-cont">
              <button className="load" onClick={handleLoad}>
                Load DB
              </button>
              <input
                className="text-input"
                type="text"
                value={comicName}
                onChange={handleComicChange}
                placeholder="Comic DB-Name"
              />
              <input
                className="text-input"
                type="text"
                value={chapterNumber}
                onChange={handleChapterChange}
                placeholder="Chapter Number"
              />
            </div>
            <button className="reset" onClick={handleReset}>
              Reset
            </button>
            <button className="done" onClick={handleDone}>
              Done
            </button>
            <button
              title="music"
              className="music"
              onClick={async () => {
                setMusicShown(true);
                setComicList(await loadComicNames());
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
            </button>
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

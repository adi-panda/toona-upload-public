import React from "react";
import "./Load.css";
import { getURL } from "../utility/aws";
import { useState, useEffect } from "react";
import QueueItem from "./QueueItem";
import LoadItem from "./LoadItem";
import { PanelObj } from "../App";
import { uploadYoutube } from "../utility/aws";

export interface LoadObject {
  fileName: string;
  type: string;
  url: string | undefined;
}

interface LoadProps {
  setVideos: (videos: string[]) => void;
  setSounds: (sound: string[]) => void;
  setVideoFileNames: (fileNames: string[]) => void;
  setAudioFileNames: (fileNames: string[]) => void;
  setPanels: (panels: PanelObj[]) => void;
  soundItems: string[];
  soundItemFileNames: string[];
  videoItems: string[];
  videoItemFileNames: string[];
}

const Load = ({
  setVideos,
  setSounds,
  setVideoFileNames,
  setAudioFileNames,
  setPanels,
  soundItems,
  soundItemFileNames,
  videoItems,
  videoItemFileNames,
}: LoadProps) => {
  // const [file, setFile] = useState<File>();
  const [files, setFiles] = useState<File[]>();
  const [loadObjects, setLoadObjects] = useState<LoadObject[]>([]);
  const [youtubeURL, setYoutubeURL] = useState<string>("");
  const [gettingYT, setGettingYT] = useState<boolean>(false);

  useEffect(() => {
    console.log("file: ", files);
  }, [files]);

  useEffect(() => {
    const videos = loadObjects.filter(
      (loadObject) => loadObject.type === "video/mp4"
    );
    const sounds = loadObjects.filter(
      (loadObject) =>
        loadObject.type === "audio/mpeg" || loadObject.type === "audio/mp3"
    );
    console.log("videos: ", videos);
    console.log("sounds: ", sounds);
    // only can load videos for now
    // setVideos(videos.map((loadObject) => loadObject.url!));
    setVideos([...videoItems, ...videos.map((loadObject) => loadObject.url!)]);
    // setSounds(sounds.map((loadObject) => loadObject.url!));
    setSounds([...soundItems, ...sounds.map((loadObject) => loadObject.url!)]);
    // setVideoFileNames(videos.map((loadObject) => loadObject.fileName));
    setVideoFileNames([
      ...videoItemFileNames,
      ...videos.map((loadObject) => loadObject.fileName),
    ]);
    // setAudioFileNames(sounds.map((loadObject) => loadObject.fileName));
    setAudioFileNames([
      ...soundItemFileNames,
      ...sounds.map((loadObject) => loadObject.fileName),
    ]);
    console.log("videos2: ", videos);
    console.log("sounds2: ", sounds);
  }, [loadObjects]);

  const handleFileChange = (e: React.BaseSyntheticEvent) => {
    // console.log("files: ", Array.from(e.target.files));
    if (files === undefined) {
      setFiles(Array.from(e.target.files));
      return;
    }
    const newFiles: any = [...files, ...Array.from(e.target.files)];
    setFiles(newFiles);
  };

  const handleLoad = async () => {
    let newLoadObjects: LoadObject[] = [];
    console.log("loading files ...");

    if (files === undefined) return;

    newLoadObjects = await Promise.all(
      files.map(async (file) => ({
        fileName: file.name,
        // url: file.name, // debugging, dont upload to aws
        url: await getURL(file), // Use await to get the resolved value of the promise
        type: file.type,
      }))
    );
    setLoadObjects([...loadObjects, ...newLoadObjects]);
    clearQueue();
    // Now newLoadObjects should be of type LoadObject[]
  };

  const handlePush = () => {
    if (loadObjects === undefined) return;
    const loadObjectsCopy = [...loadObjects];

    // Sort the loadObjectsCopy
    loadObjectsCopy.sort((a, b) => {
      const aSplit = a.fileName.split("_");
      const bSplit = b.fileName.split("_");
      const a0Index = parseInt(aSplit[0]);
      const b0Index = parseInt(bSplit[0]);
      const a1Index = parseInt(aSplit[1]);
      const b1Index = parseInt(bSplit[1]);

      if (a0Index === b0Index) return a1Index - b1Index;
      return a0Index - b0Index;
    });

    // Map loadObjectsCopy to newPanels
    const newPanels = loadObjectsCopy.map((loadObject) => ({
      video: loadObject.url!,
      sound: "",
      tran: "",
    }));

    // Update tran properties based on the change in the larger number
    newPanels.forEach((panel, index) => {
      if (index > 0) {
        const prevFileName = loadObjectsCopy[index - 1].fileName;
        const currentFileName = loadObjectsCopy[index].fileName;
        const prev0Index = parseInt(prevFileName.split("_")[0]);
        const current0Index = parseInt(currentFileName.split("_")[0]);

        if (prev0Index !== current0Index) {
          newPanels[index - 1].tran = "next_slide";
          newPanels[index].tran = "slide";
        }
      }
    });

    setPanels(newPanels);
  };

  const removeQueueItem = (index: number) => {
    if (files === undefined) return;
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
  };

  const removeLoadItem = (index: number) => {
    if (loadObjects === undefined) return;
    const newObjs = [...loadObjects];
    newObjs.splice(index, 1);
    setLoadObjects(newObjs);
  };

  const clearQueue = () => {
    setFiles([]);
  };

  return (
    <div className="load-container">
      <div className="queue">
        {files?.map((file, index) => (
          <QueueItem file={file} index={index} removeItem={removeQueueItem} />
        ))}
      </div>
      <div className="box">
        <input
          type="file"
          aria-label="file-input"
          multiple
          name="videos"
          accept="video/mp4, audio/mp3"
          onChange={handleFileChange}
          className="choose-files-button"
        />
        <button onClick={handleLoad} className="load-videos-button">
          Load Selected Files
        </button>
        <button onClick={handlePush} className="push-videos-button">
          Push in Order
        </button>
        <input
          type="text"
          aria-label="youtube-input"
          value={youtubeURL}
          onChange={(e) => {
            setYoutubeURL(e.target.value);
          }}
        />
        <button
          onClick={async () => {
            if (gettingYT) return;
            setGettingYT(true);
            const result = await uploadYoutube(youtubeURL);
            const newLoadObject: LoadObject = {
              fileName: result.name,
              url: result.url,
              type: "audio/mp3",
            };
            setLoadObjects([...loadObjects, newLoadObject]);
            setGettingYT(false);
          }}
        >
          Load YT
        </button>
        <div className="loaded-box">
          {loadObjects.map((loadObject, index) => (
            <LoadItem
              loadObject={loadObject}
              index={index}
              removeItem={removeLoadItem}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Load;

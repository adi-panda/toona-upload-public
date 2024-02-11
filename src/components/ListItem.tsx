import React, { RefObject, useMemo, useRef } from "react";
import "./ListItem.css";
import { useState, useEffect } from "react";
import { HandleListFuctions, PanelObj } from "../App";

function useOnScreen(ref: RefObject<HTMLElement>) {
  const [isIntersecting, setIntersecting] = useState(false);

  const observer = useMemo(
    () =>
      new IntersectionObserver(([entry]) =>
        setIntersecting(entry.isIntersecting)
      ),
    [ref]
  );

  useEffect(() => {
    if (!(ref.current instanceof HTMLElement)) return;
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return isIntersecting;
}

interface ListItemProps {
  videos: string[];
  videoFileNames: string[];
  audioFileNames: string[];
  sounds: string[];
  transitions: string[];
  index: number;
  vid: string;
  audio: string;
  tran: string;
  funcs: HandleListFuctions;
}

const ListItem = ({
  videos,
  videoFileNames,
  audioFileNames,
  sounds,
  transitions,
  index,
  vid,
  audio,
  tran,
  funcs,
}: ListItemProps) => {
  const [currVideo, setCurrVideo] = useState<string>(vid);
  const [currSound, setCurrSound] = useState<string>(audio);
  const [transition, setTransition] = useState<string>(tran);
  const [showIframe, setShowIframe] = useState(false); // State to track iframe visibility
  const [audioLoaded, setAudioLoaded] = useState(false); // State to track audio loaded
  const ref = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const isVisible = useOnScreen(ref);

  const handleToggleIframe = () => {
    setShowIframe(!showIframe); // Toggle the state
  };

  useEffect(() => {
    setCurrSound(audio);
    setCurrVideo(vid);
    setTransition(tran);
  }, [vid, audio, tran]);

  useEffect(() => {
    funcs.updatePanel(index, currVideo, currSound, transition);
  }, [currVideo, currSound, transition]);

  const handleSelectVideo = (event: any) => {
    setCurrVideo(event.target.value);
  };

  const handleSelectAudio = (event: any) => {
    setCurrSound(event.target.value);
    if (audioRef.current) {
      audioRef.current.load();
    }
  };

  const handleSelectTransition = (event: any) => {
    setTransition(event.target.value);
  };

  function formatURL(url: string) {
    const lastSlashIndex = url.lastIndexOf("/");

    if (lastSlashIndex !== -1) {
      // Found a forward slash, extract characters after it
      return url.slice(lastSlashIndex + 1);
    } else {
      // No forward slash found, return the entire url
      return url;
    }
  }

  const handleAdd = () => {
    funcs.addPanel(index);
    console.log("add: ", index);
  };

  const handleRemove = () => {
    funcs.removePanel(index);
    console.log("remove: ", index);
  };

  return (
    <div className="item-container" ref={ref}>
      <div className="card">
        <div className="index">{index}</div>
        <div className="item-box">
          <div className="video">
            <label htmlFor="dropdown">Video: </label>
            <select
              title="video-input"
              id={"video-dropdown" + index}
              value={currVideo}
              onChange={handleSelectVideo}
              className="dropdown"
            >
              <option value="">-- none --</option>
              {videos.map((option, index) => (
                <option key={index} value={option}>
                  {videoFileNames[index] + " - " + option}
                </option>
              ))}
            </select>
            <div className={"vid-name"}>
              <span className="vid-span">{formatURL(currVideo)}</span>
            </div>
          </div>
          {isVisible && (
            <iframe
              title="panel-video"
              width="270"
              height="350"
              src={currVideo}
              allowFullScreen
            ></iframe>
          )}

          <div className="sound">
            <label htmlFor="dropdown">Audio: </label>
            <select
              title="audio-input"
              id={"audio-dropdown" + index}
              value={currSound}
              onChange={handleSelectAudio}
              className="dropdown"
            >
              <option value="">-- none --</option>
              {sounds.map((option, index) => (
                <option key={index} value={option}>
                  {audioFileNames[index] + " - " + option}
                </option>
              ))}
            </select>
            <button
              onClick={() => {
                funcs.fillSounds(index);
              }}
            >
              Fill
            </button>
            {currSound != "" && (
              <div className={"vid-name"}>
                <span className="audio-span">{formatURL(currSound)}</span>
              </div>
            )}
          </div>
          <audio controls ref={audioRef}>
            <source src={currSound} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>

          <div className="transition">
            <div>
              <label htmlFor="dropdown">Transition: </label>
              <select
                id="dropdown"
                value={transition}
                onChange={handleSelectTransition}
                className="dropdown"
              >
                <option value="">-- none --</option>
                {transitions.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <span>{transition === "-- none --" ? "" : transition}</span>
          </div>
        </div>
        <div className="delete">
          <button className="delete-button" onClick={handleRemove}>
            X
          </button>
        </div>
      </div>

      <button className="add" onClick={handleAdd}>
        +
      </button>
    </div>
  );
};

export default ListItem;

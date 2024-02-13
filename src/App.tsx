import React from "react";
import "./App.css";
import Load from "./components/Load";
import Arrange from "./components/Arrange";
import { useState, useEffect } from "react";
import { SignIn, useUser } from "@clerk/clerk-react";
import {
  SignInButton,
  SignOutButton,
  SignedIn,
  SignedOut,
} from "@clerk/clerk-react";

export interface HandleListFuctions {
  addPanel: (index: number) => void;
  removePanel: (index: number) => void;
  updatePanel: (
    index: number,
    video: string,
    sound: string,
    tran: string
  ) => void;
  resetPanels: () => void;
  setPanels: (panels: PanelObj[]) => void;
  fillSounds: (index: number) => void;
}

export interface PanelObj {
  video: string;
  sound: string;
  tran: string;
}

function App() {
  // "https://d1ugggz6h4f19m.cloudfront.net/2_1.mp4",
  // "https://d1ugggz6h4f19m.cloudfront.net/2_2_1.mp4",
  // "https://d1ugggz6h4f19m.cloudfront.net/2_3_1.mp4",
  // "https://d1ugggz6h4f19m.cloudfront.net/2_4_2.mp4",
  // "https://d1ugggz6h4f19m.cloudfront.net/2_5_1.mp4",
  // "https://d1ugggz6h4f19m.cloudfront.net/2_6_1.mp4",
  // const [labelMap, setLabelMap] = useState<Map<string, string>>(new Map());
  const [videos, setVideos] = useState<string[]>([]);
  const [videoFileNames, setVideoFileNames] = useState<string[]>([]);
  const [audioFileNames, setAudioFileNames] = useState<string[]>([]);
  const [sounds, setSounds] = useState<string[]>([]);
  const [transitions, setTransitions] = useState<string[]>([
    "next_slide",
    "slide",
  ]);
  const { isSignedIn, user, isLoaded } = useUser();
  const user_id = user?.id;

  const [panels, setPanels] = useState<PanelObj[]>([
    { video: "", sound: "", tran: "" },
  ]);

  useEffect(() => {
    console.log("panels: ", panels);
    console.log(process.env.REACT_APP_API_KEY);
  }, [panels]);

  const updatePanel = (
    index: number,
    video: string,
    sound: string,
    tran: string
  ) => {
    const newPanels = [...panels];
    newPanels[index] = { video, sound, tran };
    setPanels(newPanels);
  };

  const fillSounds = (index) => {
    let lastAudio = "";
    let lastAudioIndex = 0;
    for (let i = 0; i < panels.length; i++) {
      if (panels[i].sound !== "") {
        lastAudio = panels[i].sound;
        lastAudioIndex = i;
      }
      if (i === index) {
        break;
      }
    }
    const newPanels = [...panels];
    for (let i = lastAudioIndex; i <= index; i++) {
      if (panels[i].sound === "") {
        console.log("filling sound: ", i, lastAudio);
        const newPanel = {
          video: panels[i].video,
          sound: lastAudio,
          tran: panels[i].tran,
        };
        newPanels[i] = newPanel;
      }
    }
    setPanels(newPanels);
  };

  const addPanel = (index: number) => {
    const newPanels = [...panels];
    newPanels.splice(index + 1, 0, { video: "", sound: "", tran: "" });
    setPanels(newPanels);
  };

  const removePanel = (index: number) => {
    const newPanels = [...panels];
    newPanels.splice(index, 1);
    setPanels(newPanels);
  };

  const resetPanels = () => {
    setPanels([{ video: "", sound: "", tran: "" }]);
  };

  return (
    <div className="screen">
      <SignedOut>
        <SignIn />
      </SignedOut>
      <SignedIn>
        <div>Hello {user?.id}!</div>
        <Arrange
          videos={videos}
          videoFileNames={videoFileNames}
          audioFileNames={audioFileNames}
          setAudioFileNames={setAudioFileNames}
          sounds={sounds}
          setSounds={setSounds}
          transitions={transitions}
          currentUserId={user_id ? user_id : ""}
          panels={panels}
          funcs={{
            addPanel,
            removePanel,
            updatePanel,
            resetPanels,
            setPanels,
            fillSounds,
          }}
        />
        <Load
          setVideos={setVideos}
          setSounds={setSounds}
          setVideoFileNames={setVideoFileNames}
          setAudioFileNames={setAudioFileNames}
          soundItems={sounds}
          soundItemFileNames={audioFileNames}
          videoItems={videos}
          videoItemFileNames={videoFileNames}
          setPanels={setPanels}
        />
      </SignedIn>
    </div>
  );
}
export default App;

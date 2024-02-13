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
}

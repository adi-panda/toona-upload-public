import React from "react";
import "./QueueItem.css";

interface QueueItemProps {
  file: File;
  index: number;
  removeItem: (index: number) => void;
}

const QueueItem = ({ file, index, removeItem }: QueueItemProps) => {
  const handleRemoveItem = () => {
    removeItem(index);
  };

  return (
    <div className="item-cont">
      <div className="queue-item">{file.name}</div>
      <button className="remove-item" onClick={handleRemoveItem}>
        X
      </button>
    </div>
  );
};

export default QueueItem;

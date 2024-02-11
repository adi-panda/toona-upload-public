import React from "react";
import "./LoadItem.css";
import { LoadObject } from "./Load";

interface LoadItemProps {
  loadObject: LoadObject;
  index: number;
  removeItem: (index: number) => void;
}

const LoadItem = ({ loadObject, index, removeItem }: LoadItemProps) => {
  const handleRemoveItem = () => {
    removeItem(index);
  };

  return (
    <div className="loaded-wrapper">
      <div className="loaded-item">
        {loadObject.fileName +
          " : " +
          (loadObject.url === undefined ? "ERROR" : loadObject.url)}
      </div>
      <button className="remove-loaded-item" onClick={handleRemoveItem}>
        X
      </button>
    </div>
  );
};

export default LoadItem;

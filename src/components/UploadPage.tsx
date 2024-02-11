import React from "react";
import "./UploadPage.css";
import { PanelObj } from "../App";
import { db } from "../utility/config";
import {
  addComicToFirestore,
  makePasskey,
  initComicRecord,
  updateComicRecord,
  updateSoundsDB,
} from "../utility/upload";
import { useState, useEffect } from "react";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const notify = (error: boolean) => {
  if (error) {
    toast.error("Upload Failed", {
      position: "top-left",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  } else {
    toast.success("Upload Success!", {
      position: "top-left",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  }
};

interface UploadPageProps {
  shown: boolean;
  panels: PanelObj[];
  setShown: (shown: boolean) => void;
  sounds: string[];
  audioFileNames: string[];
}

export const UploadPage = ({
  shown,
  panels,
  setShown,
  sounds,
  audioFileNames,
}: UploadPageProps) => {
  const [classView, setClassView] = useState<string>(
    shown ? "upload-page-shown" : "upload-page-hidden"
  );

  const [updateRecord, setUpdateRecord] = useState<boolean>(false);

  useEffect(() => {
    setClassView(shown ? "upload-page-shown" : "upload-page-hidden");
  }, [shown]);

  const handleHide = () => {
    setShown(false);
  };

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageSource: "",
    dbTitle: "",
    chapter: "",
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleResetForm = () => {
    setFormData({
      title: "",
      description: "",
      imageSource: "",
      dbTitle: "",
      chapter: "",
    });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    // Do something with the form data (e.g., send it to a server)
    console.log(formData);
    const key = makePasskey(10);
    updateSoundsDB(db, formData.dbTitle, sounds, audioFileNames);
    if (!updateRecord) {
      // initialize new comic document
      initComicRecord(
        db,
        formData.dbTitle,
        key,
        formData.description,
        formData.imageSource,
        formData.title,
        notify
      );
    } 
    addComicToFirestore(
      db,
      formData.dbTitle,
      formData.chapter,
      panels,
      key,
      updateRecord
    );
    updateComicRecord(db, formData.dbTitle, formData.chapter);
  };

  const handleCheckBoxChange = (e: any) => {
    setFormData({
      title: "",
      description: "",
      imageSource: "",
      dbTitle: "",
      chapter: "",
    });
    setUpdateRecord(!updateRecord);
  };

  const FormUpdate = (
    <form onSubmit={handleSubmit} className="form">
      <label>
        Chapter Number:
        <input
          type="text"
          name="chapter"
          value={formData.chapter}
          onChange={handleChange}
        />
      </label>
      <br />
      <label>
        Database Title:
        <input
          type="text"
          name="dbTitle"
          value={formData.dbTitle}
          onChange={handleChange}
        />
      </label>
      <br />
      <button type="submit">Submit</button>
    </form>
  );

  const FormNew = (
    <form onSubmit={handleSubmit} className="form">
      <label>
        Title:
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
        />
      </label>
      <br />
      <label>
        Chapter Number:
        <input
          type="text"
          name="chapter"
          value={formData.chapter}
          onChange={handleChange}
        />
      </label>
      <br />
      <label>
        Database Title:
        <input
          type="text"
          name="dbTitle"
          value={formData.dbTitle}
          onChange={handleChange}
        />
      </label>
      <br />
      <label>
        Description:
        <input
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
        />
      </label>
      <br />
      <label>
        Thumbnail Source:
        <input
          type="text"
          name="imageSource"
          value={formData.imageSource}
          onChange={handleChange}
        />
      </label>
      <br />
      <button type="submit">Submit</button>
    </form>
  );

  return (
    <div className={classView}>
      <div className="page-buttons">
        <button className="hide-page" onClick={handleHide}>
          X
        </button>
        <button className="reset-form" onClick={handleResetForm}>
          Reset Form
        </button>
        <label className="update-record-text">
          Update existing comic record
          <input type="checkbox" onChange={handleCheckBoxChange} />
        </label>
      </div>

      <div>{updateRecord ? FormUpdate : FormNew}</div>
      <ToastContainer />
    </div>
  );
};

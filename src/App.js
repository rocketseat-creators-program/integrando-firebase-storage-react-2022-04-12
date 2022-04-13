import logo from "./logo.svg";
import "./App.css";
import { useState } from "react";
import * as FIrebaseController from "./components/firebaseController";

function App() {
  const [progress, setProgress] = useState(0);
  const [startUplaod, setStartUpload] = useState(false);
  const [file, setFile] = useState(null);
  const [pathFolderOnStorage, setPathFolderOnStorage] = useState("");
  const [filename, setFilename] = useState("");
  const [urlFile, setUrlFile] = useState("");

  function OnButtonUploadSimpleClicked() {
    if (file) {
      setStartUpload(true);
      FIrebaseController.uploadFile("simple/", file, (error, url) => {
        if (error) {
          console.error(error);
          return;
        }

        console.log("URL FILE: ", url);
      });
    }
  }

  function OnButtonUploadProgressClicked() {
    if (file) {
      setStartUpload(true);
      FIrebaseController.uploadFileWithProgress(
        "withProgress/",
        file,
        (state, progress) => {
          console.log(state, progress);
        },
        (error) => {
          console.error(error);
        },
        (url) => {
          console.log("Upload complete", url);
        }
      );
    }
  }

  async function OnButtonDownloadUrlClicked() {
    const URL = await FIrebaseController.getFileUrl(pathFolderOnStorage, filename)
    setUrlFile(URL)
  }

  async function OnButtonDownloadFileClicked() {
    await FIrebaseController.downloadFile(pathFolderOnStorage, filename)
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h3>Upload area</h3>
        <div>
          <input
            type="file"
            placeholder="choose a file"
            onChange={(event) => setFile(event.target.files[0])}
          />
          <br />
          <button onClick={OnButtonUploadSimpleClicked}>Upload - simple</button>
          <br />
          <button onClick={OnButtonUploadProgressClicked}>
            Upload - progress
          </button>
        </div>
        <h3>Download area</h3>
        <div>
          <span>pathFolderOnStorage:</span>
          <input
            type="text"
            placeholder="folder/sub-folder/"
            onChange={(event) => setPathFolderOnStorage(event.target.value)}
          />
          <br />
          <span>Filename:</span>
          <input
            type="text"
            placeholder="filename.extesion"
            onChange={(event) => setFilename(event.target.value)}
          />
          <br />
          <button onClick={OnButtonDownloadUrlClicked}>Download - url</button>
          <br />
          <button onClick={OnButtonDownloadFileClicked}>Download - file</button>
        </div>
        {urlFile && <div>{urlFile}</div>}
      </header>
    </div>
  );
}

export default App;

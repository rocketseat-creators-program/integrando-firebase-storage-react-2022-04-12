import * as FirebaseApp from "firebase/app";
import * as FirebaseStorage from "firebase/storage";

const FIREBASE_CONFIG = {
  apiKey: process.env.REACT_APP_apiKey,
  authDomain: process.env.REACT_APP_authDomain,
  projectId: process.env.REACT_APP_projectId,
  storageBucket: process.env.REACT_APP_storageBucket,
  messagingSenderId: process.env.REACT_APP_messagingSenderId,
  appId: process.env.REACT_APP_appId,
};

FirebaseApp.initializeApp(FIREBASE_CONFIG);
const STORAGE = FirebaseStorage.getStorage();

//#region Upload Methods

export function uploadFile(pathFolderOnStorage, file, callback) {
  const FILE_REF = FirebaseStorage.ref(
    STORAGE,
    `${pathFolderOnStorage}${file.name}`
  );

  FirebaseStorage.uploadBytes(FILE_REF, file)
    .then((uploadResult) => {
      callback(null, uploadResult.ref);
    })
    .catch((error) => {
      callback(error, null);
    });
}

export function uploadFileWithProgress(
  pathFolderOnStorage,
  file,
  callbackProgress,
  callbackError,
  callbackSuccess
) {
  const FILE_REF = FirebaseStorage.ref(
    STORAGE,
    `${pathFolderOnStorage}${file.name}`
  );

  const UPLOAD_TASK = FirebaseStorage.uploadBytesResumable(FILE_REF, file);

  UPLOAD_TASK.on(
    "state_changed",
    (snapshot) => {
      const PROGRESS = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      callbackProgress(snapshot.state, Math.round(PROGRESS));
    },
    (error) => {
      callbackError(error);
    },
    async () => {
      const FILE_URL = await FirebaseStorage.getDownloadURL(
        UPLOAD_TASK.snapshot.ref
      );
      callbackSuccess(FILE_URL);
    }
  );
}

//#endregion

//#region Download Methods

export async function getFileUrl(pathFolderOnStorage, filename) {
  const FILE_REF = FirebaseStorage.ref(
    STORAGE,
    `${pathFolderOnStorage}${filename}`
  );

  const URL = await FirebaseStorage.getDownloadURL(FILE_REF);
  return URL;
}

export async function downloadFile(pathFolderOnStorage, filename) {
  const FILE_REF = FirebaseStorage.ref(
    STORAGE,
    `${pathFolderOnStorage}${filename}`
  );
  const URL = await FirebaseStorage.getDownloadURL(FILE_REF);

  const A = document.createElement("a")
  A.href = URL
  A.target = "_blank"
  A.click()
  A.remove()
}

//#endregion

import { Howl } from "howler";
import React, { useEffect, useRef, useState } from "react";
import "./assets/grid.css";
import "./assets/App.css";
import soundURL from "./assets/sound2.mp3";
import Control from "./components/Control";
import Header from "./components/Header";
import Video from "./components/Video";
import Footer from "./components/Footer";

const mobilenet = require("@tensorflow-models/mobilenet");
const knnClassifier = require("@tensorflow-models/knn-classifier");

let sound = new Howl({
  src: [soundURL],
});

// sound.play();
function App() {
  const video = useRef();
  const classifier = useRef();
  const canPlaySound = useRef(true);
  const mobilenetModule = useRef();
  const [mask, setMask] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);

  const init = async () => {
    //Khoi tao camera
    console.log("init camera...");
    await setUpCamera();
    //Nhan dien khuon mat

    classifier.current = knnClassifier.create();
    mobilenetModule.current = await mobilenet.load();

    console.log(">>> check setup !");
    setIsSuccess(true);
  };

  const setUpCamera = () => {
    return new Promise((resolve, reject) => {
      navigator.getUserMedia =
        navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia;
      if (navigator.getUserMedia) {
        navigator.getUserMedia(
          { video: true },
          (stream) => {
            video.current.srcObject = stream;
            video.current.addEventListener("loadeddata", resolve);
          },
          (error) => reject(error)
        );
      } else {
        reject();
      }
    });
  };

  useEffect(() => {
    init();
    sound.on("end", function () {
      canPlaySound.current = true;
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={`main ${mask ? "" : "not-mask"}`}>
      <Header />
      {!isSuccess ? (
        <h1 className="state ">"init camera..."</h1>
      ) : (
        <Control
          mobilenet={mobilenetModule}
          classifier={classifier}
          setMask={setMask}
          audio={sound}
          canPlaySound={canPlaySound}
          video={video}
        />
      )}
      <Video video={video} />
      <Footer />
    </div>
  );
}

export default App;

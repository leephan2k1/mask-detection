import * as tf from "@tensorflow/tfjs";
import { initNotifications, notify } from "@mycv/f8-notification";
import { useState, useEffect } from "react";
const blazeface = require("@tensorflow-models/blazeface");
const NOT_MASK_LABEL = "Not_mask";
const MASKED_LABEL = "masked";
const TRAINING_TIMES = 100;
const MASKED_CONFIDENCES = 0.8;

export default function Control(props) {
  const [message, setMessage] = useState("");
  const [stateProgress, setStateProgress] = useState(false);
  const [activeSwitch, setActiveSwitch] = useState(0);
  initNotifications({ cooldown: 3000 });
  const training = (label) => {
    return new Promise(async (resolve) => {
      const embedding = props.mobilenet.current.infer(
        props.video.current,
        true
      );
      props.classifier.current.addExample(embedding, label);
      await sleep(100);
      resolve();
    });
  };
  const run = async () => {
    const embedding = props.mobilenet.current.infer(props.video.current, true);
    const result = await props.classifier.current.predictClass(embedding);

    // Check khuôn mặt.
    const model = await blazeface.load();
    const predictions = await model.estimateFaces(
      document.querySelector(".video"),
      false
    );
    setMessage("Hệ thống đang chạy");
    setStateProgress(true);
    if (
      result.label === MASKED_LABEL &&
      result.confidences[result.label] > MASKED_CONFIDENCES
    ) {
      console.log("MASKED");
      console.log("FACE", predictions);
      props.setMask(true);
    } else {
      if (predictions.length > 0) {
        console.log("NOT MASK");
        console.log("FACE", predictions);
        props.setMask(false);
        notify("Đeo khẩu trang vô bạn ey!", { body: "Khẩu trang đâu hả??" });
        if (props.canPlaySound.current) {
          props.canPlaySound.current = false;
          props.audio.play();
        }
      }
    }

    await sleep(200);
    run();
  };
  const train = async (label) => {
    console.log(`${label} Đang training cho máy học cái bản mặt của bạn!...`);
    setStateProgress(true);
    for (let i = 0; i < TRAINING_TIMES; i++) {
      console.log(
        `progress: ` + Math.floor(((i + 1) / TRAINING_TIMES) * 100) + "%"
      );
      setMessage(
        `progress:   ${Math.floor(((i + 1) / TRAINING_TIMES) * 100)} %`
      );
      await training(label);
    }
    setActiveSwitch(activeSwitch + 1);
    setStateProgress(false);
  };
  const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };
  useEffect(() => {
    switch (activeSwitch) {
      case 0:
        setMessage(` Ở bước này, cho máy quét khuôn mặt tự nhiên trong 5s. 5s sau đó làm
        giả hành động như có đeo khẩu trang, (Không đeo thật !)`);
        break;
      case 1:
        setMessage(
          `Ở bước này, cho máy quét khuôn mặt có đeo khẩu trang trong 10s`
        );
        break;
      case 2:
        setMessage(`Hệ thống sẽ bắt đầu theo dõi`);
        break;
    }
  }, [activeSwitch]);
  return (
    <div className="control">
      {activeSwitch === 0 ? (
        <div className="step">
          {!stateProgress ? (
            <button className="btn" onClick={() => train(NOT_MASK_LABEL)}>
              Bắt đầu bước 1
            </button>
          ) : null}
          <div className="step-message">{message}</div>
        </div>
      ) : null}
      {activeSwitch === 1 ? (
        <div className="step">
          {!stateProgress ? (
            <button className="btn" onClick={() => train(MASKED_LABEL)}>
              Bắt đầu bước 2
            </button>
          ) : null}
          <div className="step-message">{message}</div>
        </div>
      ) : null}
      {activeSwitch === 2 ? (
        <div className="step">
          {!stateProgress ? (
            <button className="btn" onClick={() => run()}>
              Chạy
            </button>
          ) : null}
          <div className="step-message">{message}</div>
        </div>
      ) : null}
    </div>
  );
}

import React from "react";

export default function Footer() {
  return (
    <footer className="footer">
      <h1 className="footer-title">Nhóm 04 - Học phần CT190</h1>
      <div className="grid wide">
        <div className="row">
          <div className="col l-3 m-6 c-12">
            <img className="author" src="./images/lee.jpg" alt="lee" />
            <p>Triết Lý</p>
            <p className="author-desc">Dev, Slide content</p>
          </div>

          <div className="col l-3 m-6 c-12">
            <img className="author" src="./images/ngan.jpg" alt="ngan" />
            <p>Thiện Ngân</p>
            <p className="author-desc">Voice actor, Present</p>
          </div>
          <div className="col l-3 m-6 c-12">
            <img className="author" src="./images/Khiem.jpg" alt="khiem" />
            <p>Trọng Khiêm</p>
            <p className="author-desc">Slide design</p>
          </div>
          <div className="col l-3 m-6 c-12">
            <img className="author" src="./images/Nhan.jpg" alt="Nhan" />
            <p>Trọng Nhân</p>
            <p className="author-desc">Slide content / design</p>
          </div>
        </div>
      </div>
      <div className="tech-desc">
        Tech: ReactJS, Tensorflow (mobilenet, knnClassifier, Blazeface
        detector), NodeJS(Howl, notification-F8)
      </div>
    </footer>
  );
}

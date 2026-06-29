import { useCallback, useState } from "react";
import { CameraFrameSequence } from "./CameraFrameSequence";

export function WebDevelopmentSection() {
  const [isReady, setIsReady] = useState(false);
  const handleReady = useCallback(() => setIsReady(true), []);

  return (
    <div className={`web-section ${isReady ? "is-ready" : ""}`}>
      <div className="web-section__visual">
        <CameraFrameSequence
          frameRoot="/web-frames"
          framePrefix="ezgif-frame-"
          frameCount={120}
          criticalFrames={18}
          scrollTargetSelector="#web-development"
          onReady={handleReady}
        />
      </div>
      <div className="web-section__overlay">
        <div className="web-section__content">
          <span className="web-section__label">Service</span>
          <h2 className="web-section__title">Web Development</h2>
          <p className="web-section__desc">
            Custom websites and web applications built with modern frameworks,
            optimized for performance and conversion. Code that ships fast and
            scales further.
          </p>
          <div className="web-section__details">
            <div className="web-section__detail">
              <span className="web-section__detail-value">Frontend</span>
              <span className="web-section__detail-label">Architecture</span>
            </div>
            <div className="web-section__detail">
              <span className="web-section__detail-value">Backend</span>
              <span className="web-section__detail-label">Systems</span>
            </div>
            <div className="web-section__detail">
              <span className="web-section__detail-value">Performance</span>
              <span className="web-section__detail-label">Optimization</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
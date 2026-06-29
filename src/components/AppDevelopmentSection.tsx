import { useCallback, useState } from "react";
import { CameraFrameSequence } from "./CameraFrameSequence";

export function AppDevelopmentSection() {
  const [isReady, setIsReady] = useState(false);
  const handleReady = useCallback(() => setIsReady(true), []);

  return (
    <div className={`app-section ${isReady ? "is-ready" : ""}`}>
      <div className="app-section__visual">
        <CameraFrameSequence
          frameRoot="/app-frames"
          framePrefix="ezgif-frame-"
          frameCount={120}
          criticalFrames={18}
          scrollTargetSelector="#app-development"
          onReady={handleReady}
        />
      </div>
      <div className="app-section__overlay">
        <div className="app-section__content">
          <span className="app-section__label">Service</span>
          <h2 className="app-section__title">App Development</h2>
          <p className="app-section__desc">
            Native and cross-platform mobile applications designed to deliver
            seamless user experiences at scale. From prototype to launch and
            beyond.
          </p>
          <div className="app-section__details">
            <div className="app-section__detail">
              <span className="app-section__detail-value">iOS & Android</span>
              <span className="app-section__detail-label">Native Apps</span>
            </div>
            <div className="app-section__detail">
              <span className="app-section__detail-value">Cross-Platform</span>
              <span className="app-section__detail-label">Development</span>
            </div>
            <div className="app-section__detail">
              <span className="app-section__detail-value">UI/UX</span>
              <span className="app-section__detail-label">Design</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
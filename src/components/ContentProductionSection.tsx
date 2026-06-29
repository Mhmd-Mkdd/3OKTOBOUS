import { useCallback, useState } from "react";
import { CameraFrameSequence } from "./CameraFrameSequence";

export function ContentProductionSection() {
  const [isReady, setIsReady] = useState(false);
  const handleReady = useCallback(() => setIsReady(true), []);

  return (
    <div className={`content-section ${isReady ? "is-ready" : ""}`}>
      <div className="content-section__visual">
        <CameraFrameSequence
          frameRoot="/content-frames"
          filePrefix="frame_"
          extension="jpg"
          padLength={4}
          frameCount={150}
          criticalFrames={18}
          scrollTargetSelector="#content-production"
          scrollStartOffsetVh={-0.12}
          scrollDistanceMultiplier={0.68}
          bgColor="#0a0f1a"
          onReady={handleReady}
        />
      </div>
      <div className="content-section__overlay">
        <div className="content-section__content">
          <span className="content-section__label">Service</span>
          <h2 className="content-section__title">Content Production</h2>
          <p className="content-section__desc">
            End-to-end content strategy and production tailored for digital
            platforms, from concept to final delivery. We turn ideas into
            stories that resonate.
          </p>
          <div className="content-section__details">
            <div className="content-section__detail">
              <span className="content-section__detail-value">Strategy</span>
              <span className="content-section__detail-label">Planning</span>
            </div>
            <div className="content-section__detail">
              <span className="content-section__detail-value">Production</span>
              <span className="content-section__detail-label">Execution</span>
            </div>
            <div className="content-section__detail">
              <span className="content-section__detail-value">Distribution</span>
              <span className="content-section__detail-label">Optimization</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

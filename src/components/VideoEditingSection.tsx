import { useCallback, useState } from "react";
import { CameraFrameSequence } from "./CameraFrameSequence";

export function VideoEditingSection() {
  const [isReady, setIsReady] = useState(false);
  const handleReady = useCallback(() => setIsReady(true), []);

  return (
    <div className={`video-section ${isReady ? "is-ready" : ""}`}>
      <div className="video-section__visual">
        <CameraFrameSequence
          frameRoot="/video-frames"
          filePrefix="frame_"
          extension="jpg"
          padLength={4}
          frameCount={150}
          criticalFrames={18}
          scrollTargetSelector="#video-editing"
          scrollStartOffsetVh={-0.12}
          scrollDistanceMultiplier={0.68}
          bgColor="#020006"
          onReady={handleReady}
        />
      </div>
      <div className="video-section__overlay">
        <div className="video-section__content">
          <span className="video-section__label">Service</span>
          <h2 className="video-section__title">Video Editing</h2>
          <p className="video-section__desc">
            Professional post-production, color grading, motion graphics, and
            sound design for content that demands attention. We sculpt time and
            emotion into every cut.
          </p>
          <div className="video-section__details">
            <div className="video-section__detail">
              <span className="video-section__detail-value">Color</span>
              <span className="video-section__detail-label">Grading</span>
            </div>
            <div className="video-section__detail">
              <span className="video-section__detail-value">Motion</span>
              <span className="video-section__detail-label">Graphics</span>
            </div>
            <div className="video-section__detail">
              <span className="video-section__detail-value">Sound</span>
              <span className="video-section__detail-label">Design</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

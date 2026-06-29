import { useCallback, useState } from "react";
import { CameraFrameSequence } from "./CameraFrameSequence";

export function DigitalMarketingSection() {
  const [isReady, setIsReady] = useState(false);
  const handleReady = useCallback(() => setIsReady(true), []);

  return (
    <div className={`marketing-section ${isReady ? "is-ready" : ""}`}>
      <div className="marketing-section__visual">
        <CameraFrameSequence
          frameRoot="/marketing-frames"
          framePrefix="ezgif-frame-"
          frameCount={120}
          criticalFrames={18}
          scrollTargetSelector="#digital-marketing"
          onReady={handleReady}
        />
      </div>
      <div className="marketing-section__overlay">
        <div className="marketing-section__content">
          <span className="marketing-section__label">Service</span>
          <h2 className="marketing-section__title">Digital Marketing</h2>
          <p className="marketing-section__desc">
            Data-driven campaigns that amplify your reach across social, search,
            and display networks with measurable results. Growth engineered with
            precision.
          </p>
          <div className="marketing-section__details">
            <div className="marketing-section__detail">
              <span className="marketing-section__detail-value">Social</span>
              <span className="marketing-section__detail-label">Campaigns</span>
            </div>
            <div className="marketing-section__detail">
              <span className="marketing-section__detail-value">SEO & SEM</span>
              <span className="marketing-section__detail-label">Optimization</span>
            </div>
            <div className="marketing-section__detail">
              <span className="marketing-section__detail-value">Analytics</span>
              <span className="marketing-section__detail-label">Reporting</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
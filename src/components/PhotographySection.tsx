import { useCallback, useState } from "react";
import { CameraFrameSequence } from "./CameraFrameSequence";

export function PhotographySection() {
  const [isReady, setIsReady] = useState(false);
  const handleReady = useCallback(() => setIsReady(true), []);

  return (
    <div className={`photography-section ${isReady ? "is-ready" : ""}`}>
      <div className="photography-section__visual">
        <CameraFrameSequence
          frameRoot="/camera-frames"
          framePrefix="ezgif-frame-"
          frameCount={152}
          criticalFrames={18}
          scrollTargetSelector="#photography"
          onReady={handleReady}
        />
      </div>
      <div className="photography-section__overlay">
        <div className="photography-section__content">
          <span className="photography-section__label">Service</span>
          <h2 className="photography-section__title">Photography</h2>
          <p className="photography-section__desc">
            High-end commercial and editorial photography that captures the
            essence of your brand with cinematic precision. Every frame tells a
            story — from concept and lighting to composition and retouching.
          </p>
          <div className="photography-section__details">
            <div className="photography-section__detail">
              <span className="photography-section__detail-value">Commercial</span>
              <span className="photography-section__detail-label">Photography</span>
            </div>
            <div className="photography-section__detail">
              <span className="photography-section__detail-value">Editorial</span>
              <span className="photography-section__detail-label">Shoots</span>
            </div>
            <div className="photography-section__detail">
              <span className="photography-section__detail-value">Post</span>
              <span className="photography-section__detail-label">Production</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
import { useCallback, useEffect, useRef, useState } from "react";

type CameraFrameSequenceProps = {
  frameCount?: number;
  criticalFrames?: number;
  scrollTargetSelector?: string;
  frameRoot?: string;
  framePrefix?: string;
  filePrefix?: string;
  extension?: string;
  padLength?: number;
  bgColor?: string;
  scrollStartOffsetVh?: number;
  scrollDistanceMultiplier?: number;
  onReady?: () => void;
  onLoadProgress?: (loaded: number, total: number) => void;
};

const DEFAULT_FRAME_ROOT = "/camera-frames";
const DEFAULT_FILE_PREFIX = "ezgif-frame-";
const DEFAULT_EXTENSION = "jpg";
const DEFAULT_PAD_LENGTH = 3;

function framePath(
  root: string,
  prefix: string,
  index: number,
  padLength: number,
  ext: string,
) {
  return `${root}/${prefix}${String(index).padStart(padLength, "0")}.${ext}`;
}

function drawContain(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  canvasWidth: number,
  canvasHeight: number,
  bgColor: string,
) {
  const imageRatio = image.naturalWidth / image.naturalHeight;
  const canvasRatio = canvasWidth / canvasHeight;
  const drawWidth = canvasRatio > imageRatio ? canvasHeight * imageRatio : canvasWidth;
  const drawHeight = canvasRatio > imageRatio ? canvasHeight : canvasWidth / imageRatio;
  const x = (canvasWidth - drawWidth) / 2;
  const y = (canvasHeight - drawHeight) / 2;

  context.fillStyle = bgColor;
  context.fillRect(0, 0, canvasWidth, canvasHeight);
  context.drawImage(image, x, y, drawWidth, drawHeight);
}

function loadFrame(
  root: string,
  prefix: string,
  index: number,
  padLength: number,
  ext: string,
) {
  return new Promise<HTMLImageElement | null>((resolve) => {
    const image = new Image();
    image.decoding = "async";
    image.onload = () => resolve(image);
    image.onerror = () => resolve(null);
    image.src = framePath(root, prefix, index, padLength, ext);
  });
}

export function CameraFrameSequence({
  frameCount = 152,
  criticalFrames = 18,
  scrollTargetSelector = ".hero-shell",
  frameRoot = DEFAULT_FRAME_ROOT,
  framePrefix = DEFAULT_FILE_PREFIX,
  filePrefix = DEFAULT_FILE_PREFIX,
  extension = DEFAULT_EXTENSION,
  padLength = DEFAULT_PAD_LENGTH,
  bgColor = "#ffffff",
  scrollStartOffsetVh = 0.04,
  scrollDistanceMultiplier = 1,
  onReady,
  onLoadProgress,
}: CameraFrameSequenceProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const framesRef = useRef<Map<number, HTMLImageElement>>(new Map());
  const pendingFrameLoadsRef = useRef<Map<number, Promise<void>>>(new Map());
  const lastFrameRef = useRef<HTMLImageElement | null>(null);
  const scrollRafRef = useRef<number>();
  const readyRef = useRef(false);
  const mountedRef = useRef(true);
  const loadedCountRef = useRef(0);
  const targetFrameRef = useRef(1);
  const [styleOffset, setStyleOffset] = useState({ x: 0, y: 0 });

  // Resolve the actual prefix: prefer filePrefix if explicitly set, else fall back to framePrefix
  const resolvedPrefix = filePrefix !== DEFAULT_FILE_PREFIX ? filePrefix : framePrefix;

  const bgColorRef = useRef(bgColor);
  bgColorRef.current = bgColor;

  const drawFrame = useCallback((image: HTMLImageElement) => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d", {
      alpha: false,
      willReadFrequently: true,
    });
    if (!context) {
      return;
    }

    drawContain(context, image, canvas.width, canvas.height, bgColorRef.current);
  }, []);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) {
      return;
    }

    const rect = wrap.getBoundingClientRect();
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.max(1, Math.floor(rect.width * ratio));
    canvas.height = Math.max(1, Math.floor(rect.height * ratio));
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    if (lastFrameRef.current) {
      drawFrame(lastFrameRef.current);
    }
  }, [drawFrame]);

  const getNearestLoadedFrame = useCallback(
    (targetFrame: number) => {
      const exactFrame = framesRef.current.get(targetFrame);
      if (exactFrame) {
        return exactFrame;
      }

      for (let offset = 1; offset < frameCount; offset += 1) {
        const previousFrame = framesRef.current.get(targetFrame - offset);
        if (previousFrame) {
          return previousFrame;
        }

        const nextFrame = framesRef.current.get(targetFrame + offset);
        if (nextFrame) {
          return nextFrame;
        }
      }

      return null;
    },
    [frameCount],
  );

  const drawScrollFrame = useCallback(() => {
    const target = document.querySelector<HTMLElement>(scrollTargetSelector);
    const rect = target?.getBoundingClientRect();
    const vh = window.innerHeight;

    let progress = 0;
    if (rect) {
      const scrollRange = Math.max(1, rect.height * scrollDistanceMultiplier);
      const sectionStartOffset = vh * scrollStartOffsetVh;
      progress = Math.min(1, Math.max(0, (-rect.top - sectionStartOffset) / scrollRange));
    }
    const targetFrame = Math.min(frameCount, Math.max(1, Math.round(progress * (frameCount - 1)) + 1));
    const image = getNearestLoadedFrame(targetFrame);

    targetFrameRef.current = targetFrame;
    if (wrapRef.current) {
      wrapRef.current.dataset.currentFrame = String(targetFrame);
    }

    if (image && image !== lastFrameRef.current) {
      lastFrameRef.current = image;
      drawFrame(image);
    }

    if (!framesRef.current.has(targetFrame) && !pendingFrameLoadsRef.current.has(targetFrame)) {
      const pendingLoad = loadFrame(frameRoot, resolvedPrefix, targetFrame, padLength, extension)
        .then((loadedImage) => {
          if (!loadedImage || !mountedRef.current || framesRef.current.has(targetFrame)) {
            return;
          }

          framesRef.current.set(targetFrame, loadedImage);
          loadedCountRef.current += 1;
          onLoadProgress?.(loadedCountRef.current, frameCount);

          if (targetFrameRef.current === targetFrame) {
            lastFrameRef.current = loadedImage;
            drawFrame(loadedImage);
          }
        })
        .finally(() => {
          pendingFrameLoadsRef.current.delete(targetFrame);
        });

      pendingFrameLoadsRef.current.set(targetFrame, pendingLoad);
    }
  }, [drawFrame, extension, frameCount, frameRoot, getNearestLoadedFrame, onLoadProgress, padLength, resolvedPrefix, scrollDistanceMultiplier, scrollStartOffsetVh, scrollTargetSelector]);

  const requestScrollFrame = useCallback(() => {
    if (scrollRafRef.current) {
      return;
    }

    scrollRafRef.current = requestAnimationFrame(() => {
      scrollRafRef.current = undefined;
      drawScrollFrame();
    });
  }, [drawScrollFrame]);

  useEffect(() => {
    mountedRef.current = true;
    resizeCanvas();

    const resizeObserver = new ResizeObserver(() => {
      resizeCanvas();
      requestScrollFrame();
    });
    if (wrapRef.current) {
      resizeObserver.observe(wrapRef.current);
    }

    const trackScroll = () => {
      drawScrollFrame();

      if (mountedRef.current) {
        scrollRafRef.current = requestAnimationFrame(trackScroll);
      }
    };

    window.addEventListener("resize", requestScrollFrame);
    scrollRafRef.current = requestAnimationFrame(trackScroll);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", requestScrollFrame);
      mountedRef.current = false;
      if (scrollRafRef.current) {
        cancelAnimationFrame(scrollRafRef.current);
      }
    };
  }, [drawScrollFrame, requestScrollFrame, resizeCanvas]);

  useEffect(() => {
    let cancelled = false;

    const registerFrame = (index: number, image: HTMLImageElement | null) => {
      if (!image || cancelled || framesRef.current.has(index)) {
        return;
      }

      framesRef.current.set(index, image);
      loadedCountRef.current += 1;
      onLoadProgress?.(loadedCountRef.current, frameCount);

      if (index === targetFrameRef.current) {
        lastFrameRef.current = image;
        drawFrame(image);
      }
    };

    async function preload() {
      const criticalIndexes = Array.from({ length: criticalFrames }, (_, frame) => frame + 1);

      await Promise.all(
        criticalIndexes.map(async (index) => {
          const image = await loadFrame(frameRoot, resolvedPrefix, index, padLength, extension);
          registerFrame(index, image);
        }),
      );

      if (cancelled) {
        return;
      }

      const firstFrame = framesRef.current.get(1);
      if (firstFrame) {
        lastFrameRef.current = firstFrame;
        drawFrame(firstFrame);
      }

      requestScrollFrame();

      if (!readyRef.current) {
        readyRef.current = true;
        onReady?.();
      }

      const remaining = Array.from(
        { length: frameCount - criticalFrames },
        (_, frame) => frame + criticalFrames + 1,
      );

      for (let start = 0; start < remaining.length && !cancelled; start += 8) {
        const batch = remaining.slice(start, start + 8);
        await Promise.all(
          batch.map(async (index) => {
            const image = await loadFrame(frameRoot, resolvedPrefix, index, padLength, extension);
            registerFrame(index, image);
          }),
        );
      }
    }

    void preload().catch(() => {
      if (!readyRef.current) {
        readyRef.current = true;
        onReady?.();
      }
    });

    return () => {
      cancelled = true;
    };
  }, [criticalFrames, drawFrame, extension, frameCount, frameRoot, onLoadProgress, onReady, padLength, requestScrollFrame, resolvedPrefix]);

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      const rect = wrapRef.current?.getBoundingClientRect();
      if (!rect) {
        return;
      }

      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;

      setStyleOffset({
        x: x * 18,
        y: y * 14,
      });
    };

    window.addEventListener("pointermove", handlePointerMove);

    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, []);

  return (
    <div
      ref={wrapRef}
      className="camera-sequence"
      style={{
        "--camera-x": `${styleOffset.x}px`,
        "--camera-y": `${styleOffset.y}px`,
      } as React.CSSProperties}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="camera-sequence__canvas" />
    </div>
  );
}

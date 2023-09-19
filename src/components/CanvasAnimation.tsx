import { useRef, useEffect, forwardRef, useImperativeHandle } from "react";

interface CanvasAnimationProps {
  onDraw: () => void;
  onResize?: (width: number, height: number) => void;
}

export interface CanvasAnimationRef {
  canvas: HTMLCanvasElement | null;
}

const CanvasAnimation = forwardRef<CanvasAnimationRef, CanvasAnimationProps>(
  ({ onDraw, onResize }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Expose the canvas ref to the parent using this component
    useImperativeHandle(ref, () => ({
      canvas: canvasRef.current,
    }));

    useEffect(() => {
      let stop = false;
      let isInView = false;
      let animationRequestId: number | null = null;

      const canvasElement = canvasRef.current;
      if (!canvasElement) return;

      function loop() {
        if (stop || !isInView || !canvasElement) {
          return;
        }

        onDraw();
        animationRequestId = requestAnimationFrame(loop);
      }

      // Create a new intersection observer
      const interSectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          isInView = entry.isIntersecting;
          if (isInView && !animationRequestId) {
            loop();
          } else if (!isInView && animationRequestId) {
            cancelAnimationFrame(animationRequestId);
            animationRequestId = null;
          }
        });
      });

      interSectionObserver.observe(canvasElement);

      const resizeObserver = new ResizeObserver((elements) => {
        for (const element of elements) {
          const pixelRatio = window.devicePixelRatio;
          canvasElement.width = Math.floor(
            element.contentRect.width * pixelRatio
          );
          canvasElement.height = Math.floor(
            element.contentRect.height * pixelRatio
          );

          if (onResize) {
            onResize(canvasElement.width, canvasElement.height);
          }
        }
      });

      resizeObserver.observe(canvasElement);

      return () => {
        stop = true;
        if (animationRequestId) {
          cancelAnimationFrame(animationRequestId);
        }
        interSectionObserver.disconnect();
      };
    }, [onDraw, onResize]);

    return (
      <canvas
        ref={canvasRef}
        style={{ display: "block", width: "100%" }}
      ></canvas>
    );
  }
);

export default CanvasAnimation;

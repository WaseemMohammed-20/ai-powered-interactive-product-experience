import { useEffect, useRef } from "react";

const interactiveSelector =
  "a, button, input, textarea, .feature-card";

export default function PremiumInteractions() {
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorRingRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const motionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );
    const pointerQuery = window.matchMedia(
      "(pointer: fine)"
    );

    if (!pointerQuery.matches || motionQuery.matches) {
      return;
    }

    let animationFrame = 0;
    let pointerX = -100;
    let pointerY = -100;
    let currentX = pointerX;
    let currentY = pointerY;

    const renderPointer = () => {
      currentX += (pointerX - currentX) * 0.2;
      currentY += (pointerY - currentY) * 0.2;

      if (cursorDotRef.current) {
        cursorDotRef.current.style.transform =
          `translate3d(${pointerX}px, ${pointerY}px, 0)`;
      }

      if (cursorRingRef.current) {
        cursorRingRef.current.style.transform =
          `translate3d(${currentX}px, ${currentY}px, 0)`;
      }

      animationFrame = window.requestAnimationFrame(renderPointer);
    };

    const handlePointerMove = (event: PointerEvent) => {
      pointerX = event.clientX;
      pointerY = event.clientY;

      const target = (event.target as HTMLElement).closest<HTMLElement>(
        interactiveSelector
      );
      cursorRingRef.current?.classList.toggle(
        "is-hovering",
        Boolean(target)
      );

      const magneticTarget = (event.target as HTMLElement).closest<HTMLElement>(
        ".magnetic"
      );

      if (magneticTarget) {
        const bounds = magneticTarget.getBoundingClientRect();
        const offsetX = (event.clientX - (bounds.left + bounds.width / 2)) * 0.12;
        const offsetY = (event.clientY - (bounds.top + bounds.height / 2)) * 0.12;
        magneticTarget.style.setProperty("--magnetic-x", `${offsetX}px`);
        magneticTarget.style.setProperty("--magnetic-y", `${offsetY}px`);
      }
    };

    const handlePointerLeave = (event: PointerEvent) => {
      const magneticTarget = (event.target as HTMLElement).closest<HTMLElement>(
        ".magnetic"
      );
      magneticTarget?.style.removeProperty("--magnetic-x");
      magneticTarget?.style.removeProperty("--magnetic-y");
      cursorRingRef.current?.classList.remove("is-hovering");
    };

    const updateProgress = () => {
      const documentHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = documentHeight > 0
        ? (window.scrollY / documentHeight) * 100
        : 0;

      if (progressRef.current) {
        progressRef.current.style.width = `${progress}%`;
      }
    };

    document.addEventListener("pointermove", handlePointerMove);
    document.addEventListener("pointerout", handlePointerLeave);
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    updateProgress();
    animationFrame = window.requestAnimationFrame(renderPointer);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      document.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerout", handlePointerLeave);
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, []);

  return (
    <>
      <div className="premium-cursor-dot" ref={cursorDotRef} />
      <div className="premium-cursor-ring" ref={cursorRingRef} />
      <div className="scroll-progress" ref={progressRef} />
    </>
  );
}

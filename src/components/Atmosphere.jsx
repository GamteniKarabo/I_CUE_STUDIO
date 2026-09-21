import { useRef } from "react";
import { gsap, useGSAP, prefersReduced, isTouch } from "../lib/gsap";

/**
 * Atmosphere layer: custom cursor with magnetic lag, film grain,
 * vignette and the top scroll-progress bar.
 * Click fires a pulse on the cue dot; inputs get the grow state too.
 */
export default function Atmosphere() {
  const root = useRef(null);

  useGSAP(
    () => {
      if (!isTouch && !prefersReduced) {
        const ring = root.current.querySelector(".cur");
        const dot = root.current.querySelector(".cur__dot");
        const xTo = gsap.quickTo(ring, "x", { duration: 0.55, ease: "power3.out" });
        const yTo = gsap.quickTo(ring, "y", { duration: 0.55, ease: "power3.out" });
        const dxTo = gsap.quickTo(dot, "x", { duration: 0.08, ease: "power2.out" });
        const dyTo = gsap.quickTo(dot, "y", { duration: 0.08, ease: "power2.out" });

        const move = (e) => {
          xTo(e.clientX);
          yTo(e.clientY);
          dxTo(e.clientX);
          dyTo(e.clientY);
        };
        const grow = () => gsap.to(ring, { scale: 2.1, duration: 0.4 });
        const shrink = () => gsap.to(ring, { scale: 1, duration: 0.4 });
        /* click = cue pulse on the dot */
        const pulse = () => {
          gsap.fromTo(
            dot,
            { scale: 1 },
            { scale: 3.4, duration: 0.4, ease: "power2.out", yoyo: true, repeat: 1 }
          );
        };

        window.addEventListener("mousemove", move);
        window.addEventListener("mousedown", pulse);
        const hoverables = document.querySelectorAll(
          "a, button, input, textarea, .card, .gal__item, .proc__row"
        );
        hoverables.forEach((el) => {
          el.addEventListener("mouseenter", grow);
          el.addEventListener("mouseleave", shrink);
        });

        return () => {
          window.removeEventListener("mousemove", move);
          window.removeEventListener("mousedown", pulse);
          hoverables.forEach((el) => {
            el.removeEventListener("mouseenter", grow);
            el.removeEventListener("mouseleave", shrink);
          });
        };
      }
    },
    { scope: root, dependencies: [] }
  );

  useGSAP(() => {
    gsap.to(".prog", {
      scaleX: 1,
      ease: "none",
      scrollTrigger: { start: 0, end: "max", scrub: 0.3 },
    });
  }, []);

  return (
    <div ref={root}>
      <div className="prog" />
      <div className="vig" />
      <div className="grain" />
      <div className="cur" />
      <div className="cur__dot" />
    </div>
  );
}
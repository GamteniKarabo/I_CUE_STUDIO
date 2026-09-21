import { useRef } from "react";
import { gsap, useGSAP, prefersReduced } from "../lib/gsap";

const ITEMS = [
  "Photography",
  "Videography",
  "Rehearsal Space",
  "Podcast",
  "Live Recording",
  "Event Space",
  "Lighting",
  "Stage Makeup",
];

/** Seamless infinite marquee. Two identical halves -> xPercent -50 loop is invisible.
 *  Hover slows it to a crawl; leaving eases it back to full speed. */
export default function Marquee() {
  const root = useRef(null);

  useGSAP(
    () => {
      if (prefersReduced) return;
      const tl = gsap.to(".mq__track", {
        xPercent: -50,
        duration: 26,
        ease: "none",
        repeat: -1,
      });

      /* speed reacts to scroll direction / velocity */
      ScrollTriggerDelay(tl);

      /* hover = slow-motion crawl */
      const slow = () =>
        gsap.to(tl, { timeScale: 0.12, duration: 0.7, ease: "power2.out" });
      const fast = () =>
        gsap.to(tl, { timeScale: 1, duration: 0.9, ease: "power2.out" });
      const el = root.current;
      el.addEventListener("mouseenter", slow);
      el.addEventListener("mouseleave", fast);

      return () => {
        el.removeEventListener("mouseenter", slow);
        el.removeEventListener("mouseleave", fast);
      };
    },
    { scope: root }
  );

  return (
    <div className="mq" ref={root} aria-hidden="true">
      <div className="mq__track">
        {[0, 1].map((half) => (
          <div className="mq__item" key={half} style={{ display: "flex" }}>
            {ITEMS.map((t) => (
              <span key={t} style={{ display: "inline-flex", alignItems: "center", gap: "1.6rem" }}>
                <span className="mq__star">◆</span>
                <b>{t}</b>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/* Small helper: nudge marquee timeScale with scroll velocity. */
function ScrollTriggerDelay(tl) {
  gsap.to(tl, {
    timeScale: 1,
    duration: 0.4,
    ease: "power2.out",
    scrollTrigger: {
      trigger: document.body,
      start: 0,
      end: "max",
      onUpdate: (self) => {
        const v = gsap.utils.clamp(1, 6, 1 + Math.abs(self.getVelocity()) / 900);
        tl.timeScale(v);
        gsap.to(tl, { timeScale: 1, duration: 0.6, overwrite: true, ease: "power2.out" });
      },
    },
  });
}
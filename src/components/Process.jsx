import { useRef } from "react";
import { gsap, useGSAP, lineReveal, prefersReduced } from "../lib/gsap";
import { process } from "../data/services";

export default function Process() {
  const root = useRef(null);

  useGSAP(
    () => {
      lineReveal(root.current.querySelector(".proc__title"));

      if (prefersReduced) return;
      gsap.utils.toArray(".proc__row").forEach((row, i) => {
        gsap.from(row, {
          y: 52,
          autoAlpha: 0,
          duration: 0.95,
          delay: i * 0.05,
          ease: "power3.out",
          scrollTrigger: { trigger: row, start: "top 90%", once: true },
        });
        gsap.fromTo(
          row,
          { "--rule": 0 },
          {
            "--rule": 1,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: { trigger: row, start: "top 90%", once: true },
          }
        );

        /* hover: row leans in, step counter ticks with a back.out overshoot */
        const step = row.querySelector(".proc__step");
        const title = row.querySelector(".proc__title");
        row.addEventListener("mouseenter", () => {
          gsap.to(row, { x: 12, duration: 0.55, ease: "power3.out" });
          gsap.fromTo(
            step,
            { y: 10, autoAlpha: 0.35 },
            { y: 0, autoAlpha: 1, duration: 0.5, ease: "back.out(2.2)" }
          );
          gsap.to(title, { x: 6, duration: 0.5, ease: "power3.out" });
        });
        row.addEventListener("mouseleave", () => {
          gsap.to(row, { x: 0, duration: 0.6, ease: "power3.out" });
          gsap.to(title, { x: 0, duration: 0.6, ease: "power3.out" });
        });
      });
    },
    { scope: root }
  );

  return (
    <section className="section" id="process" ref={root}>
      <div className="shell">
        <span className="eyebrow" data-reveal>
          How it runs
        </span>
        <h2 className="h2 proc__title">From brief to delivered cut</h2>

        <div className="proc__list">
          {process.map((p) => (
            <div className="proc__row" key={p.step}>
              <div className="proc__step">{p.step}</div>
              <h3 className="proc__title" style={{ letterSpacing: "-0.03em" }}>
                {p.title}
              </h3>
              <p className="proc__text">{p.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
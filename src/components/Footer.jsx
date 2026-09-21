import { useRef } from "react";
import { gsap, useGSAP, splitText, prefersReduced, scrollToId } from "../lib/gsap";
import { services } from "../data/services";

export default function Footer() {
  const root = useRef(null);

  useGSAP(
    () => {
      const big = root.current.querySelector(".foot__big");
      const split = splitText(big, { type: "chars" });
      if (prefersReduced) {
        gsap.set(split.chars, { autoAlpha: 1, yPercent: 0 });
      } else {
        gsap.from(split.chars, {
          yPercent: 118,
          stagger: 0.035,
          duration: 1.2,
          ease: "expo.out",
          scrollTrigger: { trigger: big, start: "top 96%", once: true },
        });

        /* the giant outline wordplay: hover a letter -> it hops and fills gold */
        split.chars.forEach((ch) => {
          ch.addEventListener("mouseenter", () => {
            gsap.fromTo(
              ch,
              { yPercent: 0 },
              { yPercent: -10, duration: 0.3, ease: "back.out(2.6)", yoyo: true, repeat: 1 }
            );
            gsap.to(ch, { color: "#f0b429", duration: 0.25, ease: "power2.out" });
          });
          ch.addEventListener("mouseleave", () => {
            gsap.to(ch, { color: "rgba(245,242,236,0)", duration: 0.45, ease: "power2.out" });
          });
        });
      }
    },
    { scope: root }
  );

  return (
    <footer className="foot" ref={root}>
      <div className="shell">
        <div className="foot__grid">
          <div>
            <div className="brand" style={{ marginBottom: "1.1rem" }}>
              <span className="brand__mark">
                <i />
              </span>
              I-CUE STUDIOS
            </div>
            <p style={{ maxWidth: "34ch", fontSize: "0.9rem" }}>
              A photography, film and live production house. We hold the cue so you can hold the
              moment.
            </p>
          </div>

          <div>
            <div className="foot__head">Services</div>
            <ul className="foot__list">
              {services.slice(0, 4).map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`}>{s.title}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="foot__head">More</div>
            <ul className="foot__list">
              {services.slice(4).map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`}>{s.title}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="foot__head">Studio</div>
            <ul className="foot__list">
              <li>
                <button onClick={() => scrollToId("#about")} style={{ padding: 0 }}>
                  → Approach
                </button>
              </li>
              <li>
                <button onClick={() => scrollToId("#process")} style={{ padding: 0 }}>
                  → Process
                </button>
              </li>
              <li>
                <button onClick={() => scrollToId("#gallery")} style={{ padding: 0 }}>
                  → Gallery
                </button>
              </li>
              <li>
                <button onClick={() => scrollToId("#contact")} style={{ padding: 0 }}>
                  → Book a session
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="foot__big" aria-hidden="true">
          I-CUE STUDIOS
        </div>

        <div className="foot__bar">
          <span>© {new Date().getFullYear()} I-CUE Studios. All rights reserved.</span>
          <span>Photography · Film · Live Production</span>
        </div>
      </div>
    </footer>
  );
}
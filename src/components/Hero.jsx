import { useRef } from "react";
import { gsap, useGSAP, prefersReduced, FLAGS, scrollToId, splitText, isTouch } from "../lib/gsap";
import { heroImages } from "../data/services";

export default function Hero() {
  const root = useRef(null);

  useGSAP(
    () => {
      const scope = root.current;

      if (prefersReduced || FLAGS.static) {
        gsap.set([".hero__kicker", ".hero__copy", ".hero__side", ".hero__actions .btn"], {
          autoAlpha: 1,
          y: 0,
        });
        return;
      }

      /* ---- split the headline into characters ---- */
      const a = splitText(scope.querySelector(".hero__lineA"), { type: "chars,words" });
      const b = splitText(scope.querySelector(".hero__lineB"), { type: "chars,words" });

      const tl = gsap.timeline({
        delay: 2.85,
        defaults: { ease: "expo.out" },
      });

      tl.from(".hero__bg img", { scale: 1.35, duration: 2.6, ease: "expo.out" }, 0)
        .from(".hero__scrim", { autoAlpha: 0, duration: 1.6 }, 0)
        .from(
          [...a.chars, ...b.chars],
          {
            yPercent: 118,
            autoAlpha: 0,
            rotateX: -70,
            duration: 1.25,
            stagger: { each: 0.028, from: "start" },
          },
          0.15
        )
        .from(".hero__kicker", { y: 24, autoAlpha: 0, duration: 1 }, 0.5)
        .from(".hero__copy", { y: 34, autoAlpha: 0, duration: 1.1 }, 0.7)
        .from(
          ".hero__actions .btn",
          { y: 28, autoAlpha: 0, duration: 0.9, stagger: 0.12 },
          0.85
        )
        .from(
          ".hero__side .chip",
          { y: 18, autoAlpha: 0, duration: 0.7, stagger: 0.06 },
          0.95
        )
        .from(".hero__scroll", { autoAlpha: 0, x: 20, duration: 1 }, 1.1);

      /* ---- infinite cue-line rise ---- */
      gsap.fromTo(
        ".hero__scrollTrack i",
        { yPercent: 160 },
        { yPercent: -160, duration: 1.8, repeat: -1, ease: "sine.inOut" }
      );

      /* ---- ambient cue-light dust (gsap.utils.random = organic drift) ---- */
      gsap.utils.toArray(".hero__dust i").forEach((m, i) => {
        gsap.set(m, {
          x: gsap.utils.random(-50, 50),
          y: gsap.utils.random(-26, 26),
          scale: gsap.utils.random(0.5, 1.4),
        });

        const drift = () => {
          gsap.to(m, {
            x: () => gsap.utils.random(-70, 70),
            y: () => gsap.utils.random(-46, 40),
            duration: () => gsap.utils.random(4.5, 9),
            ease: "sine.inOut",
            onComplete: drift, /* re-randomise forever — never robotic */
          });
        };
        drift();

        gsap.fromTo(
          m,
          { opacity: gsap.utils.random(0.15, 0.45) },
          {
            opacity: gsap.utils.random(0.55, 1),
            duration: gsap.utils.random(1.4, 3),
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: i * 0.22,
          }
        );
      });

      /* ---- headline chars answer the cursor with a playful overshoot ---- */
      if (!isTouch) {
        [...a.chars, ...b.chars].forEach((ch) => {
          ch.addEventListener("mouseenter", () => {
            gsap.fromTo(
              ch,
              { yPercent: 0 },
              { yPercent: -9, duration: 0.26, ease: "back.out(2.4)", yoyo: true, repeat: 1 }
            );
          });
        });
      }

      /* ---- parallax on scroll (native fallback for ScrollSmoother) ---- */
      if (!isTouch) {
        gsap.to(".hero__bg", {
          yPercent: 16,
          ease: "none",
          scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
        });
        gsap.to(".hero__body", {
          yPercent: -8,
          autoAlpha: 0.25,
          ease: "none",
          scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
        });
      }
    },
    { scope: root }
  );

  return (
    <section className="hero" id="top" ref={root}>
      <div className="hero__bg" data-speed="0.86">
        <img src={heroImages[0]} alt="I-CUE Studios blacked-out stage under studio lighting" />
      </div>
      <div className="hero__scrim" />

      {/* ambient cue-light dust */}
      <div className="hero__dust" aria-hidden="true">
        {Array.from({ length: 14 }).map((_, i) => (
          <i key={i} style={{ left: `${(i * 61) % 90 + 5}%`, top: `${(i * 37) % 64 + 12}%` }} />
        ))}
      </div>

      <div className="hero__body">
        <div className="shell">
          <div className="hero__kicker">
            <span className="hero__rec">
              <i />
              REC
            </span>
            <span>Photography · Film · Live Production</span>
          </div>

          <h1 className="hero__title">
            <span className="hero__lineA">I-CUE</span>
            <span className="hero__line2 hero__lineB">STUDIOS</span>
          </h1>

          <div className="hero__grid">
            <div className="hero__copy">
              <p>
                One address for the whole production. We light it, shoot it, record it and
                mix it — photography, videography, rehearsal, podcast, live recording and
                event space under a single roof.
              </p>
              <div className="hero__actions">
                <button className="btn btn--solid" onClick={() => scrollToId("#contact")}>
                  <span className="btn__dot" />
                  Book a session
                </button>
                <button className="btn btn--ghost" onClick={() => scrollToId("#services")}>
                  See all 8 services
                </button>
              </div>
            </div>

            <div className="hero__side">
              <div className="hero__ticker">
                {[
                  "Photography",
                  "Videography",
                  "Rehearsal Space",
                  "Podcast",
                  "Live Recording",
                  "Event Space",
                  "Lighting",
                  "Stage Makeup",
                ].map((t) => (
                  <span className="chip" key={t}>
                    {t}
                  </span>
                ))}
              </div>
              <div className="hero__cue">
                <span>Scroll to cue</span>
                <span>— 01 / 08</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="hero__scroll">
        <span>Scroll</span>
        <span className="hero__scrollTrack">
          <i />
        </span>
      </div>
    </section>
  );
}
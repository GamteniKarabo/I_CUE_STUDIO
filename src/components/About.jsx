import { useRef } from "react";
import { gsap, useGSAP, splitText, prefersReduced } from "../lib/gsap";

const STATS = [
  { value: 8, suffix: "", label: "Services in-house" },
  { value: 1, suffix: " roof", label: "Everything under" },
  { value: 4, suffix: "K", label: "Resolution ceiling" },
];

export default function About() {
  const root = useRef(null);

  useGSAP(
    () => {
      const big = root.current.querySelector(".about__big");
      const split = splitText(big, { type: "words" });

      if (prefersReduced) {
        gsap.set(split.words, { autoAlpha: 1, y: 0 });
      } else {
        gsap.from(split.words, {
          autoAlpha: 0,
          y: 26,
          duration: 0.8,
          stagger: 0.022,
          ease: "power3.out",
          scrollTrigger: { trigger: big, start: "top 84%", once: true },
        });

        /* the statement drifts upward as you scroll past (scrub) */
        gsap.to(big, {
          yPercent: -5,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      if (prefersReduced) return;

      /* counters count up when they enter */
      gsap.utils.toArray(".stat__num").forEach((el) => {
        const target = Number(el.dataset.value);
        const obj = { v: 0 };
        gsap.to(obj, {
          v: target,
          duration: 1.6,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 92%", once: true },
          onUpdate: () => {
            el.querySelector("b").textContent = String(Math.round(obj.v));
          },
        });

        /* playful overshoot on hover */
        el.addEventListener("mouseenter", () => {
          gsap.fromTo(
            el,
            { scale: 1 },
            { scale: 1.07, duration: 0.5, ease: "back.out(2.6)", yoyo: true, repeat: 1 }
          );
        });
      });

      /* the two text columns drift at slightly different rates */
      gsap.utils.toArray(".about__col").forEach((col, i) => {
        gsap.from(col, {
          y: 46,
          autoAlpha: 0,
          duration: 0.95,
          delay: i * 0.08,
          ease: "power3.out",
          scrollTrigger: { trigger: col.parentElement, start: "top 88%", once: true },
        });
      });
    },
    { scope: root }
  );

  return (
    <section className="section about" id="about" ref={root}>
      <div className="shell">
        <span className="eyebrow" data-reveal>
          The approach
        </span>

        <div className="about__grid">
          <h2 className="about__big">
            We don't rent you a room and hand you a plug.
            <em> We build the look, hold the cue</em> and deliver the cut — so the only
            thing left for you to do is show up.
          </h2>

          <div>
            <div className="about__cols">
              <div className="about__col">
                <h4>One crew, one call sheet</h4>
                <p>
                  Photo, motion, sound, lighting and makeup sit in the same building — which
                  means one brief, one schedule and none of the drift that happens when four
                  vendors try to agree on a call time.
                </p>
              </div>
              <div className="about__col">
                <h4>Lighting before cameras</h4>
                <p>
                  Every session is pre-lit. We shape the key, the fall-off and the colour
                  temperature against a real lens before you step on the floor, so nothing is
                  guessed at once the clock is running.
                </p>
              </div>
              <div className="about__col">
                <h4>Acoustics and picture together</h4>
                <p>
                  Treated rooms mean a podcast or live take sounds as good as it looks. Audio
                  is captured to multitrack and mixed by the same people who shot the frame.
                </p>
              </div>
              <div className="about__col">
                <h4>Finished, not raw</h4>
                <p>
                  Stills are retouched, video is graded, audio is mastered. You get a finished
                  asset ready to publish — not a hard drive and a set of instructions.
                </p>
              </div>
            </div>

            <div className="about__stat">
              {STATS.map((s) => (
                <div key={s.label}>
                  <div className="stat__num" data-value={s.value}>
                    <b style={{ fontWeight: 500 }}>0</b>
                    <span>{s.suffix}</span>
                  </div>
                  <div className="stat__lbl">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
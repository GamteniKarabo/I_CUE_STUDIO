import { useRef, useState } from "react";
import { gsap, useGSAP, prefersReduced } from "../lib/gsap";


const LOGO = {
  src: "src/data/icue-logo.jpg",
  alt: "I-CUE Studios",
};

const LOAD_TIME = 2;


export default function Preloader({ onDone }) {
  const root = useRef(null);
  const logo = useRef(null);
  const [gone, setGone] = useState(false);

  useGSAP(
    () => {
      if (prefersReduced) {
        onDone();
        setGone(true);
        return;
      }

      const logoEl = logo.current;
      const logoGlow = root.current.querySelector(".pre__logoGlow");
      const logoRing = root.current.querySelector(".pre__logoRing");
      const bar = root.current.querySelector(".pre__bar i");
      const pct = root.current.querySelector(".pre__pct");
      const label = root.current.querySelector(".pre__label");

      /* ---------- Initial states ---------- */
      gsap.set(logoEl, { autoAlpha: 0, scale: 0.6, filter: "blur(18px)" });
      gsap.set(logoGlow, { autoAlpha: 0, scale: 0.6 });
      gsap.set(logoRing, { autoAlpha: 0, scale: 0.7 });
      gsap.set(bar, { scaleX: 0, transformOrigin: "left center" });
      gsap.set(pct, { autoAlpha: 0 });


      const beat = gsap.timeline({ repeat: -1, defaults: { ease: "power2.out" } });
      beat
        .to(logoEl, { scale: 1.09, duration: 0.16 }, 0)
        .to(logoGlow, { scale: 1.18, autoAlpha: 0.9, duration: 0.16 }, 0)
        .to(logoEl, { scale: 1, duration: 0.22 }, 0.16)
        .to(logoGlow, { scale: 1, autoAlpha: 0.55, duration: 0.22 }, 0.16)
        .to(logoEl, { scale: 1.06, duration: 0.14 }, 0.38)
        .to(logoGlow, { scale: 1.12, autoAlpha: 0.85, duration: 0.14 }, 0.38)
        .to(logoEl, { scale: 1, duration: 0.28 }, 0.52)
        .to(logoGlow, { scale: 1, autoAlpha: 0.55, duration: 0.28 }, 0.52)
        .to({}, { duration: 0.65 }); // rest between beats
      const tl = gsap.timeline({
        onComplete: () => {
          beat.kill();
          onDone();
          setGone(true);
        },
      });

      // Logo eases in
      tl.to(
        logoEl,
        {
          autoAlpha: 1,
          scale: 1,
          filter: "blur(0px)",
          duration: 1.4,
          ease: "power3.out",
        },
        0
      )
        .to(
          logoGlow,
          { autoAlpha: 0.55, scale: 1, duration: 1.4, ease: "power3.out" },
          0
        )
        .to(
          logoRing,
          { autoAlpha: 1, scale: 1, duration: 1.6, ease: "expo.out" },
          0.2
        )


        .to(logoRing, { rotation: 360, duration: LOAD_TIME, ease: "none" }, 0)
        .to(pct, { autoAlpha: 1, duration: 0.8 }, 0.6)


        .to(
          bar,
          {
            scaleX: 1,
            duration: LOAD_TIME,
            ease: "none",
            onUpdate() {
              const p = Math.round(this.progress() * 100);
              if (pct) pct.textContent = String(p).padStart(3, "0") + "%";
            },
          },
          0.4
        )


        .to(
          label,
          {
            duration: 0.4,
            onStart() {
              if (label) label.textContent = "Loading assets";
            },
          },
          LOAD_TIME * 0.45
        )

        /* ---------- Exit: bar completes, then curtains part ---------- */
        .to(pct, { autoAlpha: 0, duration: 0.4 }, "+=0.2")
        .to(logoEl, { autoAlpha: 0, scale: 1.06, duration: 0.5, ease: "power2.in" }, "<")
        .to(logoGlow, { autoAlpha: 0, duration: 0.5 }, "<")
        .to(logoRing, { autoAlpha: 0, scale: 0.9, duration: 0.5 }, "<")
        .to(label, { autoAlpha: 0, y: -8, duration: 0.5 }, "<")
        .to(".pre__bar", { autoAlpha: 0, duration: 0.4 }, "<")

        .to(
          ".pre__curtain--top",
          { yPercent: -101, duration: 0.95, ease: "expo.inOut" },
          "-=0.15"
        )
        .to(
          ".pre__curtain--bot",
          { yPercent: 101, duration: 0.95, ease: "expo.inOut" },
          "<"
        );
    },
    { scope: root }
  );

  if (gone) return null;

  return (
    <div className="pre" ref={root} aria-hidden="true">
      <div className="pre__curtain pre__curtain--top" />
      <div className="pre__curtain pre__curtain--bot" />
      <div className="pre__inner">

        <div className="pre__logoWrap">
          <span className="pre__logoGlow" />
          <span className="pre__logoRing" />
          <span className="pre__logoDisc">
            <img
              ref={logo}
              className="pre__logo"
              src={LOGO.src}
              alt={LOGO.alt}
              draggable="false"
            />
          </span>
        </div>

        <div className="pre__label">I-CUE Studios — Rolling</div>

        <div className="pre__bar">
          <i />
        </div>
        <div className="pre__pct">000%</div>
      </div>
    </div>
  );
}
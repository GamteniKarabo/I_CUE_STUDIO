import { useRef, useState } from "react";
import { gsap, useGSAP, prefersReduced, scrollToId, magnetize } from "../lib/gsap";

const LINKS = [
  { label: "Studio", id: "#top" },
  { label: "Services", id: "#services" },
  { label: "Approach", id: "#about" },
  { label: "Process", id: "#process" },
  { label: "Gallery", id: "#gallery" },
];

export default function Nav() {
  const root = useRef(null);
  const sheet = useRef(null);
  const [open, setOpen] = useState(false);
  const [stuck, setStuck] = useState(false);

  useGSAP(
    () => {
      gsap.from(".nav__row", {
        yPercent: -120,
        autoAlpha: 0,
        duration: 1.1,
        delay: prefersReduced ? 0 : 2.9,
        ease: "power4.out",
      });

      gsap.to(".nav", {
        scrollTrigger: {
          start: 60,
          end: "max",
          toggleClass: { targets: ".nav", className: "is-stuck" },
        },
      });

      /* magnetic brand + CTA (premium hover feel) */
      if (prefersReduced) return;
      const cleanups = [];
      root.current.querySelectorAll(".nav__cta, .brand").forEach((el) => {
        cleanups.push(magnetize(el, 0.3));
      });
      return () => cleanups.forEach((c) => c?.());
    },
    { scope: root }
  );

  /* mobile sheet open / close animation */
  useGSAP(
    () => {
      const el = sheet.current;
      if (!el) return;
      const links = el.querySelectorAll(".sheet__link");
      gsap.killTweensOf([el, links]);

      if (open) {
        gsap.set(el, { display: "grid" });
        gsap.timeline()
          .to(el, { clipPath: "inset(0% 0 0% 0)", duration: 0.7, ease: "expo.inOut" })
          .fromTo(
            links,
            { autoAlpha: 0, y: 42 },
            { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.07, ease: "power3.out" },
            "-=0.3"
          );
      } else {
        gsap.to(el, {
          clipPath: "inset(0 0 100% 0)",
          duration: 0.55,
          ease: "expo.inOut",
          onComplete: () => gsap.set(el, { display: "none" }),
        });
      }
    },
    { dependencies: [open], scope: root }
  );

  const go = (id) => {
    setOpen(false);
    window.setTimeout(() => {
      if (id === "#top") scrollToId("#top");
      else scrollToId(id);
    }, open ? 420 : 0);
  };

  return (
    <div ref={root}>
      <header className="nav">
        <div className="shell nav__row">
          <button className="brand" onClick={() => go("#top")} aria-label="I-CUE Studios home">
            <span className="brand__mark">
              <i />
            </span>
            I-CUE STUDIOS
          </button>

          <nav className="nav__links" aria-label="Primary">
            {LINKS.map((l) => (
              <button key={l.id} className="nav__link" onClick={() => go(l.id)}>
                <span>{l.label}</span>
              </button>
            ))}
          </nav>

          <button className="btn btn--solid nav__cta" onClick={() => go("#contact")}>
            Book the studio
          </button>

          <button
            className={`burger ${open ? "is-open" : ""}`}
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
            aria-expanded={open}
          >
            <i />
            <i />
          </button>
        </div>
      </header>

      <div className="sheet" ref={sheet} style={{ display: "none", clipPath: "inset(0 0 100% 0)" }}>
        <div className="shell sheet__inner">
          {[...LINKS, { label: "Book", id: "#contact" }].map((l) => (
            <button key={l.id} className="sheet__link" onClick={() => go(l.id)}>
              {l.label}
            </button>
          ))}
        </div>
        <div className="sheet__foot">Loop • Studio • Rehearsal • Podcast</div>
      </div>
    </div>
  );
}
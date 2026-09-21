import { useRef, useState } from "react";
import { gsap, useGSAP, prefersReduced, FLAGS, lineReveal } from "../lib/gsap";
import { galleryStrip } from "../data/services";

export default function Gallery() {
  const root = useRef(null);
  const [lightbox, setLightbox] = useState(null);

  useGSAP(
    () => {
      lineReveal(root.current.querySelector(".gal__title"));
      if (prefersReduced || FLAGS.static) {
        gsap.set(root.current.querySelectorAll(".gal__clip"), { display: "none" });
        return;
      }

      const rows = gsap.utils.toArray(".gal__row");

      /* row A drifts left, row B drifts right — continuous film-strip loops */
      rows.forEach((row, i) => {
        const dir = i % 2 === 0 ? -1 : 1;
        gsap.set(row, { xPercent: dir < 0 ? 0 : -33.3333 });

        const loop = gsap.to(row, {
          xPercent: dir < 0 ? -33.3333 : 0,
          duration: 42 + i * 8,
          ease: "none",
          repeat: -1,
        });

        if (dir < 0) gsap.set(row, { xPercent: 0 });

        ScrollTriggerSpeed(loop);
      });

      /* each frame un-clips as it enters */
      gsap.utils.toArray(".gal__item").forEach((item, i) => {
        gsap.fromTo(
          item.querySelectorAll(".gal__clip"),
          { scaleY: 1 },
          {
            scaleY: 0,
            duration: 0.9,
            ease: "expo.inOut",
            delay: (i % 5) * 0.06,
            scrollTrigger: { trigger: ".gal__strip", start: "top 92%", once: true },
          }
        );
        gsap.fromTo(
          item.querySelector("img"),
          { yPercent: -8 },
          {
            yPercent: 8,
            ease: "none",
            scrollTrigger: {
              trigger: ".gal__strip",
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      });
    },
    { scope: root }
  );

  /* lightbox entrance choreography — timeline + callbacks */
  useGSAP(
    () => {
      if (!lightbox) return;
      const el = root.current.querySelector(".lightbox");
      const onKey = (e) => {
        if (e.key === "Escape") close();
      };
      window.addEventListener("keydown", onKey);

      const tl = gsap.timeline();
      tl.fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.32, ease: "power2.out" })
        .fromTo(
          ".lightbox img",
          { scale: 0.84, y: 34, autoAlpha: 0 },
          { scale: 1, y: 0, autoAlpha: 1, duration: 0.75, ease: "expo.out" },
          "-=0.12"
        )
        .fromTo(
          ".lightbox__cap",
          { y: 18, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.55, ease: "back.out(1.8)" },
          "-=0.38"
        );

      return () => {
        window.removeEventListener("keydown", onKey);
        tl.kill();
      };
    },
    { dependencies: [lightbox], scope: root }
  );

  const close = () => {
    const el = root.current?.querySelector(".lightbox");
    if (!el) return setLightbox(null);
    gsap.to(el, {
      autoAlpha: 0,
      duration: 0.28,
      ease: "power2.in",
      onComplete: () => setLightbox(null), /* callbacks: exit before unmount */
    });
  };

  const rowA = galleryStrip.slice(0, 5);
  const rowB = galleryStrip.slice(5);

  return (
    <section className="section gal" id="gallery" ref={root}>
      <div className="shell">
        <span className="eyebrow" data-reveal>
          The floor
        </span>
        <h2 className="h2 gal__title">Looks we've built</h2>
      </div>

      <div className="gal__strip">
        {[rowA, rowB].map((row, r) => (
          <div className="gal__row" key={r}>
            {[0, 1, 2].map((dup) =>
              row.map((g, i) => (
                <figure
                  className="gal__item"
                  key={`${r}-${dup}-${i}`}
                  style={{ margin: 0 }}
                  aria-hidden={dup > 0}
                  {...(dup === 0 && {
                    onClick: () => setLightbox(g),
                    tabIndex: 0,
                    onKeyDown: (e) => e.key === "Enter" && setLightbox(g),
                    role: "button",
                    "aria-label": `Enlarge: ${g.label}`,
                  })}
                >
                  <img
                    src={g.src}
                    alt={dup === 0 ? g.label : ""}
                    loading={dup === 0 ? "eager" : "lazy"}
                  />
                  <span className="gal__clip" />
                  <figcaption className="gal__cap">{g.label}</figcaption>
                </figure>
              ))
            )}
          </div>
        ))}
      </div>

      {lightbox && (
        <div className="lightbox" onClick={close} role="dialog" aria-modal="true" aria-label={lightbox.label}>
          <button className="lightbox__close" onClick={close} aria-label="Close">
            ✕
          </button>
          <figure onClick={(e) => e.stopPropagation()}>
            <img src={lightbox.src} alt={lightbox.label} />
            <figcaption className="lightbox__cap">{lightbox.label}</figcaption>
          </figure>
        </div>
      )}
    </section>
  );
}

function ScrollTriggerSpeed(loop) {
  gsap.to(loop, {
    timeScale: 1,
    duration: 0.5,
    ease: "power2.out",
    scrollTrigger: {
      trigger: document.body,
      start: 0,
      end: "max",
      onUpdate: (self) => {
        const v = gsap.utils.clamp(1, 5, 1 + Math.abs(self.getVelocity()) / 1200);
        loop.timeScale(v);
        gsap.to(loop, { timeScale: 1, duration: 0.7, overwrite: true, ease: "power2.out" });
      },
    },
  });
}
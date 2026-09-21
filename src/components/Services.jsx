import { useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP, prefersReduced, isTouch } from "../lib/gsap";
import { services } from "../data/services";

/**
 * The centrepiece: a pinned, horizontally-scrubbed deck of the eight services.
 * On touch/small screens the same markup becomes a native swipe carousel.
 * Desktop cards get pointer-tracked media parallax + a glow that follows the cursor.
 */
export default function Services() {
  const root = useRef(null);
  const shell = useRef(null);
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      if (prefersReduced) return;

      const mm = gsap.matchMedia();

      /* ---------- desktop: pin + horizontal scroll ---------- */
      mm.add("(min-width: 901px)", () => {
        const track = root.current.querySelector(".svc__track");
        const viewport = root.current.querySelector(".svc__viewport");
        const getDistance = () =>
          Math.max(0, track.scrollWidth - viewport.clientWidth);

        const tween = gsap.to(track, {
          x: () => -getDistance(),
          ease: "none",
          scrollTrigger: {
            trigger: shell.current,
            start: "top top",
            end: () => "+=" + (getDistance() + window.innerHeight * 0.5),
            pin: true,
            scrub: 0.6,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const n = Math.round(self.progress * (services.length - 1));
              setActive(n);
              gsap.to(".svc__progressTrack i", {
                scaleX: Math.max(0.02, self.progress),
                duration: 0.25,
                overwrite: true,
              });
            },
          },
        });

        /* card contents lift in as the deck advances */
        gsap.utils.toArray(".card").forEach((card) => {
          gsap.from(card.querySelectorAll(".card__media, .card__title, .card__blurb, .card__points li"), {
            y: 46,
            autoAlpha: 0,
            duration: 0.8,
            stagger: 0.06,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              containerAnimation: tween,
              start: "left 92%",
              once: true,
            },
          });
          gsap.fromTo(
            card.querySelector(".card__rule"),
            { scaleX: 0 },
            {
              scaleX: 1,
              duration: 0.9,
              ease: "power3.out",
              scrollTrigger: {
                trigger: card,
                containerAnimation: tween,
                start: "left 90%",
                once: true,
              },
            }
          );
        });

        /* pointer-tracked media parallax — image leans away, glow follows */
        const cleanups = [];
        if (!isTouch) {
          gsap.utils.toArray(".card").forEach((card) => {
            const img = card.querySelector(".card__media img");
            const glow = card.querySelector(".card__glow");
            const qx = gsap.quickTo(img, "x", { duration: 0.55, ease: "power3.out" });
            const qy = gsap.quickTo(img, "y", { duration: 0.55, ease: "power3.out" });
            const qg = gsap.quickTo(glow, "xPercent", { duration: 0.5, ease: "power3.out" });

            const move = (e) => {
              const r = card.getBoundingClientRect();
              const nx = (e.clientX - r.left) / r.width - 0.5;
              const ny = (e.clientY - r.top) / r.height - 0.5;
              qx(nx * -20);
              qy(ny * -12);
              qg(nx * 70);
            };
            const leave = () => { qx(0); qy(0); qg(0); };

            card.addEventListener("mousemove", move);
            card.addEventListener("mouseleave", leave);
            cleanups.push(() => {
              card.removeEventListener("mousemove", move);
              card.removeEventListener("mouseleave", leave);
            });
          });
        }

        return () => {
          tween.scrollTrigger?.kill();
          cleanups.forEach((fn) => fn());
        };
      });

      /* ---------- mobile: tap-through snap, keep cards animated ---------- */
      mm.add("(max-width: 900px)", () => {
        gsap.from(".card", {
          y: 40,
          autoAlpha: 0,
          duration: 0.75,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: ".svc__viewport", start: "top 88%", once: true },
        });
      });

      ScrollTrigger.refresh();
      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section className="svc" id="services" ref={root}>
      <div className="shell svc__head">
        <div className="svc__headRow">
          <div>
            <span className="eyebrow" data-reveal>
              What we do
            </span>
            <h2 className="h2" data-reveal data-reveal-delay="0.06">
              Eight services.
              <br />
              One studio floor.
            </h2>
          </div>
          <div className="svc__progress">
            <span>{String(active + 1).padStart(2, "0")}</span>
            <span className="svc__progressTrack">
              <i />
            </span>
            <span>{String(services.length).padStart(2, "0")}</span>
          </div>
        </div>
      </div>

      <div className="svc__shell" ref={shell}>
        <div className="svc__viewport">
          <div className="svc__track">
            {services.map((s) => (
              <article className="card" key={s.id} id={s.id}>
                <div className="card__rule" />
                <div className="card__media">
                  <img src={s.image} alt={`${s.title} at I-CUE Studios`} loading="lazy" />
                  <span className="card__tag">{s.tag}</span>
                  <span className="card__idx">{s.index}</span>
                </div>
                <div className="card__body">
                  <h3 className="card__title">{s.title}</h3>
                  <p className="card__blurb">{s.blurb}</p>
                  <ul className="card__points">
                    {s.points.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                </div>
                <div className="card__glow" />
              </article>
            ))}
          </div>
        </div>
        <div className="svc__hint">
          <i />
          {isTouch ? "Swipe through the deck" : "Keep scrolling — the deck moves sideways"}
        </div>
      </div>
    </section>
  );
}
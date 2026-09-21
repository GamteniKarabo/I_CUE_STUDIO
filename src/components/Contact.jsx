import { useRef, useState } from "react";
import { gsap, useGSAP, prefersReduced, splitText, magnetize } from "../lib/gsap";
import { services } from "../data/services";

export default function Contact() {
  const root = useRef(null);
  const [sent, setSent] = useState(false);

  useGSAP(
    () => {
      const scope = root.current;

      /* headline chars cascade in */
      const split = splitText(scope.querySelector(".cta__title"), { type: "chars,words" });
      if (prefersReduced) {
        gsap.set(split.chars, { autoAlpha: 1, y: 0 });
      } else {
        gsap.from(split.chars, {
          yPercent: 110,
          autoAlpha: 0,
          duration: 1,
          stagger: 0.022,
          ease: "power4.out",
          scrollTrigger: { trigger: ".cta__title", start: "top 88%", once: true },
        });
      }

      if (!prefersReduced) {
        gsap.from(".field", {
          y: 30,
          autoAlpha: 0,
          duration: 0.8,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: { trigger: ".form", start: "top 90%", once: true },
        });
      }

      /* field focus glow */
      scope.querySelectorAll(".field input, .field textarea").forEach((input) => {
        input.addEventListener("focus", () =>
          gsap.to(input.parentElement, { "--f": 1, duration: 0.4 })
        );
        input.addEventListener("blur", () =>
          gsap.to(input.parentElement, { "--f": 0, duration: 0.4 })
        );
      });

      /* magnetic submit button */
      const cleanup = magnetize(scope.querySelector(".form .btn"), 0.22);
      return () => cleanup?.();
    },
    { scope: root }
  );

  const submit = (e) => {
    e.preventDefault();
    if (sent) return;

    /* particle burst from the button (gsap.utils.random = organic scatter) */
    const burst = root.current.querySelector(".form__burst");
    if (burst && !prefersReduced) {
      gsap.fromTo(
        burst.children,
        { x: 0, y: 0, scale: 1, autoAlpha: 1 },
        {
          x: () => gsap.utils.random(-110, 110),
          y: () => gsap.utils.random(-120, -30),
          scale: 0,
          autoAlpha: 0,
          duration: () => gsap.utils.random(0.6, 1.15),
          stagger: 0.02,
          ease: "power2.out",
        }
      );
    }

    setSent(true);

    /* success choreography: draw the check, pop the ring, land the copy */
    const tl = gsap.timeline();
    tl.fromTo(
      ".form__done",
      { autoAlpha: 0, y: 12 },
      { autoAlpha: 1, y: 0, duration: 0.5, ease: "power3.out" }
    )
      .fromTo(
        ".form__check path",
        { strokeDashoffset: 26 },
        { strokeDashoffset: 0, duration: 0.55, ease: "power2.inOut" },
        "-=0.2"
      )
      .fromTo(
        ".form__check circle",
        { scale: 0, transformOrigin: "50% 50%" },
        { scale: 1, duration: 0.7, ease: "back.out(2.4)" },
        "-=0.55"
      );
  };

  return (
    <section className="section cta" id="contact" ref={root}>
      <div className="cta__glow" />
      <div className="shell cta__grid">
        <div>
          <span className="eyebrow" data-reveal>
            Book the studio
          </span>
          <h2 className="cta__title">
            Let's build
            <br />
            the look.
          </h2>
          <p className="lede" style={{ marginTop: "1.6rem" }}>
            Tell us what you need — a portrait session, a four-day shoot, a rehearsal block or a
            podcast run. We'll come back with a room, a crew, a schedule and a price.
          </p>

          <div className="hero__actions" style={{ marginTop: "2rem" }}>
            <div className="chip">thereshorebrainy@gmail.com</div>
            <div className="chip">+27 63 775 6174</div>
            <div className="chip">Mon–Sun · 08:00 – late</div>
          </div>
        </div>

        <form className="form" onSubmit={submit}>
          <div className="field">
            <input id="f-name" type="text" placeholder=" " required />
            <label htmlFor="f-name">Your full names</label>
          </div>
          <div className="field">
            <input id="f-mail" type="email" placeholder=" " required />
            <label htmlFor="f-mail">Email</label>
          </div>
          <div className="field">
            <input id="f-svc" list="svc-list" placeholder=" " />
            <datalist id="svc-list">
              {services.map((s) => (
                <option key={s.id} value={s.title} />
              ))}
            </datalist>
            <label htmlFor="f-svc">What do you need?</label>
          </div>
          <div className="field">
            <input id="f-date" type="text" placeholder=" " />
            <label htmlFor="f-date">Preferred date</label>
          </div>
          <div className="field">
            <textarea id="f-msg" placeholder=" " />
            <label htmlFor="f-msg">Tell us about the project</label>
          </div>

          <div className="form__row">
            <button className="btn btn--solid" type="submit" disabled={sent}>
              <span className="btn__dot" />
              {sent ? "Brief sent" : "Send the brief"}
            </button>
            {sent ? (
              <span className="form__done">
                <svg className="form__check" viewBox="0 0 32 32" aria-hidden="true">
                  <circle cx="16" cy="16" r="13.5" />
                  <path d="M9.5 16.5l4.5 4.5 8.5-9.5" />
                </svg>
                Brief received — we'll reply within one working day.
              </span>
            ) : (
              <span className="form__note"></span>
            )}
          </div>

          <span className="form__burst" aria-hidden="true">
            {Array.from({ length: 10 }).map((_, i) => (
              <i key={i} />
            ))}
          </span>
        </form>
      </div>
    </section>
  );
}
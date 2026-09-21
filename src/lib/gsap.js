import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { SplitText } from "gsap/SplitText";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, SplitText, useGSAP);

/* ScrollSmoother is registered separately so a failure can never break the app. */
gsap.registerPlugin(ScrollSmoother);

gsap.defaults({ ease: "power3.out", duration: 0.9 });

/* Query flags: ?static=1 renders the page fully settled (used for
   screenshots / print / no-JS-preview verification). */
const qs =
  typeof window !== "undefined"
    ? new URLSearchParams(window.location.search)
    : new URLSearchParams();

export const FLAGS = {
  static: qs.has("static"),
};

export const prefersReduced =
  typeof window !== "undefined" &&
  window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const isTouch =
  typeof window !== "undefined" &&
  ("ontouchstart" in window || navigator.maxTouchPoints > 0);

/* ------------------------------------------------------------------ *
 * Split text safely. Falls back to the raw element if SplitText is
 * unavailable so no headline can ever be left invisible.
 * ------------------------------------------------------------------ */
export function splitText(el, opts = {}) {
  const config = { type: "chars", ...opts };
  try {
    return SplitText.create(el, config);
  } catch (err) {
    return {
      chars: [el],
      words: [el],
      lines: [el],
      revert: () => {},
    };
  }
}

/* ------------------------------------------------------------------ *
 * Universal "reveal on scroll" used by every section.
 * Every element starts hidden through gsap.set() at runtime (not CSS),
 * so if JS ever breaks, the content simply stays visible.
 * ------------------------------------------------------------------ */
export function initReveals(scope) {
  if (!scope) return;
  if (prefersReduced || FLAGS.static) {
    gsap.set(scope.querySelectorAll("[data-reveal], [data-reveal-child]"), {
      autoAlpha: 1,
      y: 0,
    });
    return;
  }

  const heads = scope.querySelectorAll("[data-reveal]");
  heads.forEach((el) => {
    const distance = Number(el.dataset.revealY ?? 34);
    gsap.set(el, { autoAlpha: 0, y: distance });

    ScrollTrigger.create({
      trigger: el,
      start: "top 86%",
      once: true,
      onEnter: () =>
        gsap.to(el, {
          autoAlpha: 1,
          y: 0,
          duration: 1,
          delay: Number(el.dataset.revealDelay ?? 0),
          ease: "power3.out",
        }),
    });
  });

  /* groups of children that stagger together */
  scope.querySelectorAll("[data-reveal-group]").forEach((group) => {
    const kids = group.querySelectorAll("[data-reveal-child]");
    if (!kids.length) return;
    gsap.set(kids, { autoAlpha: 0, y: 40 });
    ScrollTrigger.create({
      trigger: group,
      start: "top 85%",
      once: true,
      onEnter: () =>
        gsap.to(kids, {
          autoAlpha: 1,
          y: 0,
          duration: 0.95,
          stagger: Number(group.dataset.stagger ?? 0.09),
          ease: "power3.out",
        }),
    });
  });
}

/* ------------------------------------------------------------------ *
 * A masked, line-by-line reveal for headings. Runs after webfonts land
 * so line breaks are measured correctly.
 * ------------------------------------------------------------------ */
export function lineReveal(el, vars = {}) {
  if (!el) return null;
  const split = splitText(el, { type: "lines", mask: "lines", linesClass: "ln" });
  const tl = gsap.timeline({
    scrollTrigger: { trigger: el, start: "top 88%", once: true },
  });
  tl.from(split.lines, {
    yPercent: 110,
    autoAlpha: 0,
    duration: 1.1,
    stagger: 0.08,
    ease: "power4.out",
    ...vars,
  });
  return { split, tl };
}

/* ------------------------------------------------------------------ *
 * Magnetic pull for buttons / cards.
 * ------------------------------------------------------------------ */
export function magnetize(el, strength = 0.32) {
  if (!el || isTouch) return () => {};
  const xTo = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3.out" });
  const yTo = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3.out" });

  const move = (e) => {
    const r = el.getBoundingClientRect();
    xTo((e.clientX - (r.left + r.width / 2)) * strength);
    yTo((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const leave = () => {
    xTo(0);
    yTo(0);
  };
  el.addEventListener("mousemove", move);
  el.addEventListener("mouseleave", leave);
  return () => {
    el.removeEventListener("mousemove", move);
    el.removeEventListener("mouseleave", leave);
  };
}

/* ------------------------------------------------------------------ *
 * Smooth scrolling to a section — works with or without ScrollSmoother.
 * ------------------------------------------------------------------ */
export function scrollToId(id) {
  const target = document.querySelector(id);
  if (!target) return;
  const smoother = ScrollSmoother.get?.();
  if (smoother) smoother.scrollTo(target, true, "top 72px");
  else gsap.to(window, { scrollTo: { y: target, offsetY: 72 }, duration: 1 });
}

export { gsap, ScrollTrigger, ScrollSmoother, SplitText, useGSAP };

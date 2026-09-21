import { useEffect, useRef, useState } from "react";
import {
  gsap,
  ScrollTrigger,
  ScrollSmoother,
  useGSAP,
  prefersReduced,
  FLAGS,
  initReveals,
} from "./lib/gsap";

import Atmosphere from "./components/Atmosphere";
import Preloader from "./components/Preloader";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Marquee from "./components/Marquee";
import Services from "./components/Services";
import About from "./components/About";
import Process from "./components/Process";
import Gallery from "./components/Gallery";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

export default function App() {
  const root = useRef(null);
  const [ready, setReady] = useState(FLAGS.static);

  /* ---------- ScrollSmoother: one long, damped scroll for the whole page ---------- */
  useGSAP(() => {
    if (prefersReduced) return;
    const mm = gsap.matchMedia();

    mm.add("(min-width: 901px) and (prefers-reduced-motion: no-preference)", () => {
      let smoother = null;
      try {
        smoother = ScrollSmoother.create({
          wrapper: "#smooth-wrapper",
          content: "#smooth-content",
          smooth: 1.2,
          smoothTouch: false,
          effects: true,
          normalizeScroll: false,
        });
      } catch (err) {
        smoother = null; /* falls back to native scrolling */
      }
      return () => smoother?.kill();
    });

    return () => mm.revert();
  }, []);

  /* ---------- lock the page while the preloader runs ---------- */
  useEffect(() => {
    if (FLAGS.static) document.documentElement.classList.add("is-static");
    document.body.classList.toggle("is-locked", !ready);
    return () => document.body.classList.remove("is-locked");
  }, [ready]);

  const onLoaded = () => setReady(true);

  /* ---------- reveal system + a soft page-level entrance once loading is done ---------- */
  useGSAP(
    () => {
      initReveals(root.current);
      ScrollTrigger.refresh();

      /* static preview: fast-forward every scroll entrance to its settled state */
      if (FLAGS.static) {
        const id = window.setTimeout(() => {
          ScrollTrigger.getAll().forEach((st) => {
            if (st.animation?.progress) st.animation.progress(1);
          });
          ScrollTrigger.refresh();
        }, 140);
        return () => window.clearTimeout(id);
      }

      if (!ready || prefersReduced) return;
      gsap.from(".mq", { autoAlpha: 0, y: 20, duration: 1, delay: 0.35, ease: "power3.out" });
    },
    { dependencies: [ready], scope: root }
  );

  return (
    <>
      <Atmosphere />
      {!FLAGS.static && <Preloader onDone={onLoaded} />}

      <div id="smooth-wrapper" ref={root}>
        <div id="smooth-content">
          <Nav />
          <main>
            <Hero />
            <Marquee />
            <Services />
            <About />
            <Process />
            <Gallery />
            <Contact />
          </main>
          <Footer />
        </div>
      </div>
    </>
  );
}

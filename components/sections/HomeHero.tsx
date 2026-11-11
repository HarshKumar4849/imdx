"use client";

import { useEffect, useRef, useState } from "react";
import { StandardsViews } from "./StandardsViews";

const summary = "IMDX is a sovereign, peer-to-peer data exchange for India's mobility ecosystem. Tecmotiv designs, builds and operates it — so data owners stay in control and buyers get trusted data under a signed contract.";
const strengths = [
  { title: "Mobility & automotive", description: "Deep OEM, Tier-1 and supplier relationships across India's automotive ecosystem — the demand side of IMDX." },
  { title: "Energy & EV", description: "EV charging, battery and grid data — the first cross-domain applications on the exchange, including battery passports." },
  { title: "Digital, data & AI", description: "Platform engineering, identity, analytics and AI — the team that builds and runs the exchange and its intelligence layer." },
];
const helpItems = [
  { title: "Design & build", description: "Architecture, connectors, identity, contracts, payments and audit — delivered on Eclipse Tractus-X EDC." },
  { title: "Onboard & operate", description: "Participant onboarding, hosted connectors, catalogue operations, support and governance." },
  { title: "Build applications", description: "Battery passports, urban and transport planning, and intelligence products on shared data." },
  { title: "Integrate & scale", description: "APIs and connectors into ERP, PLM, telematics, charging and city systems." },
];
const intelligenceItems = [
  { title: "Catalogue", description: "Common definitions so data from different sources can be compared and combined." },
  { title: "Analytics", description: "Forecasting, anomaly detection, optimisation and scoring on shared data." },
  { title: "Platform", description: "Architecture, open-source stack, identity, onboarding, hosting and operations." },
  { title: "Integration", description: "Connectors and APIs to ERP, PLM, telematics, charging and city systems." },
];
const applicationItems = [
  { title: "Battery passport", description: "Map the data you must provide, align with Catena-X models and exchange verified data with European customers while keeping your IP." },
  { title: "Urban planning", description: "Combine land use, infrastructure, mobility and energy data to test scenarios, such as EV charging site selection, before committing budgets." },
  { title: "Transport planning", description: "Combine public transport, traffic, shared mobility and fleet data for route planning, congestion analysis and performance dashboards." },
];
const memberItems = [
  { title: "Public", description: "How connectors work, membership process, sample agreement." },
  { title: "Members", description: "Data catalogue, connector setup, contracts, exchange logs, support desk." },
];
const servicesDescription = "Every layer is built in: identity, catalogue, contracts, payments, consent, audit and connectors. No bolt-on compliance and no central copy of your data.";
const serviceRows = [
  { title: "Identity & onboarding", description: "Every participant gets a DID, BPN and verifiable credentials; humans and machines authenticate separately." },
  { title: "Catalogue & discovery", description: "Publish datasets with price, purpose, classification and SLA; find them through full-text search." },
  { title: "Contracts & signing", description: "Canonical terms are hashed and signed by both parties with OTP or DSC; the PDF is the legal record." },
  { title: "Payments & metering", description: "Pay-per-use, subscription or hybrid offers; UPI and card receipts gate the transfer; usage is metered and invoiced." },
  { title: "Consent & DPDP", description: "Purpose-based consent with expiry, revocation and an erasure cascade; personal data is minimised or anonymised." },
  { title: "Audit & evidence", description: "Every material event goes into a hash-chained, append-only ledger that even the operator cannot rewrite." },
  { title: "Connectors & transfer", description: "Eclipse EDC control and data planes negotiate and move data directly between participants." },
];
const standardsCards = [
  { title: "Eclipse EDC & Tractus-X", description: "The open-source dataspace stack behind every connector." },
  { title: "Dataspace Protocol (DSP)", description: "Contract negotiation and transfer between participants." },
  { title: "ODRL", description: "Machine-readable usage policies for purpose, price, limits and expiry." },
  { title: "DID & Verifiable Credentials", description: "Self-sovereign identity for organisations and machines." },
  { title: "Catena-X", description: "Alignment with European automotive data models, including battery passports." },
  { title: "DPDP Act 2023", description: "Purpose-based consent, minimisation, erasure and audit." },
];
export function HomeHero() {
  const [expanded, setExpanded] = useState(false);
  const [watchingVideo, setWatchingVideo] = useState(false);
  const [videoLoading, setVideoLoading] = useState(false);
  const [videoError, setVideoError] = useState<string | null>(null);
  const pendingVideoPlayRef = useRef(false);
  const backgroundVideoRef = useRef<HTMLVideoElement>(null);
  const fullVideoRef = useRef<HTMLVideoElement>(null);
  const clickedTabRef = useRef<string | null>(null);
  const clickedTabReachedRef = useRef(false);
  const transitionRef = useRef<HTMLElement>(null);
  const overviewRef = useRef<HTMLElement>(null);
  const strengthSectionRef = useRef<HTMLElement>(null);
  const helpsPanelRef = useRef<HTMLElement>(null);
  const intelligenceRef = useRef<HTMLElement>(null);
  const upperWingRef = useRef<SVGPathElement>(null);
  const lowerWingRef = useRef<SVGPathElement>(null);
  const footerRef = useRef<HTMLElement>(null);
  const footerPixelsRef = useRef<HTMLCanvasElement>(null);

  const openFullVideo = () => {
    backgroundVideoRef.current?.pause();
    setVideoError(null);
    setVideoLoading(true);
    pendingVideoPlayRef.current = true;
    setWatchingVideo(true);
    const video = fullVideoRef.current;
    if (video) {
      video.muted = false;
      if (video.readyState > HTMLMediaElement.HAVE_NOTHING) video.currentTime = 0;
      if (video.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
        pendingVideoPlayRef.current = false;
        void video.play().catch(() => {
          setVideoLoading(false);
          setVideoError("Playback didn’t start. Try the play button below.");
        });
      } else if (video.networkState === HTMLMediaElement.NETWORK_EMPTY) {
        video.load();
      }
    }
  };

  const retryFullVideo = () => {
    const video = fullVideoRef.current;
    if (!video) return;
    setVideoError(null);
    setVideoLoading(true);
    pendingVideoPlayRef.current = false;
    video.muted = false;
    if (video.readyState > HTMLMediaElement.HAVE_NOTHING) video.currentTime = 0;
    if (video.error || video.networkState === HTMLMediaElement.NETWORK_NO_SOURCE) video.load();
    void video.play().catch(() => {
      setVideoLoading(false);
      setVideoError("Playback didn’t start. Check the connection and try again.");
    });
  };

  const onFullVideoCanPlay = () => {
    setVideoError(null);
    if (!pendingVideoPlayRef.current) return;
    pendingVideoPlayRef.current = false;
    const video = fullVideoRef.current;
    if (video) {
      void video.play().catch(() => {
        setVideoLoading(false);
        setVideoError("Playback didn’t start. Try the play button below.");
      });
    }
  };

  const closeFullVideo = () => {
    fullVideoRef.current?.pause();
    pendingVideoPlayRef.current = false;
    setVideoLoading(false);
    setVideoError(null);
    setWatchingVideo(false);
    const backgroundVideo = backgroundVideoRef.current;
    if (backgroundVideo) {
      backgroundVideo.muted = true;
      void backgroundVideo.play().catch(() => undefined);
    }
  };

  useEffect(() => {
    if (!watchingVideo) return;
    const video = fullVideoRef.current;
    if (!video) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      video.pause();
      pendingVideoPlayRef.current = false;
      setVideoLoading(false);
      setVideoError(null);
      setWatchingVideo(false);
      const backgroundVideo = backgroundVideoRef.current;
      if (backgroundVideo) {
        backgroundVideo.muted = true;
        void backgroundVideo.play().catch(() => undefined);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [watchingVideo]);

  useEffect(() => {
    const previousScrollRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    const resetToStart = () => window.scrollTo(0, 0);
    resetToStart();
    window.addEventListener("pageshow", resetToStart);
    return () => {
      window.removeEventListener("pageshow", resetToStart);
      window.history.scrollRestoration = previousScrollRestoration;
    };
  }, []);

  useEffect(() => {
    const footer = footerRef.current;
    const canvas = footerPixelsRef.current;
    const context = canvas?.getContext("2d");
    if (!footer || !canvas || !context) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      footer.style.setProperty("--pixel-progress", "1");
      footer.classList.add("is-pixel-complete");
      footer.classList.add("is-pixel-content-visible");
      return;
    }

    let animationFrame = 0;
    let tiles: Array<{ x: number; y: number; delay: number }> = [];
    let tileSize = 42;

    const createTiles = () => {
      const bounds = footer.getBoundingClientRect();
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.ceil(bounds.width * pixelRatio);
      canvas.height = Math.ceil(bounds.height * pixelRatio);
      canvas.style.width = `${bounds.width}px`;
      canvas.style.height = `${bounds.height}px`;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

      tileSize = window.innerWidth < 680 ? 30 : 42;
      const columns = Math.ceil(bounds.width / tileSize);
      const rows = Math.ceil(bounds.height / tileSize);
      const hash = (column: number, row: number) => {
        const value = Math.sin(column * 127.1 + row * 311.7 + 19.19) * 43758.5453;
        return value - Math.floor(value);
      };

      tiles = [];
      for (let row = 0; row < rows; row += 1) {
        for (let column = 0; column < columns; column += 1) {
          const upwardProgress = (rows - 1 - row) / Math.max(1, rows - 1);
          const stagger = upwardProgress * 0.54 + hash(column, row) * 0.46;
          tiles.push({ x: column * tileSize, y: row * tileSize, delay: stagger });
        }
      }
    };

    const drawFrame = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      const bounds = footer.getBoundingClientRect();
      const revealDistance = Math.max(1, Math.min(bounds.height, window.innerHeight));
      const progress = Math.max(0, Math.min(1, (window.innerHeight - bounds.top) / revealDistance));
      footer.style.setProperty("--pixel-progress", progress.toFixed(4));
      footer.classList.toggle("is-pixel-content-visible", progress >= 0.8);
      footer.classList.toggle("is-pixel-complete", progress >= 1);
      tiles.forEach((tile) => {
        const localProgress = Math.max(0, Math.min(1, (progress - tile.delay * 0.76) / 0.24));
        if (localProgress <= 0) return;
        const eased = 1 - (1 - localProgress) ** 3;
        const size = tileSize * eased;
        context.fillStyle = "#ffffff";
        context.fillRect(tile.x + (tileSize - size) / 2, tile.y + (tileSize - size) / 2, size + 0.5, size + 0.5);
      });
      animationFrame = 0;
    };

    const requestDraw = () => {
      if (!animationFrame) animationFrame = window.requestAnimationFrame(drawFrame);
    };

    createTiles();
    requestDraw();
    window.addEventListener("scroll", requestDraw, { passive: true });

    const resize = () => {
      createTiles();
      requestDraw();
    };
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("scroll", requestDraw);
      window.removeEventListener("resize", resize);
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => setExpanded(true), 700);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const overview = overviewRef.current;
    if (!overview) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const start = overview.getBoundingClientRect().top + window.scrollY;
      const progress = Math.max(0, Math.min(1, (window.scrollY - start) / Math.max(1, window.innerHeight)));
      const helpsProgress = Math.max(0, Math.min(1, (progress - 0.05) / 0.6));
      if (helpsPanelRef.current) {
        helpsPanelRef.current.style.transform = `translate3d(${(1 - helpsProgress) * 100}%, 0, 0)`;
        helpsPanelRef.current.style.setProperty("--helps-reveal", helpsProgress.toFixed(4));
      }
      const convergence = Math.max(0, Math.min(1, progress / 0.5));
      const pluses = [
        [".copy-plus-top-left", 0, 0],
        [".copy-plus-top-right", 100, 0],
        [".copy-plus-bottom-left", 0, 100],
        [".copy-plus-bottom-right", 100, 100],
      ] as const;
      pluses.forEach(([selector, startX, startY]) => {
        const plus = overview.querySelector<HTMLElement>(selector);
        if (!plus) return;
        plus.style.left = `${startX + (50 - startX) * convergence}%`;
        plus.style.top = `${startY + (100 - startY) * convergence}%`;
        plus.style.opacity = `${Math.max(0, 1 - Math.max(0, progress - 0.3) / 0.25)}`;
      });
      overview.style.setProperty("--line-scale", Math.max(0, Math.min(1, (progress - 0.5) / 0.5)).toFixed(4));
      overview.style.setProperty("--line-opacity", Math.max(0, Math.min(1, (progress - 0.5) / 0.15)).toFixed(4));
    };
    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    requestUpdate();
    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    const transition = transitionRef.current;
    if (!transition) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const start = transition.getBoundingClientRect().top + window.scrollY;
      const revealDistance = Math.max(1, window.innerHeight * 1.15);
      const progress = Math.max(0, Math.min(1, (window.scrollY - start) / revealDistance));
      transition.style.setProperty("--page-rise", progress.toFixed(4));
    };
    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    requestUpdate();
    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    const journey = intelligenceRef.current;
    if (!journey) return;
    const header = overviewRef.current?.querySelector<HTMLElement>(".imdx-page-header");
    const intelligenceFront = journey.querySelector<HTMLElement>(".intelligence-front");
    const servicesPage = journey.parentElement?.querySelector<HTMLElement>(".services-page");
    const standardsPage = journey.parentElement?.querySelector<HTMLElement>(".wtc-page");
    const footerPage = journey.parentElement?.querySelector<HTMLElement>(".site-footer");
    const servicesRows = servicesPage?.querySelectorAll<HTMLElement>(".services-row") ?? [];
    const standardsRevealElements = standardsPage?.querySelectorAll<HTMLElement>("[data-wtc-reveal]") ?? [];
    const tabs = header?.querySelectorAll<HTMLElement>(".imdx-page-tab") ?? [];
    const strength = strengthSectionRef.current;
    let frame = 0;
    const clamp01 = (value: number) => Math.max(0, Math.min(1, value));
    const smooth = (value: number) => {
      const progress = clamp01(value);
      return progress * progress * (3 - 2 * progress);
    };
    const update = () => {
      frame = 0;
      const start = journey.getBoundingClientRect().top + window.scrollY;
      const distance = Math.max(1, journey.offsetHeight - window.innerHeight);
      const progress = clamp01((window.scrollY - start) / distance);
      const markerY = window.scrollY + Math.min(window.innerHeight * 0.28, 240);
      const pageTop = (element: HTMLElement | null | undefined) => element ? element.getBoundingClientRect().top + window.scrollY : Number.POSITIVE_INFINITY;
      const overviewTop = pageTop(overviewRef.current);
      const strengthTop = pageTop(strength);
      const journeyTop = pageTop(journey);
      const servicesTop = pageTop(servicesPage);
      const standardsTop = pageTop(standardsPage);
      const footerTop = pageTop(footerPage);
      const rangeProgress = (from: number, to: number) => clamp01((markerY - from) / Math.max(1, to - from));
      let activeSection: string;
      let sectionProgress: number;
      if (markerY < strengthTop) {
        activeSection = "imdx";
        sectionProgress = rangeProgress(overviewTop, strengthTop);
      } else if (markerY < journeyTop) {
        activeSection = "strength";
        sectionProgress = rangeProgress(strengthTop, journeyTop);
      } else if (markerY < servicesTop) {
        if (progress < 0.5) {
          activeSection = "intelligence";
          sectionProgress = clamp01(progress / 0.5);
        } else if (progress < 0.82) {
          activeSection = "applications";
          sectionProgress = clamp01((progress - 0.5) / 0.32);
        } else {
          activeSection = "members";
          sectionProgress = clamp01((progress - 0.82) / 0.18);
        }
      } else if (markerY < standardsTop) {
        activeSection = "inside";
        sectionProgress = rangeProgress(servicesTop, standardsTop);
      } else {
        activeSection = "standards";
        sectionProgress = rangeProgress(standardsTop, footerTop);
      }
      const activeIndex = Array.from(tabs).findIndex((tab) => tab.dataset.section === activeSection);
      if (clickedTabRef.current === activeSection) {
        clickedTabReachedRef.current = true;
      } else if (clickedTabReachedRef.current) {
        clickedTabRef.current = null;
        clickedTabReachedRef.current = false;
      }
      tabs.forEach((tab, index) => {
        const isCurrent = index === activeIndex;
        const isPassed = activeIndex >= 0 && index < activeIndex;
        tab.classList.toggle("is-current", isCurrent);
        tab.classList.toggle("is-passed", isPassed);
        const wasClicked = tab.dataset.section === clickedTabRef.current;
        tab.style.setProperty("--tab-progress", `${isPassed || wasClicked ? 100 : isCurrent ? sectionProgress * 100 : 0}%`);
      });
      const servicesEntryProgress = servicesPage
        ? clamp01((window.innerHeight - servicesPage.getBoundingClientRect().top) / window.innerHeight)
        : 0;
      const servicesHeadingReveal = clamp01((servicesEntryProgress - 0.25) / 0.25);
      // Keep the overview palette through the expansion; switch only when the
      // gradient has reached its full viewport size (entry progress is complete).
      header?.classList.toggle("is-intelligence-header", progress >= 0.23);
      const style = journey.querySelector<HTMLElement>(".intelligence-stage");
      if (!style) return;
      style.style.setProperty("--journey-progress", progress.toFixed(4));
      const entry = smooth(progress / 0.23);
      style.style.setProperty("--entry-progress", entry.toFixed(4));
      const isCompact = window.matchMedia("(max-width: 680px)").matches;
      const backgroundScaleX = isCompact ? 0.66 + entry * 0.34 : 0.58 + entry * 0.42;
      const backgroundScaleY = isCompact ? 0.76 + entry * 0.24 : 0.68 + entry * 0.32;
      const rightEdge = 500 + 500 * backgroundScaleX;
      const topEdge = 350 - 350 * backgroundScaleY;
      const cornerRadius = (isCompact ? 28 : 42) * (1 - entry) * backgroundScaleY;
      const radiusInViewBox = cornerRadius * 700 / Math.max(1, window.innerHeight);
      upperWingRef.current?.setAttribute(
        "d",
        `M ${rightEdge.toFixed(2)} ${(topEdge + radiusInViewBox).toFixed(2)} C ${(rightEdge + 80).toFixed(2)} ${(topEdge + radiusInViewBox).toFixed(2)}, 965 95, 1000 0`,
      );
      lowerWingRef.current?.setAttribute(
        "d",
        `M ${(1000 - rightEdge).toFixed(2)} ${(700 - topEdge - radiusInViewBox).toFixed(2)} C ${(920 - rightEdge).toFixed(2)} ${(700 - topEdge - radiusInViewBox).toFixed(2)}, 45 615, 0 700`,
      );
      if (intelligenceFront) {
        const frontScale = isCompact ? 0.5 + entry * 0.5 : 0.42 + entry * 0.58;
        const clipX = ((1 - backgroundScaleX / frontScale) / 2) * 100;
        const clipY = ((1 - backgroundScaleY / frontScale) / 2) * 100;
        const baseRadius = isCompact ? 28 : 42;
        intelligenceFront.style.setProperty("--front-clip-x", `${clipX.toFixed(3)}%`);
        intelligenceFront.style.setProperty("--front-clip-y", `${clipY.toFixed(3)}%`);
        intelligenceFront.style.setProperty("--front-clip-radius", `${(baseRadius * (1 - entry) / frontScale).toFixed(2)}px`);
      }
      style.style.setProperty("--applications-progress", smooth((progress - 0.32) / 0.18).toFixed(4));
      style.style.setProperty("--members-progress", smooth((progress - 0.68) / 0.22).toFixed(4));
      servicesPage?.style.setProperty("--services-heading-reveal", servicesHeadingReveal.toFixed(3));
      servicesRows.forEach((row) => {
        const rowTop = row.getBoundingClientRect().top;
        const riseDistance = window.innerHeight * 0.2;
        const rowReveal = clamp01((window.innerHeight - rowTop) / riseDistance);
        const lineReveal = clamp01((window.innerHeight - rowTop) / (riseDistance * 0.8));
        row.style.setProperty("--service-row-reveal", rowReveal.toFixed(3));
        row.style.setProperty("--service-rule-reveal", lineReveal.toFixed(3));
      });
      standardsRevealElements.forEach((element) => {
        const elementTop = element.getBoundingClientRect().top;
        const reveal = clamp01((window.innerHeight - elementTop) / (window.innerHeight * 0.2));
        element.style.setProperty("--wtc-reveal", reveal.toFixed(3));
      });
    };
    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    requestUpdate();
    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      if (frame) window.cancelAnimationFrame(frame);
      header?.classList.remove("is-intelligence-header");
    };
  }, []);

  const showIntelligenceLayer = (targetProgress: number) => {
    const journey = intelligenceRef.current;
    if (!journey) return;
    const start = journey.getBoundingClientRect().top + window.scrollY;
    const distance = Math.max(1, journey.offsetHeight - window.innerHeight);
    window.scrollTo({ top: start + distance * targetProgress, behavior: "smooth" });
  };

  const navigateToSection = (section: string) => {
    const intelligenceTargets: Record<string, number> = {
      intelligence: 0.28,
      applications: 0.54,
      members: 0.94,
    };
    if (section in intelligenceTargets) {
      showIntelligenceLayer(intelligenceTargets[section]);
      return;
    }

    const targets: Record<string, HTMLElement | null> = {
      imdx: overviewRef.current,
      strength: strengthSectionRef.current,
      inside: overviewRef.current?.querySelector<HTMLElement>(".services-page") ?? null,
      standards: overviewRef.current?.querySelector<HTMLElement>(".wtc-page") ?? null,
    };
    targets[section]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const selectSectionTab = (section: string) => {
    clickedTabRef.current = section;
    clickedTabReachedRef.current = false;
    navigateToSection(section);
  };

  const pageContent = (
    <>
      <header className="imdx-page-header">
        <nav className="imdx-page-tabs" aria-label="IMDX sections">
          <a className="imdx-page-tab is-current" data-section="imdx" href="#imdx-overview" onClick={(event) => { event.preventDefault(); selectSectionTab("imdx"); }}>IMDX</a>
          <a className="imdx-page-tab" data-section="strength" href="#our-strength" onClick={(event) => { event.preventDefault(); selectSectionTab("strength"); }}>Our strength &amp; How we help</a>
          <a className="imdx-page-tab" data-section="intelligence" href="#intelligence-layer" onClick={(event) => { event.preventDefault(); selectSectionTab("intelligence"); }}>IntelligenceLayer</a>
          <a className="imdx-page-tab" data-section="applications" href="#applications" onClick={(event) => { event.preventDefault(); selectSectionTab("applications"); }}>Applications</a>
          <a className="imdx-page-tab" data-section="members" href="#member-exchange" onClick={(event) => { event.preventDefault(); selectSectionTab("members"); }}>MemberExchange</a>
          <a className="imdx-page-tab" data-section="inside" href="#inside-imdx" onClick={(event) => { event.preventDefault(); selectSectionTab("inside"); }}>InsideIMDX</a>
          <a className="imdx-page-tab" data-section="standards" href="#open-standards" onClick={(event) => { event.preventDefault(); selectSectionTab("standards"); }}>OpenStandards</a>
        </nav>
      </header>
      <div className="imdx-page-content">
        <div className="imdx-copy-frame">
          <span className="copy-plus copy-plus-top-left" aria-hidden="true" />
          <span className="copy-plus copy-plus-top-right" aria-hidden="true" />
        <h1 className="imdx-page-title">
          <span>The data exchange</span> built for Indian mobility
        </h1>
        <p className="imdx-page-description">
          IMDX lets companies and public bodies exchange mobility data on their own terms. Identity is verified, usage is contracted, payment is settled and every transfer is audited — while data moves directly between participants, never through our servers. The intelligence layer turns that data into decisions.
        </p>
          <span className="copy-plus copy-plus-bottom-left" aria-hidden="true" />
          <span className="copy-plus copy-plus-bottom-right" aria-hidden="true" />
        </div>
      </div>
    </>
  );

  return (
    <main className={`home-shell${expanded ? " is-expanded" : ""}`}>
      <section className="page-transition" ref={transitionRef} aria-label="Introduction and page transition">
       <div className="page-transition-sticky">
      <section className="hero-screen" aria-label="IMDX introduction">
        <video
          ref={backgroundVideoRef}
          className="display-video"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster="/images/hero-poster.svg"
          aria-hidden="true"
        >
          <source src="/videos/tractus-x-community-days.mp4" type="video/mp4" />
        </video>
        <div className="display-dim" aria-hidden="true" />
        <div className="display-dim-expanded" aria-hidden="true" />
        <div className="floating-accents" aria-hidden="true">
          <span className="floating-plus floating-plus-one" />
          <span className="floating-plus floating-plus-two" />
          <span className="floating-plus floating-plus-three" />
          <span className="floating-plus floating-plus-four" />
        </div>
        <div className="intro-content">
          <img className="imdx-logo" src="/images/imdx-logo-transparent.png" alt="IMDX — India Mobility Data Exchange" />
          <div className="summary-frame">
            <p className="imdx-summary">{summary}</p>
          </div>
        </div>
        <div className="hero-video-controls">
          <button className="hero-video-button hero-video-button-primary" type="button" onClick={openFullVideo}>
            Watch complete video
          </button>
        </div>
      </section>
        <div className={`video-modal-backdrop${watchingVideo ? " is-open" : ""}`} aria-hidden={!watchingVideo} role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget) closeFullVideo();
        }}>
          <section className="video-modal" role="dialog" aria-modal="true" aria-label="Complete IMDX video">
            <button className="video-modal-close" type="button" onClick={closeFullVideo} aria-label="Close video">×</button>
            <video
              ref={fullVideoRef}
              className="video-modal-player"
              controls
              playsInline
              preload="auto"
              onCanPlay={onFullVideoCanPlay}
              onPlaying={() => { setVideoLoading(false); setVideoError(null); }}
              onWaiting={() => setVideoLoading(true)}
              onError={() => {
                pendingVideoPlayRef.current = false;
                setVideoLoading(false);
                setVideoError("The video couldn’t load. Check the connection and retry.");
              }}
              onEnded={closeFullVideo}
            >
              <source src="/videos/tractus-x-community-days.mp4" type="video/mp4" />
            </video>
            {videoLoading && !videoError && (
              <div className="video-player-status" role="status">
                <span className="video-player-spinner" aria-hidden="true" />
                <span>Loading video…</span>
              </div>
            )}
            {videoError && (
              <div className="video-player-status video-player-error" role="alert">
                <p>{videoError}</p>
                <button type="button" onClick={retryFullVideo}>Try again</button>
              </div>
            )}
          </section>
        </div>
      <section className="imdx-page imdx-page-rising" aria-hidden="true">
        {pageContent}
      </section>
       </div>
      </section>
      <section className="imdx-page imdx-page-resting" id="imdx-overview" ref={overviewRef} aria-label="IMDX overview">
        {pageContent}
        <section className="imdx-strength-section" id="our-strength" ref={strengthSectionRef} aria-label="Our strength and how Tecmotiv helps">
          <div className="our-strength">
            <h2 id="strength-title">Our Strength</h2>
            <div className="strength-rows">
              {strengths.map((item) => (
                <article className="strength-row" key={item.title}>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </article>
              ))}
            </div>
          </div>
          <section className="helps-panel" ref={helpsPanelRef} aria-labelledby="helps-title">
            <h2 id="helps-title">How Tecmotiv Helps</h2>
            <div className="helps-rows">
              {helpItems.map((item) => (
                <article className="helps-row" key={item.title}>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </article>
              ))}
            </div>
          </section>
          <p className="strength-overview-summary">
            India Mobility Data Exchange (IMDX) is building a connected, trusted and interoperable data ecosystem for India&apos;s mobility sector. By bringing organisations, technologies and mobility data together, IMDX enables secure data exchange, intelligent applications and new opportunities for collaboration and innovation.
          </p>
        </section>
        <div className="intelligence-page-flow">
        <section className="intelligence-journey" ref={intelligenceRef} aria-label="IMDX intelligence layer">
          <div className="intelligence-stage">
            <svg className="intelligence-wings" viewBox="0 0 1000 700" preserveAspectRatio="none" aria-hidden="true">
              <path ref={upperWingRef} d="M 790 132 C 870 132, 965 95, 1000 0" />
              <path ref={lowerWingRef} d="M 210 568 C 130 568, 45 615, 0 700" />
            </svg>
            <div className="intelligence-gradient" aria-hidden="true" />
            <div className="intelligence-front">
              <header className="intelligence-brand">
                <img src="/images/imdx-wordmark-mask.svg" alt="IMDX" />
                <p>The data exchange built for Indian mobility</p>
              </header>
              <div className="intelligence-panels">
              <article
                className="intelligence-panel intelligence-panel-primary"
                id="intelligence-layer"
                role="button"
                tabIndex={0}
                aria-label="Show Intelligence Layer"
                onClick={() => showIntelligenceLayer(0.28)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    showIntelligenceLayer(0.28);
                  }
                }}
              >
                <p className="intelligence-kicker">IMDX / INTELLIGENCE LAYER</p>
                <h2>Intelligence Layer <span>&amp; Platform Building</span></h2>
                <p className="intelligence-subtitle">Analytics, AI and data-platform engineering that turn shared data into decisions</p>
                <div className="intelligence-divider" />
                <p className="intelligence-callout">Exchanging data is the starting point. The intelligence layer makes it useful.</p>
                <p className="intelligence-intro">Analytics, AI models, dashboards and APIs sit on top of IMDX. For organisations that need their own dataspace, Tecmotiv designs, builds and runs the platform.</p>
                <div className="intelligence-grid intelligence-grid-four">
                  {intelligenceItems.map((item, index) => (
                    <article className="intelligence-item" key={item.title}>
                      <span className="intelligence-number">{String(index + 1).padStart(2, "0")}</span>
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                    </article>
                  ))}
                </div>
              </article>
              <article
                className="intelligence-panel intelligence-panel-applications"
                id="applications"
                role="button"
                tabIndex={0}
                aria-label="Show Applications"
                onClick={() => showIntelligenceLayer(0.65)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    showIntelligenceLayer(0.65);
                  }
                }}
              >
                <p className="intelligence-kicker">IMDX / APPLICATIONS</p>
                <h2>Battery Passport, <span>Urban Planning, Urban Transport Planning</span></h2>
                <p className="intelligence-subtitle">Ready applications for compliance and for city and transport planners</p>
                <div className="intelligence-divider" />
                <p className="intelligence-callout">Three applications, one data foundation.</p>
                <p className="intelligence-intro">Each application draws on the same governed exchange, so the work done for one carries into the next.</p>
                <div className="intelligence-grid intelligence-grid-three">
                  {applicationItems.map((item, index) => (
                    <article className="intelligence-item" key={item.title}>
                      <span className="intelligence-number">{String(index + 1).padStart(2, "0")}</span>
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                    </article>
                  ))}
                </div>
              </article>
              <article
                className="intelligence-panel intelligence-panel-members"
                id="member-exchange"
                role="button"
                tabIndex={0}
                aria-label="Show Member Exchange"
                onClick={() => showIntelligenceLayer(0.94)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    showIntelligenceLayer(0.94);
                  }
                }}
              >
                <p className="intelligence-kicker">IMDX / MEMBER EXCHANGE</p>
                <h2>Exchange with <span>connectors</span></h2>
                <p className="intelligence-subtitle">Secure exchange through approved connectors. Registered login only.</p>
                <div className="intelligence-divider" />
                <p className="intelligence-callout">Secure exchange, for registered members only.</p>
                <p className="intelligence-intro">Connectors check identity, apply the usage rules each data owner sets, and move data directly between participants. There is no public catalogue and no public connector endpoint.</p>
                <div className="intelligence-grid intelligence-grid-two">
                  {memberItems.map((item, index) => (
                    <article className="intelligence-item" key={item.title}>
                      <span className="intelligence-number">{String(index + 1).padStart(2, "0")}</span>
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                    </article>
                  ))}
                </div>
              </article>
              </div>
            </div>
          </div>
        </section>
        <section className="services-page" id="inside-imdx" aria-label="Tecmotiv Services">
          <div className="services-heading-stack">
            <h2 className="services-title">Inside IMDX</h2>
            <p className="services-subheading">One exchange, seven controls</p>
            <p className="services-description">{servicesDescription}</p>
          </div>
          <div className="services-list" aria-label="Services">
            {serviceRows.map((service) => (
              <article className="services-row" key={service.title}>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </article>
            ))}
          </div>
        </section>
        <section className="wtc-page" id="open-standards" aria-label="Open standards">
          <div className="wtc-content">
            <header className="wtc-heading">
              <h2 className="wtc-title" data-wtc-reveal=""><span>Built on open</span><span>standards</span></h2>
              <p className="wtc-subheading" data-wtc-reveal="">Global protocols, Indian requirements</p>
              <p className="wtc-description" data-wtc-reveal="">
                IMDX is built on Eclipse Tractus-X EDC and the Dataspace Protocol, with the identity and policy standards used by European and Indian data spaces. It is interoperable by design — not locked to one vendor, one city or one cloud.
              </p>
            </header>
            <StandardsViews cards={standardsCards} />
          </div>
        </section>
        <footer className="site-footer" ref={footerRef} aria-label="IMDX footer">
          <canvas className="site-footer-pixels" ref={footerPixelsRef} aria-hidden="true" />
          <div className="site-footer-content">
            <div className="site-footer-top">
              <div className="site-footer-main">
                <img className="site-footer-logos" src="/images/imdx-logo.png" alt="IMDX — India Mobility Data Exchange" />
                <p className="site-footer-statement">IMDX is designed, built and operated by <span>Tecmotiv Solutions.</span></p>
              </div>
            </div>
            <div className="site-footer-bottom-row">
              <div className="site-footer-bottom-brand">
                <img src="/images/tecmotiv-logo.png" alt="Tecmotiv Solutions" />
              </div>
              <nav className="site-footer-nav" aria-label="Footer links">
                <a href="https://tecmotivsolutions.com" target="_blank" rel="noopener noreferrer">Tecmotiv Solutions</a>
                <a href="https://tecmotivsolutions.com/#contact" target="_blank" rel="noopener noreferrer">Contact</a>
                <a href="https://tecmotivsolutions.com/privacy-policy" target="_blank" rel="noopener noreferrer">Privacy</a>
              </nav>
            </div>
            <div className="site-footer-meta">
              <p>© 2026 Tecmotiv Solutions Pvt Ltd · Pune, India</p>
              <p>Built on Eclipse Tractus-X EDC.</p>
            </div>
          </div>
        </footer>
        </div>
      </section>
    </main>
  );
}

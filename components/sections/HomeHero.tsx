"use client";

import { useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";

type HomeContent = {
  navigation: { label: string; href: string }[];
  primaryAction: { label: string; href: string };
};

const whoDescription = "Tecmotiv is a strategic growth partner for global mobility and technology companies. We specialise in growth acceleration, strategic partnerships and market development, connecting companies with the right ecosystems across automotive, energy, digital and industrial sectors. We go beyond advice: partnerships, pilot programmes and deal closures with measurable commercial outcomes.";
const descriptionWords = whoDescription.split(" ");
const imdxDescription = "IMDX lets companies and public bodies exchange mobility data on their own terms, with identity checks, usage rules and approved connectors. Tecmotiv designs, builds and operates the platform and the intelligence on top of it.";
const imdxDescriptionWords = imdxDescription.split(" ");
const servicesDescription = "From initial market intelligence to deal closure and operational integration. We work where growth strategy, automotive, energy transition and digital innovation meet.";
const servicesDescriptionWords = servicesDescription.split(" ");
const serviceRows = [
  { title: "Growth Acceleration & Partnership", description: "Your dedicated growth partner: market access, channel development and strategic partnerships for rapid business expansion." },
  { title: "Automotive Solutions", description: "Navigate India's $250B automotive ecosystem, from first OEM meeting to serial production contract." },
  { title: "Energy & Sustainability", description: "Tap India's 500 GW clean energy mission: solar, EV infrastructure, green hydrogen and ESG advisory." },
  { title: "Mergers & Acquisitions", description: "End-to-end M&A advisory: target identification, JV structuring, technology licensing and deal closure." },
  { title: "Digital / Data / AI", description: "Leverage India's tech talent, GCC ecosystem and AI leadership for business transformation." },
  { title: "Technology Licensing & Joint Ventures", description: "Structuring high-value IP transfers and cross-border partnerships for long-term manufacturing success." },
  { title: "Strategic Investment Support", description: "Capital advisory and investment strategy to fuel expansion in emerging high-growth sectors." },
];
const wtcBenefits = [
  "Trade delegations and business missions into India",
  "Introductions to OEMs, Tier-1s, industry bodies and government",
  "Market-entry programmes and events, supported by Tecmotiv services",
  "IMDX access for partner network members",
];
const strengths = [
  { title: "Automotive", description: "Deep OEM and Tier-1 relationships. RFQ/RFI management, localisation strategy and supplier qualification support." },
  { title: "Energy", description: "Renewable energy market entry, EV infrastructure, green hydrogen and ESG advisory for global energy companies." },
  { title: "Digital / AI", description: "GCC setup advisory, AI and data partnerships, digital transformation roadmaps and technology vendor selection." },
];
const helpItems = [
  { title: "Representative Office", description: "Market presence without entity. We act as your India office — market assessment, OEM access, regulatory navigation." },
  { title: "Technology Licensing", description: "License your IP to Indian manufacturers. Identify licensees, structure royalty agreements, and protect intellectual property." },
  { title: "Joint Venture / M&A", description: "Target identification, due diligence, JV structuring, technology licensing, and investment facilitation." },
  { title: "Strategic Investment", description: "Identify investment targets and growth capital opportunities. Due diligence support, deal structuring, and post-investment integration advisory." },
];

const pixelSize = 3;
const pixelBlobs = [
  { x: -15, y: -5, rx: 23, ry: 18 },
  { x: 5, y: -14, rx: 19, ry: 15 },
  { x: 18, y: 0, rx: 23, ry: 18 },
  { x: 5, y: 15, rx: 19, ry: 16 },
  { x: -15, y: 13, rx: 16, ry: 14 },
];

function createPixelMask(width: number, height: number, x: number, y: number) {
  const paths: string[] = [];
  const offsetX = -(x % pixelSize);
  const offsetY = -(y % pixelSize);

  for (let row = -16; row <= 16; row += 1) {
    for (let column = -16; column <= 16; column += 1) {
      const centerX = offsetX + column * pixelSize + pixelSize / 2;
      const centerY = offsetY + row * pixelSize + pixelSize / 2;
      const insideBlob = pixelBlobs.some((blob, index) => {
        const dx = (centerX - blob.x) / blob.rx;
        const dy = (centerY - blob.y) / blob.ry;
        const ripple = 1 + 0.13 * Math.sin(column * 1.7 + row * 0.8 + index) + 0.08 * Math.cos(row * 1.4 - column);
        return dx * dx + dy * dy < ripple;
      });

      if (insideBlob) {
        const left = column * pixelSize + offsetX;
        const top = row * pixelSize + offsetY;
        paths.push(`M${left} ${top}h${pixelSize}v${pixelSize}h-${pixelSize}z`);
      }
    }
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><rect width="100%" height="100%" fill="white"/><path d="${paths.join("")}" fill="black" transform="translate(${x} ${y})"/></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

function applyPixelMask(element: HTMLElement, mask: string) {
  element.style.maskImage = mask;
  element.style.webkitMaskImage = mask;
  element.style.setProperty("mask-mode", "luminance");
  element.style.setProperty("-webkit-mask-source-type", "luminance");
  element.style.maskSize = "100% 100%";
  element.style.webkitMaskSize = "100% 100%";
  element.style.maskRepeat = "no-repeat";
  element.style.setProperty("-webkit-mask-repeat", "no-repeat");
}

export function HomeHero({ content }: { content: HomeContent }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const scrollProgressRef = useRef(0);
  const [motionAllowed, setMotionAllowed] = useState(false);

  useLayoutEffect(() => {
    const previousScrollRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    return () => {
      window.history.scrollRestoration = previousScrollRestoration;
    };
  }, []);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const compactLayout = window.matchMedia("(max-width: 680px)");
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    const updateMotionPreference = () => {
      setMotionAllowed(!reducedMotion.matches && !compactLayout.matches && !connection?.saveData);
    };

    updateMotionPreference();
    reducedMotion.addEventListener("change", updateMotionPreference);
    compactLayout.addEventListener("change", updateMotionPreference);
    return () => {
      reducedMotion.removeEventListener("change", updateMotionPreference);
      compactLayout.removeEventListener("change", updateMotionPreference);
    };
  }, []);

  useEffect(() => {
    const stage = stageRef.current;
    const screen = stage?.querySelector<HTMLElement>(".hero-screen");
    const pixelLayer = stage?.querySelector<HTMLElement>(".display-pixel-layer");
    if (!stage || !screen) return;
    const nextPage = stage.querySelector<HTMLElement>(".next-page");
    const servicesPage = stage.parentElement?.querySelector<HTMLElement>(".services-page");
    const wtcPage = stage.parentElement?.querySelector<HTMLElement>(".wtc-page");
    const servicesDescriptionWordsElements = servicesPage?.querySelectorAll<HTMLElement>(".services-word") ?? [];
    const servicesRows = servicesPage?.querySelectorAll<HTMLElement>(".services-row") ?? [];
    const wtcRevealElements = wtcPage?.querySelectorAll<HTMLElement>("[data-wtc-reveal]") ?? [];
    const descriptionWordsElements = stage.querySelectorAll<HTMLElement>(".who-word");
    const imdxDescriptionWordsElements = stage.querySelectorAll<HTMLElement>(".imdx-word");
    const orbitPluses = stage.querySelectorAll<HTMLElement>(".who-plus");
    const strengthHeading = stage.querySelector<HTMLElement>(".strength-heading-wrap");
    const helpHeading = stage.querySelector<HTMLElement>(".help-heading-wrap");
    const previousPlusOffsets = new WeakMap<HTMLElement, { x: number; y: number }>();
    // Keep the first four sections in order, then reserve the final range for the next page reveal.
    const existingSequenceEnd = 0.86;
    const fifthPageFullyOpen = 0.97;
    const intelligenceWordIndex = imdxDescriptionWords.findIndex((word) => word.toLowerCase().startsWith("intelligence"));
    const firstWindowStart = fifthPageFullyOpen + (1 - fifthPageFullyOpen) * (intelligenceWordIndex / imdxDescriptionWords.length);
    const windowStep = 0.045;
    const firstWindowStop = firstWindowStart + windowStep;
    const secondWindowStop = firstWindowStop + windowStep;
    const thirdWindowStop = secondWindowStop + windowStep;
    const scrollStops = [0.16, 0.63, 0.86, 0.99].map((point) => point * existingSequenceEnd)
      .concat(fifthPageFullyOpen, firstWindowStop, secondWindowStop, thirdWindowStop);
    let wheelLockUntil = 0;
    let wheelLockDirection = 0;

    let frame = 0;
    const updateProgress = () => {
      frame = 0;
      const distance = Math.max(1, window.innerHeight * 5.2);
      const stageTop = stage.getBoundingClientRect().top + window.scrollY;
      const progress = Math.max(0, (window.scrollY - stageTop) / distance);
      const servicesEntryProgress = servicesPage
        ? Math.max(0, Math.min(1, (window.innerHeight - servicesPage.getBoundingClientRect().top) / window.innerHeight))
        : 0;
      const servicesSubheadingReveal = Math.max(0, Math.min(1, servicesEntryProgress / 0.25));
      const servicesHeadingReveal = Math.max(0, Math.min(1, (servicesEntryProgress - 0.25) / 0.25));
      const servicesDescriptionReveal = Math.max(0, Math.min(1, (servicesEntryProgress - 0.45) / 0.5));
      const sequenceProgress = Math.min(1, progress / existingSequenceEnd);
      const nextPageReveal = Math.max(0, Math.min(1, (progress - existingSequenceEnd) / (fifthPageFullyOpen - existingSequenceEnd)));
      const imdxTitleReveal = nextPageReveal;
      const imdxSubheadingReveal = nextPageReveal;
      const imdxStackTop = (nextPage?.clientHeight ?? window.innerHeight) * (1 - nextPageReveal);
      const imdxDescriptionReveal = Math.max(0, Math.min(1, (progress - fifthPageFullyOpen) / (1 - fifthPageFullyOpen)));
      const windowReveals = [
        Math.max(0, Math.min(1, (progress - firstWindowStart) / windowStep)),
        Math.max(0, Math.min(1, (progress - firstWindowStop) / windowStep)),
        Math.max(0, Math.min(1, (progress - secondWindowStop) / windowStep)),
      ];
      const reveal = Math.max(0, Math.min(1, sequenceProgress / 0.16));
      const pageReveal = Math.max(0, Math.min(1, (sequenceProgress - 0.18) / 0.24));
      const descriptionReveal = Math.max(0, Math.min(1, (sequenceProgress - 0.35) / 0.28));
      const whoStrikeReveal = Math.max(0, Math.min(1, (sequenceProgress - 0.65) / 0.08));
      const nextSectionReveal = Math.max(0, Math.min(1, (sequenceProgress - 0.74) / 0.12));
      const strengthReveal = nextSectionReveal;
      const helpReveal = Math.max(0, Math.min(1, (sequenceProgress - 0.87) / 0.12));
      scrollProgressRef.current = progress;
      screen.style.setProperty("--scroll-progress", progress.toFixed(3));
      screen.style.setProperty("--logo-reveal", reveal.toFixed(3));
      screen.style.setProperty("--header-reveal", reveal.toFixed(3));
      screen.style.setProperty("--page-reveal", pageReveal.toFixed(3));
      screen.style.setProperty("--page-clip", `${((1 - pageReveal) * 100).toFixed(2)}%`);
      screen.style.setProperty("--who-rise", `${(window.innerHeight * 0.46 * (1 - pageReveal)).toFixed(1)}px`);
      screen.style.setProperty("--description-reveal", descriptionReveal.toFixed(3));
      screen.style.setProperty("--description-rise", `${((1 - descriptionReveal) * 34).toFixed(1)}px`);
      screen.style.setProperty("--who-strike-reveal", whoStrikeReveal.toFixed(3));
      screen.style.setProperty("--next-section-reveal", nextSectionReveal.toFixed(3));
      screen.style.setProperty("--strength-reveal", strengthReveal.toFixed(3));
      screen.style.setProperty("--help-reveal", helpReveal.toFixed(3));
      screen.style.setProperty("--next-page-reveal", nextPageReveal.toFixed(3));
      screen.style.setProperty("--imdx-title-reveal", imdxTitleReveal.toFixed(3));
      screen.style.setProperty("--imdx-subheading-reveal", imdxSubheadingReveal.toFixed(3));
      screen.style.setProperty("--imdx-stack-top", `${imdxStackTop.toFixed(1)}px`);
      screen.style.setProperty("--imdx-text-blur", `${((1 - nextPageReveal) * 12).toFixed(1)}px`);
      servicesPage?.style.setProperty("--services-subheading-reveal", servicesSubheadingReveal.toFixed(3));
      servicesPage?.style.setProperty("--services-heading-reveal", servicesHeadingReveal.toFixed(3));
      const activeServicesWordPosition = servicesDescriptionReveal * servicesDescriptionWordsElements.length;
      servicesDescriptionWordsElements.forEach((word, index) => {
        const wordReveal = Math.max(0, Math.min(1, activeServicesWordPosition - index));
        word.style.opacity = wordReveal.toFixed(3);
      });
      servicesRows.forEach((row) => {
        const rowTop = row.getBoundingClientRect().top;
        const riseDistance = window.innerHeight * 0.2;
        const rowReveal = Math.max(0, Math.min(1, (window.innerHeight - rowTop) / riseDistance));
        const lineReveal = Math.max(0, Math.min(1, (window.innerHeight - rowTop) / (riseDistance * 0.8)));
        row.style.setProperty("--service-row-reveal", rowReveal.toFixed(3));
        row.style.setProperty("--service-rule-reveal", lineReveal.toFixed(3));
      });
      wtcRevealElements.forEach((element) => {
        const elementTop = element.getBoundingClientRect().top;
        const elementReveal = Math.max(0, Math.min(1, (window.innerHeight - elementTop) / (window.innerHeight * 0.18)));
        element.style.setProperty("--wtc-reveal", elementReveal.toFixed(3));
      });
      windowReveals.forEach((value, index) => {
        screen.style.setProperty(`--imdx-window-${index + 1}`, value.toFixed(3));
      });
      screen.dataset.fifthPageActive = progress >= existingSequenceEnd ? "true" : "false";
      const palette = [[69, 192, 178], [0, 165, 195], [57, 135, 207]] as const;
      palette.forEach(([red, green, blue], index) => {
        const scale = 1 - helpReveal;
        screen.style.setProperty(`--strength-color-${index + 1}`, `${Math.round(red * scale)} ${Math.round(green * scale)} ${Math.round(blue * scale)}`);
        const helpScale = 1 - nextPageReveal;
        screen.style.setProperty(`--help-color-${index + 1}`, `${Math.round(red * helpScale)} ${Math.round(green * helpScale)} ${Math.round(blue * helpScale)}`);
      });
      if (strengthHeading && helpHeading) {
        const strength = strengthHeading.getBoundingClientRect();
        const help = helpHeading.getBoundingClientRect();
        const helpSectionOffset = (1 - helpReveal) * 46;
        const strengthCenterX = strength.left + strength.width / 2;
        const strengthCenterY = strength.top + strength.height / 2;
        const helpCenterX = help.left + help.width / 2;
        const helpCenterY = help.top + help.height / 2 - helpSectionOffset;
        const strengthTargets: Record<string, [number, number]> = {
          top: [strengthCenterX, strength.top - 24],
          left: [strength.left - 24, strengthCenterY],
          right: [strength.right + 24, strengthCenterY],
          bottom: [strengthCenterX, strength.bottom + 24],
        };
        const helpTargets: Record<string, [number, number]> = {
          top: [helpCenterX, help.top - helpSectionOffset - 24],
          left: [help.left - 24, helpCenterY],
          right: [help.right + 24, helpCenterY],
          bottom: [helpCenterX, help.bottom - helpSectionOffset + 24],
        };
        const screenBounds = screen.getBoundingClientRect();
        const nextPageBounds = nextPage?.getBoundingClientRect() ?? screenBounds;
        const nextPageEdge = nextPageBounds.top + (1 - nextPageReveal) * nextPageBounds.height;
        const plusRowY = nextPageEdge - 24;
        orbitPluses.forEach((plus, index) => {
          const position = plus.dataset.plusPosition ?? "top";
          const [strengthX, strengthY] = strengthTargets[position];
          const [helpX, helpY] = helpTargets[position];
          const sectionX = strengthX + (helpX - strengthX) * helpReveal;
          const sectionY = strengthY + (helpY - strengthY) * helpReveal;
          const pageX = screenBounds.left + (screenBounds.width * (index + 1)) / (orbitPluses.length + 1);
          const targetX = sectionX + (pageX - sectionX) * nextPageReveal;
          const targetY = sectionY + (plusRowY - sectionY) * nextPageReveal;
          const bounds = plus.getBoundingClientRect();
          const previous = previousPlusOffsets.get(plus) ?? { x: 0, y: 0 };
          const sourceX = bounds.left + bounds.width / 2 - previous.x;
          const sourceY = bounds.top + bounds.height / 2 - previous.y;
          const x = (targetX - sourceX) * strengthReveal;
          const y = (targetY - sourceY) * strengthReveal;
          plus.style.translate = `${x.toFixed(1)}px ${y.toFixed(1)}px`;
          previousPlusOffsets.set(plus, { x, y });
        });
      }
      const activeWordPosition = descriptionReveal * descriptionWordsElements.length;
      descriptionWordsElements.forEach((word, index) => {
        const wordReveal = Math.max(0, Math.min(1, activeWordPosition - index));
        word.style.opacity = wordReveal.toFixed(3);
      });
      const activeImdxWordPosition = imdxDescriptionReveal * imdxDescriptionWordsElements.length;
      imdxDescriptionWordsElements.forEach((word, index) => {
        const wordReveal = Math.max(0, Math.min(1, activeImdxWordPosition - index));
        word.style.opacity = wordReveal.toFixed(3);
      });
      const headerChannel = Math.round(255 * (1 - pageReveal));
      screen.style.setProperty("--header-ink", `rgb(${headerChannel}, ${headerChannel}, ${headerChannel})`);
      if (progress > 0 && pixelLayer) {
        pixelLayer.style.maskImage = "none";
        pixelLayer.style.webkitMaskImage = "none";
      }
    };
    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(updateProgress);
    };
    const holdFastWheelScroll = (event: WheelEvent) => {
      if (event.deltaY === 0) return;

      const direction = Math.sign(event.deltaY);
      const now = performance.now();
      if (now < wheelLockUntil) {
        if (direction === wheelLockDirection) {
          event.preventDefault();
          return;
        }
        wheelLockUntil = 0;
      }

      const distance = Math.max(1, window.innerHeight * 5.2);
      const stageTop = stage.getBoundingClientRect().top + window.scrollY;
      const currentProgress = Math.max(0, (window.scrollY - stageTop) / distance);
      const deltaPixels = event.deltaY * (event.deltaMode === WheelEvent.DOM_DELTA_LINE ? 16 : event.deltaMode === WheelEvent.DOM_DELTA_PAGE ? window.innerHeight : 1);
      const destinationProgress = Math.max(0, (window.scrollY + deltaPixels - stageTop) / distance);
      const stop = direction > 0
        ? scrollStops.find((point) => point > currentProgress + 0.001 && point <= destinationProgress + 0.001)
        : [...scrollStops].reverse().find((point) => point < currentProgress - 0.001 && point >= destinationProgress - 0.001);

      if (stop === undefined) return;

      event.preventDefault();
      wheelLockDirection = direction;
      wheelLockUntil = now + 700;
      window.scrollTo({ top: stageTop + stop * distance, behavior: "smooth" });
    };

    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    window.addEventListener("wheel", holdFastWheelScroll, { passive: false });
    requestUpdate();
    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      window.removeEventListener("wheel", holdFastWheelScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  function updatePointer(event: PointerEvent<HTMLElement>) {
    if (scrollProgressRef.current > 0 || event.pointerType === "touch") return;
    const display = event.currentTarget.querySelector<HTMLElement>(".display-pixel-layer");
    if (!display) return;

    const bounds = display.getBoundingClientRect();
    const x = event.clientX - bounds.left;
    const y = event.clientY - bounds.top;
    if (x < 0 || y < 0 || x > bounds.width || y > bounds.height) {
      display.style.maskImage = "none";
      display.style.webkitMaskImage = "none";
      return;
    }

    applyPixelMask(display, createPixelMask(bounds.width, bounds.height, x, y));
  }

  function clearPointer(event: PointerEvent<HTMLElement>) {
    const display = event.currentTarget.querySelector<HTMLElement>(".display-pixel-layer");
    if (!display) return;
    display.style.maskImage = "none";
    display.style.webkitMaskImage = "none";
  }

  function navigateToImdxWindow(windowIndex: 1 | 2) {
    const stage = stageRef.current;
    if (!stage) return;

    const fifthPageFullyOpen = 0.97;
    const intelligenceWordIndex = imdxDescriptionWords.findIndex((word) => word.toLowerCase().startsWith("intelligence"));
    const firstWindowStart = fifthPageFullyOpen + (1 - fifthPageFullyOpen) * (intelligenceWordIndex / imdxDescriptionWords.length);
    const windowStep = 0.045;
    const targetProgress = firstWindowStart + windowStep * windowIndex;
    const distance = Math.max(1, window.innerHeight * 5.2);
    const stageTop = stage.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: stageTop + targetProgress * distance, behavior: "smooth" });
  }

  function handleWindowKeyDown(event: KeyboardEvent<HTMLElement>, windowIndex: 1 | 2) {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    navigateToImdxWindow(windowIndex);
  }

  return (
    <main className="home-shell">
      <div className="hero-stage" ref={stageRef}>
      <section
        aria-label="Tecmotiv Solutions"
        className="hero-screen"
        onPointerMove={updatePointer}
        onPointerLeave={clearPointer}
      >
          {motionAllowed && (
            <>
              <div className="display-media" aria-hidden="true">
                <video
                  className="display-video"
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  poster="/images/hero-poster.svg"
                >
                  <source src="/videos/tractus-x-community-days.mp4" type="video/mp4" />
                </video>
              </div>
              <div className="display-pixel-layer" aria-hidden="true">
                <div className="display-pixels" />
                <div className="display-vignette" />
              </div>
            </>
          )}

          <div className="brand-lockup" aria-label="Tecmotiv Solutions">
            <img className="brand-symbol" src="/images/tecmotiv-symbol.png" alt="" aria-hidden="true" />
            <img className="brand-wordmark" src="/images/tecmotiv-wordmark.png" alt="Tecmotiv Solutions" />
          </div>

          <section className="rising-page" aria-label="Who we are">
            <div className="who-intro">
              <div className="who-title-group">
                <span className="who-plus who-plus-top" data-plus-position="top" aria-hidden="true">+</span>
                <span className="who-plus who-plus-left" data-plus-position="left" aria-hidden="true">+</span>
                <span className="who-plus who-plus-right" data-plus-position="right" aria-hidden="true">+</span>
                <span className="who-plus who-plus-bottom" data-plus-position="bottom" aria-hidden="true">+</span>
                <div className="who-eyebrow-switch">
                  <p className="who-eyebrow who-eyebrow-old">Who we are?</p>
                  <p className="who-eyebrow who-eyebrow-new">Why Partner with us?</p>
                </div>
                <h1 className="who-headline">
                  <span>Your Partner in Building</span>
                  <em>What’s Next.</em>
                </h1>
              </div>
              <p className="who-description" aria-label={whoDescription}>
                {descriptionWords.map((word, index) => {
                  return (
                    <span
                      className="who-word"
                      aria-hidden="true"
                      key={index}
                      style={{ color: "#101313", opacity: 0 }}
                    >
                      {word}
                    </span>
                  );
                })}
              </p>
            </div>
            <section className="strength-section" aria-label="Our strengths">
              <div className="strength-heading-wrap">
                <h2 className="strength-heading">Our Strength</h2>
              </div>
              <div className="strength-list">
                {strengths.map((strength) => (
                  <article className="strength-item" key={strength.title}>
                    <h3>{strength.title}</h3>
                    <p>{strength.description}</p>
                  </article>
                ))}
              </div>
            </section>
            <section className="help-section" aria-label="How we help">
              <div className="help-heading-wrap">
                <h2 className="help-heading"><span>How Tecmotiv</span><span>Helps</span></h2>
              </div>
              <div className="help-list">
                {helpItems.map((item) => (
                  <article className="help-item" key={item.title}>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </article>
                ))}
              </div>
            </section>
            <section className="next-page" aria-label="IMDX">
              <div className="imdx-content">
                <div className="imdx-heading-stack">
                  <h2 className="imdx-title">IMDX</h2>
                  <p className="imdx-subheading">The data exchange built for Indian mobility</p>
                </div>
                <p className="imdx-description" aria-label={imdxDescription}>
                  {imdxDescriptionWords.map((word, index) => (
                    <span className="imdx-word" aria-hidden="true" key={index} style={{ opacity: 0 }}>
                      {word}
                    </span>
                  ))}
                </p>
                <div className="imdx-windows">
                  <article className="imdx-window imdx-window-one" aria-label="Intelligence Layer and Platform Building" role="button" tabIndex={0} onClick={() => navigateToImdxWindow(1)} onKeyDown={(event) => handleWindowKeyDown(event, 1)}>
                    <header className="imdx-feature-heading">
                      <p className="imdx-feature-kicker">IMDX <span> / </span> INTELLIGENCE LAYER</p>
                      <h3 className="imdx-feature-title">Intelligence Layer <span>&amp; Platform Building</span></h3>
                      <p className="imdx-feature-subheading">Analytics, AI and data-platform engineering that turn shared data into decisions</p>
                      <div className="imdx-feature-rule" aria-hidden="true" />
                    </header>
                    <div className="imdx-feature-copy">
                      <p className="imdx-feature-lead">Exchanging data is the starting point. The intelligence layer makes it useful.</p>
                      <p className="imdx-feature-description">Analytics, AI models, dashboards and APIs sit on top of IMDX. For organisations that need their own dataspace, Tecmotiv designs, builds and runs the platform.</p>
                      <ul className="imdx-feature-list">
                        <li><span className="imdx-capability-number">01</span><div><strong>Catalogue</strong><span>Common definitions so data from different sources can be compared and combined.</span></div></li>
                        <li><span className="imdx-capability-number">02</span><div><strong>Analytics</strong><span>Forecasting, anomaly detection, optimisation and scoring on shared data.</span></div></li>
                        <li><span className="imdx-capability-number">03</span><div><strong>Platform</strong><span>Architecture, open-source stack, identity, onboarding, hosting and operations.</span></div></li>
                        <li><span className="imdx-capability-number">04</span><div><strong>Integration</strong><span>Connectors and APIs to ERP, PLM, telematics, charging and city systems.</span></div></li>
                      </ul>
                    </div>
                  </article>
                  <article className="imdx-window imdx-window-two" aria-label="Battery passport and urban planning applications" role="button" tabIndex={0} onClick={() => navigateToImdxWindow(2)} onKeyDown={(event) => handleWindowKeyDown(event, 2)}>
                    <header className="imdx-feature-heading">
                      <p className="imdx-feature-kicker">IMDX <span> / </span> APPLICATIONS</p>
                      <h3 className="imdx-feature-title imdx-application-title">Battery Passport, <span>Urban Planning, Urban Transport Planning</span></h3>
                      <p className="imdx-feature-subheading">Ready applications for compliance and for city and transport planners</p>
                      <div className="imdx-feature-rule" aria-hidden="true" />
                    </header>
                    <div className="imdx-feature-copy imdx-application-copy">
                      <p className="imdx-feature-lead">Three applications, one data foundation.</p>
                      <p className="imdx-feature-description">Each application draws on the same governed exchange, so the work done for one carries into the next.</p>
                      <ul className="imdx-feature-list imdx-application-list">
                        <li><span className="imdx-capability-number">01</span><div><strong>Battery passport</strong><span>Map the data you must provide, align with Catena-X models and exchange verified data with European customers while keeping your IP.</span></div></li>
                        <li><span className="imdx-capability-number">02</span><div><strong>Urban planning</strong><span>Combine land use, infrastructure, mobility and energy data to test scenarios, such as EV charging site selection, before committing budgets.</span></div></li>
                        <li><span className="imdx-capability-number">03</span><div><strong>Transport planning</strong><span>Combine public transport, traffic, shared mobility and fleet data for route planning, congestion analysis and performance dashboards.</span></div></li>
                      </ul>
                    </div>
                  </article>
                  <article className="imdx-window imdx-window-three" aria-label="Secure member exchange with connectors">
                    <header className="imdx-feature-heading">
                      <p className="imdx-feature-kicker">IMDX <span> / </span> MEMBER EXCHANGE</p>
                      <h3 className="imdx-feature-title">Exchange with connectors</h3>
                      <p className="imdx-feature-subheading">Secure exchange through approved connectors. Registered login only.</p>
                      <div className="imdx-feature-rule" aria-hidden="true" />
                    </header>
                    <div className="imdx-feature-copy imdx-connector-copy">
                      <p className="imdx-feature-lead">Secure exchange, for registered members only.</p>
                      <p className="imdx-feature-description">Connectors check identity, apply the usage rules each data owner sets, and move data directly between participants. There is no public catalogue and no public connector endpoint.</p>
                      <ul className="imdx-feature-list imdx-connector-list">
                        <li><span className="imdx-capability-number">01</span><div><strong>Public</strong><span>How connectors work, membership process, sample agreement.</span></div></li>
                        <li><span className="imdx-capability-number">02</span><div><strong>Members</strong><span>Data catalogue, connector setup, contracts, exchange logs, support desk.</span></div></li>
                      </ul>
                    </div>
                  </article>
                </div>
              </div>
            </section>
          </section>

          <nav className="bottom-navigation" aria-label="Main navigation">
            <div className="navigation-links">
              {content.navigation.map((item) => (
                <a href={item.href} key={item.label}>{item.label}</a>
              ))}
              <a className="nav-join" href={content.primaryAction.href}>Join us <span aria-hidden="true">↗</span></a>
            </div>
          </nav>
      </section>
      </div>
      <section className="services-page" aria-label="Tecmotiv Services">
        <div className="services-heading-stack">
          <h2 className="services-title">Tecmotiv Services</h2>
          <p className="services-subheading">End-to-end strategic services</p>
          <p className="services-description" aria-label={servicesDescription}>
            {servicesDescriptionWords.map((word, index) => (
              <span className="services-word" aria-hidden="true" key={index} style={{ opacity: 0 }}>{word}</span>
            ))}
          </p>
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
      <section className="wtc-page" aria-label="WTC Partnership">
        <div className="wtc-content">
          <h2 className="wtc-title" data-wtc-reveal>WTC Partnership</h2>
          <p className="wtc-subheading" data-wtc-reveal>A trade network that opens doors in India</p>
          <p className="wtc-description" data-wtc-reveal>
            Together with the World Trade Center network we bring international companies into direct contact with Indian OEMs, industry bodies and government stakeholders, then support them through market entry.
          </p>
          <ul className="wtc-benefits" aria-label="Partnership benefits">
            {wtcBenefits.map((benefit) => (
              <li data-wtc-reveal key={benefit}>{benefit}</li>
            ))}
          </ul>
        </div>
      </section>
      <section className="eighth-page news-page" aria-label="News and media">
        <div className="news-content">
          <header className="news-intro">
            <p className="news-eyebrow">NEWS / MEDIA</p>
            <h2>Insight from the India mobility market</h2>
            <p>The latest from the Tecmotiv blog and the summits, symposiums and collaboration meetings we take part in across India and Asia.</p>
          </header>

          <article className="news-feature">
            <p className="news-feature-meta">LATEST BLOG <span>·</span> 25 MAY 2026</p>
            <h3>From Lean Manufacturing to Software-Defined Mobility: Why the World Must Now Learn from China and How India Can Lead the Next Wave?</h3>
            <div className="news-feature-links">
              <a className="news-primary-link" href="https://tecmotivsolutions.com/news/blogs/from-lean-manufacturing-to-software-defined-mobility-why-the-world-must-now-learn-from-china-and-how-india-can-lead-the-next-wave" target="_blank" rel="noreferrer">Read the article <span aria-hidden="true">→</span></a>
              <a className="news-secondary-link" href="https://tecmotivsolutions.com/news/blogs" target="_blank" rel="noreferrer">All blogs <span aria-hidden="true">↗</span></a>
            </div>
          </article>

          <section className="news-events" aria-labelledby="news-events-title">
            <div className="news-section-heading">
              <h3 id="news-events-title">Recent events</h3>
              <a href="https://tecmotivsolutions.com/news/events" target="_blank" rel="noreferrer">All events <span aria-hidden="true">↗</span></a>
            </div>
            <ul>
              <li><time dateTime="2026-06-23">23 JUN 2026</time><a href="https://tecmotivsolutions.com/news/events/quality-as-a-competitive-advantage-insights-from-makers-of-bharat" target="_blank" rel="noreferrer">Quality as a Competitive Advantage: Insights from Makers of Bharat <span aria-hidden="true">↗</span></a></li>
              <li><time dateTime="2026-06-23">23 JUN 2026</time><a href="https://tecmotivsolutions.com/news/events/b2b-collaboration-meeting-6th-india-automotive-powertrain-summit-2026" target="_blank" rel="noreferrer">B2B Collaboration Meeting – 6th India Automotive Powertrain Summit 2026 <span aria-hidden="true">↗</span></a></li>
              <li><time dateTime="2026-06-05">5 JUN 2026</time><a href="https://tecmotivsolutions.com/news/events/pune-vikas-manthan-2026-by-policy-advocacy-research-centre-parc-and-pune-platform-for-collaborative-response-ppcr-pune" target="_blank" rel="noreferrer">Pune Vikas Manthan 2026 by PARC and PPCR, Pune <span aria-hidden="true">↗</span></a></li>
              <li><time dateTime="2026-06-05">5 JUN 2026</time><a href="https://tecmotivsolutions.com/news/events/vdma-manufacturing-x-symposium-2026-pune-india" target="_blank" rel="noreferrer">VDMA Manufacturing-X Symposium 2026, Pune, India <span aria-hidden="true">↗</span></a></li>
              <li><time dateTime="2026-06-05">5 JUN 2026</time><a href="https://tecmotivsolutions.com/news/events/autotech-aftermarket-summit-2026-bangkok-thailand" target="_blank" rel="noreferrer">AutoTech Aftermarket Summit 2026, Bangkok, Thailand <span aria-hidden="true">↗</span></a></li>
            </ul>
          </section>

          <aside className="news-careers">
            <div>
              <p className="news-eyebrow">WORK WITH US</p>
              <h3>Build mobility’s data backbone with us</h3>
              <p>Join a small, interdisciplinary team working across automotive, energy and data.</p>
            </div>
            <a href="https://tecmotivsolutions.com/careers" target="_blank" rel="noreferrer">See open roles <span aria-hidden="true">→</span></a>
          </aside>
        </div>
      </section>
    </main>
  );
}

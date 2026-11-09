"use client";

import { useEffect, useRef, useState } from "react";

type Standard = { title: string; description: string };
type View = "a" | "b";

const shortLabels = ["EDC", "DSP", "ODRL", "DID", "CX", "DPDP"];
const views: Array<{ id: View; label: string }> = [
  { id: "a", label: "A · Spotlight glass" },
  { id: "b", label: "B · Living network" },
];

export function StandardsViews({ cards }: { cards: Standard[] }) {
  const [activeView, setActiveView] = useState<View>("a");

  return (
    <>
      <div className="standards-tabs" role="tablist" aria-label="Standards section views">
        {views.map((view) => (
          <button
            aria-controls={`standards-view-${view.id}`}
            aria-selected={activeView === view.id}
            className={activeView === view.id ? "is-active" : ""}
            id={`standards-tab-${view.id}`}
            key={view.id}
            onClick={() => setActiveView(view.id)}
            role="tab"
            type="button"
          >
            {view.label}
          </button>
        ))}
      </div>

      <section
        aria-labelledby="standards-tab-a"
        className={`standards-stage${activeView === "a" ? " is-active" : ""}`}
        id="standards-view-a"
        role="tabpanel"
        hidden={activeView !== "a"}
      >
        <div className="standards-grid" aria-label="Open standards and regulations">
          {cards.map((item, index) => (
            <button
              className="standards-card"
              key={item.title}
              onPointerMove={(event) => {
                const card = event.currentTarget;
                const rect = card.getBoundingClientRect();
                const x = event.clientX - rect.left;
                const y = event.clientY - rect.top;
                card.style.setProperty("--mx", `${x}px`);
                card.style.setProperty("--my", `${y}px`);
                if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
                  card.style.transform = `perspective(800px) rotateX(${(0.5 - y / rect.height) * 8}deg) rotateY(${(x / rect.width - 0.5) * 8}deg) translateY(-6px)`;
                }
              }}
              onPointerLeave={(event) => {
                event.currentTarget.style.transform = "";
              }}
              style={{ "--card-index": index } as React.CSSProperties}
              type="button"
              aria-label={`${item.title}: ${item.description}`}
            >
              <span className="standards-card-number">{String(index + 1).padStart(2, "0")}</span>
              <span className="standards-card-title">{item.title}</span>
              <span className="standards-card-description">{item.description}</span>
              <span className="standards-card-arrow" aria-hidden="true">
                <svg viewBox="0 0 24 24" focusable="false"><path d="M4.75 12h14.5M13 5.75 19.25 12 13 18.25" /></svg>
              </span>
            </button>
          ))}
        </div>
      </section>

      <section
        aria-labelledby="standards-tab-b"
        className={`standards-stage${activeView === "b" ? " is-active" : ""}`}
        id="standards-view-b"
        role="tabpanel"
        hidden={activeView !== "b"}
      >
        <LivingNetwork cards={cards} active={activeView === "b"} />
      </section>
    </>
  );
}

function LivingNetwork({ cards, active }: { cards: Standard[]; active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedIndexRef = useRef(0);

  useEffect(() => {
    selectedIndexRef.current = selectedIndex;
  }, [selectedIndex]);

  useEffect(() => {
    const canvasElement = canvasRef.current;
    const orbit = canvasElement?.parentElement;
    const section = canvasElement?.closest(".wtc-page");
    if (!canvasElement || !orbit || !section) return;
    const canvas: HTMLCanvasElement = canvasElement;
    const ctx = canvas.getContext("2d")!;
    if (!ctx) return;

    const width = 800;
    const height = 600;
    const centerX = width / 2;
    const centerY = height / 2;
    const centerRadius = 66;
    const orbitRadius = 205;
    const nodeOrbitRadius = 268;
    const nodeRadius = 27;
    const tau = Math.PI * 2;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let visible = false;
    let frame = 0;
    let lastTime = 0;
    let angle = -Math.PI / 2;
    let lastAutoChange = 0;
    let spawnTime = 0;
    let pointerX = -1000;
    let pointerY = -1000;
    let hovered = -1;
    let particles: Array<{ angle: number; speed: number; offset: number; size: number; beam: boolean; phase: number }> = [];
    const packets: Array<{ from: number; to: number; progress: number; speed: number }> = [];
    const ripples = Array(cards.length).fill(0) as number[];
    const nodePoints: Array<[number, number]> = [];
    let randomSeed = 141;
    const random = () => {
      randomSeed = (randomSeed * 16807) % 2147483647;
      return (randomSeed - 1) / 2147483646;
    };
    particles = Array.from({ length: 58 }, (_, index) => ({
      angle: random() * tau,
      speed: (0.00005 + random() * 0.00011) * (random() < 0.2 ? -1 : 1),
      offset: (random() - 0.5) * 22,
      size: 1 + random() * 1.5,
      beam: index % 9 === 0,
      phase: random() * 9,
    }));

    const resize = () => {
      const bounds = orbit.getBoundingClientRect();
      if (!bounds.width) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(bounds.width * dpr);
      canvas.height = Math.round((bounds.width * height / width) * dpr);
      const canvasScale = bounds.width / width;
      ctx.setTransform(dpr * canvasScale, 0, 0, dpr * canvasScale, 0, 0);
      if (reducedMotion && active && visible) draw(performance.now());
    };

    const nodeAngle = (index: number) => angle + index * tau / cards.length;
    const polar = (a: number, radius: number): [number, number] => [centerX + Math.cos(a) * radius, centerY + Math.sin(a) * radius];

    const drawOrb = (x: number, y: number, radius: number, label: string, isSelected: boolean, core = false) => {
      ctx.save();
      const fill = ctx.createRadialGradient(x - radius * 0.32, y - radius * 0.4, 1, x, y, radius * 1.2);
      fill.addColorStop(0, core ? "rgba(94,234,212,.92)" : "rgba(20,184,166,.8)");
      fill.addColorStop(0.56, "rgba(3,88,119,.9)");
      fill.addColorStop(1, "rgba(4,34,54,.96)");
      ctx.shadowColor = isSelected ? "#a5f3fc" : "#67e8f9";
      ctx.shadowBlur = isSelected ? 22 : 9;
      ctx.fillStyle = fill;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, tau);
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.strokeStyle = `rgba(255,255,255,${isSelected ? 0.95 : 0.58})`;
      ctx.lineWidth = isSelected ? 2 : 1.2;
      ctx.stroke();
      if (core) {
        ctx.beginPath();
        ctx.arc(x, y, radius + 10, 0, tau);
        ctx.strokeStyle = "rgba(207,250,254,.22)";
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      ctx.fillStyle = "#fff";
      ctx.font = `${core ? 800 : 700} ${core ? 20 : 11}px Arial, Helvetica, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(label, x, y + 1);
      ctx.restore();
    };

    const drawCube = (x: number, y: number, rotation: number, size: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.shadowColor = "#67e8f9";
      ctx.shadowBlur = 12;
      ctx.fillStyle = "rgba(207,250,254,.92)";
      ctx.fillRect(-size / 2, -size / 2, size, size);
      ctx.shadowBlur = 0;
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 1.2;
      ctx.strokeRect(-size / 2 - 2, -size / 2 - 2, size + 4, size + 4);
      ctx.beginPath();
      ctx.moveTo(-size / 2, -size / 2);
      ctx.lineTo(-size / 2 + size * 0.3, -size / 2 - size * 0.3);
      ctx.lineTo(size / 2 + size * 0.3, -size / 2 - size * 0.3);
      ctx.lineTo(size / 2, -size / 2);
      ctx.closePath();
      ctx.fillStyle = "rgba(255,255,255,.7)";
      ctx.fill();
      ctx.restore();
    };

    const packetPosition = (packet: { from: number; to: number; progress: number }): [number, number] => {
      const start = nodeAngle(packet.from);
      const end = nodeAngle(packet.to);
      const delta = ((end - start + Math.PI * 3) % tau) - Math.PI;
      let currentAngle = start;
      let radius = nodeOrbitRadius - nodeRadius;
      if (packet.progress < 0.2) {
        const t = packet.progress / 0.2;
        radius += (orbitRadius - radius) * t;
      } else if (packet.progress < 0.8) {
        const t = (packet.progress - 0.2) / 0.6;
        currentAngle += delta * t;
        radius = orbitRadius;
      } else {
        const t = (packet.progress - 0.8) / 0.2;
        currentAngle = end;
        radius = orbitRadius + (nodeOrbitRadius - nodeRadius - orbitRadius) * t;
      }
      return polar(currentAngle, radius);
    };

    function draw(now: number) {
      const dt = Math.min(now - (lastTime || now), 50);
      lastTime = now;
      hovered = -1;
      for (let i = 0; i < cards.length; i += 1) {
        const point = polar(nodeAngle(i), nodeOrbitRadius);
        nodePoints[i] = point;
        if (Math.hypot(pointerX - point[0], pointerY - point[1]) < nodeRadius + 12) hovered = i;
      }

      if (hovered >= 0) {
        if (selectedIndexRef.current !== hovered) {
          selectedIndexRef.current = hovered;
          setSelectedIndex(hovered);
        }
        lastAutoChange = now;
      } else {
        angle += dt * 0.00011;
        if (!lastAutoChange) lastAutoChange = now;
        if (now - lastAutoChange > 3800) {
          const next = (selectedIndexRef.current + 1) % cards.length;
          selectedIndexRef.current = next;
          setSelectedIndex(next);
          lastAutoChange = now;
        }
      }

      spawnTime += dt;
      if (spawnTime > 820 && packets.length < 7) {
        spawnTime = 0;
        const from = Math.floor(random() * cards.length);
        const to = (from + 1 + Math.floor(random() * (cards.length - 1))) % cards.length;
        packets.push({ from, to, progress: 0, speed: 0.00025 + random() * 0.00009 });
      }

      ctx.clearRect(0, 0, width, height);
      ctx.save();
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 11]);
      ctx.strokeStyle = "rgba(255,255,255,.14)";
      ctx.beginPath();
      ctx.arc(centerX, centerY, nodeOrbitRadius, 0, tau);
      ctx.stroke();
      ctx.strokeStyle = "rgba(207,250,254,.17)";
      ctx.beginPath();
      ctx.arc(centerX, centerY, nodeOrbitRadius + 34, angle, angle + 2.2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(centerX, centerY, nodeOrbitRadius + 34, angle + 3.4, angle + 5.2);
      ctx.stroke();
      ctx.setLineDash([]);

      for (let i = 0; i < cards.length; i += 1) {
        const a = nodeAngle(i);
        const start = polar(a, orbitRadius);
        const end = polar(a, nodeOrbitRadius - nodeRadius);
        const strength = i === selectedIndexRef.current ? 0.82 : 0.32;
        const beam = ctx.createLinearGradient(start[0], start[1], end[0], end[1]);
        beam.addColorStop(0, `rgba(94,234,212,${strength})`);
        beam.addColorStop(1, `rgba(207,250,254,${strength})`);
        ctx.strokeStyle = beam;
        ctx.lineWidth = i === selectedIndexRef.current ? 1.7 : 1;
        ctx.beginPath();
        ctx.moveTo(...start);
        ctx.lineTo(...end);
        ctx.stroke();
        ctx.fillStyle = "#a5f3fc";
        ctx.beginPath();
        ctx.arc(...start, 2.4, 0, tau);
        ctx.fill();
      }

      ctx.setLineDash([1.5, 7]);
      ctx.lineCap = "round";
      ctx.lineWidth = 2;
      ctx.strokeStyle = "rgba(255,255,255,.66)";
      ctx.beginPath();
      ctx.arc(centerX, centerY, orbitRadius, 0, tau);
      ctx.stroke();
      ctx.setLineDash([]);

      const particlePoints = particles.map((particle) => {
        particle.angle += particle.speed * dt;
        return polar(particle.angle, orbitRadius + particle.offset);
      });
      for (let i = 0; i < particlePoints.length; i += 1) {
        for (let j = i + 1; j < particlePoints.length; j += 1) {
          const first = particlePoints[i];
          const second = particlePoints[j];
          const distance = Math.hypot(first[0] - second[0], first[1] - second[1]);
          if (distance >= 52 || (i % 2 !== 0 && j % 3 !== 0)) continue;
          const link = ctx.createLinearGradient(first[0], first[1], second[0], second[1]);
          const alpha = (1 - distance / 52) * 0.58;
          link.addColorStop(0, `rgba(207,250,254,${alpha})`);
          link.addColorStop(1, `rgba(94,234,212,${alpha})`);
          ctx.strokeStyle = link;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(...first);
          ctx.lineTo(...second);
          ctx.stroke();
        }
      }
      particles.forEach((particle, index) => {
        const [x, y] = particlePoints[index];
        if (particle.beam) {
          const pulse = 0.5 + 0.5 * Math.sin(now / 420 + particle.phase);
          const direction = index % 2 ? 1 : -1;
          const tipX = x + Math.cos(particle.angle) * direction * 42 * pulse;
          const tipY = y + Math.sin(particle.angle) * direction * 42 * pulse;
          ctx.strokeStyle = "rgba(207,250,254,.52)";
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(tipX, tipY);
          ctx.stroke();
        }
        ctx.save();
        ctx.shadowColor = "#67e8f9";
        ctx.shadowBlur = particle.beam ? 10 : 4;
        ctx.fillStyle = particle.beam ? "#fff" : "rgba(207,250,254,.86)";
        ctx.beginPath();
        ctx.arc(x, y, particle.beam ? 2.4 : particle.size, 0, tau);
        ctx.fill();
        ctx.restore();
      });

      for (let i = packets.length - 1; i >= 0; i -= 1) {
        const packet = packets[i];
        packet.progress += packet.speed * dt;
        if (packet.progress >= 1) {
          ripples[packet.to] = 1;
          packets.splice(i, 1);
          continue;
        }
        for (let trail = 1; trail <= 3; trail += 1) {
          const prior = { ...packet, progress: Math.max(0, packet.progress - trail * 0.012) };
          const [trailX, trailY] = packetPosition(prior);
          ctx.fillStyle = `rgba(165,243,252,${0.34 / trail})`;
          ctx.fillRect(trailX - 1.5, trailY - 1.5, 3, 3);
        }
        const [x, y] = packetPosition(packet);
        drawCube(x, y, now / 380 + i, 7);
      }

      drawOrb(centerX, centerY, centerRadius, "IMDX", true, true);
      for (let i = 0; i < cards.length; i += 1) {
        ripples[i] = Math.max(0, ripples[i] - dt / 720);
        if (ripples[i] > 0) {
          ctx.strokeStyle = `rgba(207,250,254,${ripples[i] * 0.7})`;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.arc(nodePoints[i][0], nodePoints[i][1], nodeRadius + (1 - ripples[i]) * 22, 0, tau);
          ctx.stroke();
        }
        drawOrb(...nodePoints[i], i === selectedIndexRef.current ? nodeRadius + 3 : nodeRadius, shortLabels[i], i === selectedIndexRef.current || hovered === i);
      }
      ctx.restore();
    }

    const animate = (now: number) => {
      frame = 0;
      draw(now);
      if (!reducedMotion && active && visible && !document.hidden) frame = window.requestAnimationFrame(animate);
    };
    const resume = () => {
      if (!active || !visible || document.hidden) return;
      if (!frame) frame = window.requestAnimationFrame(animate);
    };
    const pause = () => {
      if (frame) window.cancelAnimationFrame(frame);
      frame = 0;
      lastTime = 0;
    };
    const updateVisibility = () => {
      if (active && visible && !document.hidden) resume();
      else pause();
    };
    const updatePointer = (event: PointerEvent) => {
      const bounds = canvas.getBoundingClientRect();
      pointerX = (event.clientX - bounds.left) * width / bounds.width;
      pointerY = (event.clientY - bounds.top) * height / bounds.height;
      if (reducedMotion && active && visible && !document.hidden) draw(performance.now());
    };
    const clearPointer = () => {
      pointerX = -1000;
      pointerY = -1000;
      if (reducedMotion && active && visible && !document.hidden) draw(performance.now());
    };
    const keySelect = (event: KeyboardEvent) => {
      if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
      event.preventDefault();
      const direction = event.key === "ArrowRight" ? 1 : -1;
      const next = (selectedIndexRef.current + direction + cards.length) % cards.length;
      selectedIndexRef.current = next;
      setSelectedIndex(next);
      lastAutoChange = performance.now();
      if (reducedMotion && active && visible && !document.hidden) draw(performance.now());
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      updateVisibility();
    }, { threshold: 0.02 });
    observer.observe(section);
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(orbit);
    document.addEventListener("visibilitychange", updateVisibility);
    canvas.addEventListener("pointermove", updatePointer);
    canvas.addEventListener("pointerdown", updatePointer);
    canvas.addEventListener("pointerleave", clearPointer);
    canvas.addEventListener("keydown", keySelect);
    resize();
    updateVisibility();

    return () => {
      pause();
      observer.disconnect();
      resizeObserver.disconnect();
      document.removeEventListener("visibilitychange", updateVisibility);
      canvas.removeEventListener("pointermove", updatePointer);
      canvas.removeEventListener("pointerdown", updatePointer);
      canvas.removeEventListener("pointerleave", clearPointer);
      canvas.removeEventListener("keydown", keySelect);
    };
  }, [active, cards]);

  return (
    <>
      <div className="standards-orbit">
        <canvas
          aria-label="Animated network orbit of six open standards. Use left and right arrow keys to select a standard."
          className="standards-network-canvas"
          ref={canvasRef}
          role="img"
          tabIndex={0}
        />
      </div>
      <div className="standards-network-detail" key={selectedIndex} aria-live="polite">
        <h3>{cards[selectedIndex]?.title}</h3>
        <p>{cards[selectedIndex]?.description}</p>
      </div>
    </>
  );
}

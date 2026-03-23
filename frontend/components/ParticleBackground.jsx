"use client";
import { useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

export default function ParticleBackground() {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setInit(true));
  }, []);

  const options = useMemo(() => ({
    background: { color: { value: "transparent" } },
    fpsLimit: 60,
    interactivity: {
      detectsOn: "window",
      events: {
        onHover: { enable: true, mode: "grab" },
        onClick: { enable: true, mode: "push" },
      },
      modes: {
        grab: { distance: 200, links: { opacity: 0.8 } },
        push: { quantity: 3 },
      },
    },
    particles: {
      number: { value: 60, density: { enable: true } },
      color: { value: ["#3b82f6", "#06b6d4", "#6366f1"] },
      links: {
        enable: true,
        color: "#3b82f6",
        opacity: 0.2,
        distance: 150,
        width: 1,
      },
      move: {
        enable: true,
        speed: 0.6,
        outModes: { default: "bounce" },
      },
      opacity: { value: 0.5 },
      shape: { type: "circle" },
      size: { value: { min: 1, max: 3 } },
    },
    detectRetina: true,
  }), []);

  if (!init) return null;

  return (
    <Particles
      id="tsparticles"
      options={options}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
      }}
    />
  );
}
"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { type RefObject, Suspense, useMemo } from "react";
import * as THREE from "three";
import { CuffModel } from "./CuffModel";
import { FloatingObject } from "./FloatingObject";
import { LightingRig } from "./LightingRig";

function CameraRig({ progress }: { progress: RefObject<number> }) {
  useFrame(({ camera }) => {
    const p = progress.current ?? 0;
    camera.position.z = THREE.MathUtils.lerp(4.6, 3.3, p);
    camera.position.y = THREE.MathUtils.lerp(0.5, 0.15, p);
    camera.lookAt(0, 0, 0);
  });
  return null;
}

/** Soft contact shadow — a radial gradient on a plane, far cheaper than shadow maps. */
function ContactShadow() {
  const texture = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 128;
    const ctx = c.getContext("2d")!;
    const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    g.addColorStop(0, "rgba(0,0,0,0.55)");
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(c);
  }, []);
  return (
    <mesh rotation-x={-Math.PI / 2} position={[0, -0.95, 0]}>
      <planeGeometry args={[3.4, 3.4]} />
      <meshBasicMaterial map={texture} transparent depthWrite={false} />
    </mesh>
  );
}

export interface ProductSceneProps {
  progress: RefObject<number>;
  pointer: RefObject<{ x: number; y: number }>;
  active: boolean;
  textureUrl: string;
  onReady?: () => void;
}

/**
 * The VELORA showroom. Rendered only on capable devices, only while in view
 * (frameloop pauses off-screen), at a capped pixel ratio.
 */
export default function ProductScene({ progress, pointer, active, textureUrl, onReady }: ProductSceneProps) {
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={[1, 1.75]}
      camera={{ fov: 32, position: [0, 0.5, 4.6], near: 0.1, far: 30 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.05;
        onReady?.();
      }}
      aria-hidden
    >
      <CameraRig progress={progress} />
      <LightingRig progress={progress} />
      <Suspense fallback={null}>
        <FloatingObject progress={progress} pointer={pointer}>
          <CuffModel textureUrl={textureUrl} />
        </FloatingObject>
      </Suspense>
      <ContactShadow />
    </Canvas>
  );
}

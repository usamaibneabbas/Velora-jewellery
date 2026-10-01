"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { type RefObject, useEffect, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

/**
 * Showroom lighting: a soft room environment for believable metal reflections,
 * a warm key light that travels with scroll, and a cool rim from behind.
 */
export function LightingRig({ progress }: { progress: RefObject<number> }) {
  const get = useThree((s) => s.get);
  const key = useRef<THREE.SpotLight>(null);

  useEffect(() => {
    const { gl, scene } = get();
    const pmrem = new THREE.PMREMGenerator(gl);
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = env;
    scene.environmentIntensity = 0.85;
    return () => {
      scene.environment = null;
      env.dispose();
      pmrem.dispose();
    };
  }, [get]);

  useFrame(() => {
    if (!key.current) return;
    const p = progress.current ?? 0;
    // Key light arcs across the piece as the visitor scrolls.
    key.current.position.set(THREE.MathUtils.lerp(-3.5, 3.5, p), 3.2, 3);
    key.current.intensity = 26 + Math.sin(p * Math.PI) * 18;
  });

  return (
    <>
      <ambientLight intensity={0.25} color="#f4e9da" />
      <spotLight ref={key} angle={0.5} penumbra={1} distance={14} decay={2} color="#ffe9c8" position={[-3, 3, 3]} />
      <directionalLight position={[0, 2, -4]} intensity={1.2} color="#cfe0ff" />
    </>
  );
}

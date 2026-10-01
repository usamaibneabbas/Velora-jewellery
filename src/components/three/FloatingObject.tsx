"use client";

import { useFrame } from "@react-three/fiber";
import { type ReactNode, type RefObject, useRef } from "react";
import * as THREE from "three";

interface FloatingObjectProps {
  children: ReactNode;
  progress: RefObject<number>;
  pointer: RefObject<{ x: number; y: number }>;
}

/**
 * Art-directed motion — no orbit controls. Scroll sets the rotation, elevation
 * and tilt; the pointer adds a few degrees of parallax; a slow breath keeps it alive.
 */
export function FloatingObject({ children, progress, pointer }: FloatingObjectProps) {
  const group = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const p = progress.current ?? 0;
    const t = state.clock.elapsedTime;
    const ptr = pointer.current ?? { x: 0, y: 0 };
    const targetY = THREE.MathUtils.lerp(-0.5, Math.PI * 1.15, p) + ptr.x * 0.12;
    const targetX = THREE.MathUtils.lerp(0.55, 0.12, p) + ptr.y * 0.06;
    const targetZ = THREE.MathUtils.lerp(-0.18, 0.08, p);
    const k = 1 - Math.pow(0.0025, delta); // frame-rate independent damping
    g.rotation.y += (targetY - g.rotation.y) * k;
    g.rotation.x += (targetX - g.rotation.x) * k;
    g.rotation.z += (targetZ - g.rotation.z) * k;
    g.position.y = THREE.MathUtils.lerp(-0.12, 0.1, p) + Math.sin(t * 0.8) * 0.025;
  });

  return <group ref={group}>{children}</group>;
}

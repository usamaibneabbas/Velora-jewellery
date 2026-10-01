"use client";

import { useLoader } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import * as THREE from "three";

/** Arc along the cuff edge — mirrors CylinderGeometry's parametrisation exactly. */
class CuffEdge extends THREE.Curve<THREE.Vector3> {
  constructor(private r: number, private y: number, private start: number, private length: number) {
    super();
  }
  getPoint(t: number, target = new THREE.Vector3()) {
    const a = this.start + t * this.length;
    return target.set(this.r * Math.sin(a), this.y, this.r * Math.cos(a));
  }
}

const RADIUS = 1;
const HEIGHT = 0.62;
const OPENING = 0.16; // fraction of the circle left open
const THETA_LEN = Math.PI * 2 * (1 - OPENING);
const THETA_START = Math.PI + (Math.PI * 2 * OPENING) / 2; // gap faces away (−Z) at rest

/**
 * A procedural open cuff. The outer band is textured with real VELORA
 * photography; rims and lining are physically based polished metal.
 * Geometry is deliberately light (≈ 30k triangles).
 */
export function CuffModel({ textureUrl }: { textureUrl: string }) {
  const source = useLoader(THREE.TextureLoader, textureUrl);

  // Configure a private copy so the cached loader result is never mutated.
  const map = useMemo(() => {
    const t = source.clone();
    t.colorSpace = THREE.SRGBColorSpace;
    t.wrapS = THREE.MirroredRepeatWrapping;
    t.wrapT = THREE.ClampToEdgeWrapping;
    t.repeat.set(8, 1);
    t.anisotropy = 8;
    t.needsUpdate = true;
    return t;
  }, [source]);

  const { band, lining, rimTop, rimBottom, capA, capB } = useMemo(() => {
    const band = new THREE.CylinderGeometry(RADIUS, RADIUS, HEIGHT, 160, 1, true, THETA_START, THETA_LEN);
    const lining = new THREE.CylinderGeometry(RADIUS * 0.965, RADIUS * 0.965, HEIGHT * 0.98, 120, 1, true, THETA_START, THETA_LEN);
    const tube = (y: number) => new THREE.TubeGeometry(new CuffEdge(RADIUS * 0.99, y, THETA_START, THETA_LEN), 200, 0.028, 12, false);
    const cap = new THREE.CapsuleGeometry(0.032, HEIGHT, 6, 12);
    return { band, lining, rimTop: tube(HEIGHT / 2), rimBottom: tube(-HEIGHT / 2), capA: cap, capB: cap };
  }, []);

  useEffect(
    () => () => {
      [band, lining, rimTop, rimBottom, capA].forEach((g) => g.dispose());
      map.dispose();
    },
    [band, lining, rimTop, rimBottom, capA, map],
  );

  const endAngle = THETA_START + THETA_LEN;
  const metal = { color: "#d9d4cc", metalness: 1, roughness: 0.22 } as const;

  return (
    <group>
      <mesh geometry={band}>
        <meshPhysicalMaterial map={map} bumpMap={map} bumpScale={1.6} metalness={0.45} roughness={0.38} clearcoat={0.6} clearcoatRoughness={0.25} />
      </mesh>
      <mesh geometry={lining}>
        <meshStandardMaterial side={THREE.BackSide} {...metal} roughness={0.32} />
      </mesh>
      <mesh geometry={rimTop}>
        <meshStandardMaterial {...metal} />
      </mesh>
      <mesh geometry={rimBottom}>
        <meshStandardMaterial {...metal} />
      </mesh>
      <mesh geometry={capA} position={[RADIUS * Math.sin(THETA_START), 0, RADIUS * Math.cos(THETA_START)]}>
        <meshStandardMaterial {...metal} />
      </mesh>
      <mesh geometry={capB} position={[RADIUS * Math.sin(endAngle), 0, RADIUS * Math.cos(endAngle)]}>
        <meshStandardMaterial {...metal} />
      </mesh>
    </group>
  );
}

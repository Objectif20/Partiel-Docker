import * as THREE from "three";
import { Bounds } from "@react-three/drei";
import { useRef, useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { DirectionalLight } from "./DirectionalLight";
import usePlayerAnimation from "../hooks/usePlayerAnimation";
import { setRef } from "../stores/player";

export function Player() {
  const player = useRef<THREE.Group>(null);
  const lightRef = useRef<THREE.DirectionalLight>(null);
  const camera = useThree((state) => state.camera);

  usePlayerAnimation(player);

  useEffect(() => {
    if (!player.current) return;
    if (!lightRef.current) return;

    player.current.add(camera);
    lightRef.current.target = player.current;

    setRef(player.current);
  });

  return (
    <Bounds fit clip observe margin={10}>
      <group ref={player}>
        <group>
          <mesh position={[0, 0, 17]} castShadow receiveShadow>
            <boxGeometry args={[8, 5, 15]} />
            <meshLambertMaterial color={0x3498db} flatShading /> 
          </mesh>
          <mesh position={[0, 0, 26]} castShadow receiveShadow>
            <boxGeometry args={[8, 8, 8]} />
            <meshLambertMaterial color={0xffe0bd} flatShading /> 
          </mesh>
          <mesh position={[5, 0, 19]} castShadow receiveShadow>
            <boxGeometry args={[3, 3, 5]} />
            <meshLambertMaterial color={0x3498db} flatShading /> 
          </mesh>
          <mesh position={[5, 0, 15]} castShadow receiveShadow>
            <boxGeometry args={[3, 3, 5]} />
            <meshLambertMaterial color={0xffe0bd} flatShading /> 
          </mesh>



          <mesh position={[-5, 0, 19]} castShadow receiveShadow>
            <boxGeometry args={[3, 3, 5]} />
            <meshLambertMaterial color={0x3498db} flatShading /> 
          </mesh>
          <mesh position={[-5, 0, 15]} castShadow receiveShadow>
            <boxGeometry args={[3, 3, 5]} />
            <meshLambertMaterial color={0xffe0bd} flatShading /> 
          </mesh>



          <mesh position={[2, 0, 6]} castShadow receiveShadow>
            <boxGeometry args={[3, 5, 7]} />
            <meshLambertMaterial color={0x422687} flatShading /> 
          </mesh>



          <mesh position={[-2, 0, 6]} castShadow receiveShadow>
            <boxGeometry args={[3, 5, 7]} />
            <meshLambertMaterial color={0x422687} flatShading />
          </mesh>
        </group>
        <DirectionalLight ref={lightRef} />
      </group>
    </Bounds>
  );
}

import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { state as player } from "../stores/player";
import { useRef } from "react";

export default function useBoxCollection(
  box: React.RefObject<THREE.Mesh | null>,
  onCollect: () => void
) {
  const collectedRef = useRef(false); 

  useFrame(() => {
    if (!box.current || !player.ref || collectedRef.current) return; 

    const boxBoundingBox = new THREE.Box3();
    boxBoundingBox.setFromObject(box.current);

    const playerBoundingBox = new THREE.Box3();
    playerBoundingBox.setFromObject(player.ref);

    if (playerBoundingBox.intersectsBox(boxBoundingBox)) {
      collectedRef.current = true; 
      onCollect();
    }
  });
}

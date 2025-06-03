import React, { useRef, useState } from 'react';
import * as THREE from 'three';
import useBoxCollection from '../hooks/useBoxCollection';
import useStore from '../stores/game';

interface BoxProps {
  position: { x: number; y: number };
  onCollect: () => void;
}

const Box: React.FC<BoxProps> = ({ position }) => {
  const boxRef = useRef<THREE.Mesh>(null);
  const [collected, setCollected] = useState(false);

  const updateBoxCollected = useStore((state) => state.updateBoxCollected);

  const handleCollect = () => {
    updateBoxCollected(); 
    setCollected(true); 
  };

  useBoxCollection(boxRef, handleCollect);

  if (collected) {
    return null;
  }

  return (
    <mesh ref={boxRef} position={[position.x, position.y, 5]}>
      <boxGeometry args={[10, 10, 10]} />
      <meshStandardMaterial color={0x917257} />
    </mesh>
  );
};

export default Box;

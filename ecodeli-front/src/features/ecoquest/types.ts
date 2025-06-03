import * as THREE from "three";

export type RowType = "forest" | "car" | "truck";

export type MoveDirection = "forward" | "backward" | "left" | "right";


export type Row =
  | {
      type: "forest";
      trees: { tileIndex: number; height: number }[];
      box: {
        position: { x: number; y: number };
        onCollect: () => void;
      };
    }
  | {
      type: "car";
      direction: boolean;
      speed: number;
      vehicles: {
        initialTileIndex: number;
        color: THREE.ColorRepresentation;
      }[];
    }
  | {
      type: "truck";
      direction: boolean;
      speed: number;
      vehicles: {
        initialTileIndex: number;
        color: THREE.ColorRepresentation;
      }[];
      box: {
        position: { x: number; y: number };
        onCollect: () => void;
      };

    };
import type { Row } from "./types";

export const rows: Row[] = [
    {
      type: "car",
      direction: false,
      speed: 188,
      vehicles: [
        { initialTileIndex: -4, color: 0xbdb638 },
        { initialTileIndex: -1, color: 0x78b14b },
        { initialTileIndex: 4, color: 0xa52523 },
      ],
    },
    {
      type: "forest",
      trees: [
        { tileIndex: -5, height: 50 },
        { tileIndex: 0, height: 30 },
        { tileIndex: 3, height: 50 },
      ],
      box: {
        position: { x: 0, y: 0 },
        onCollect: () => {
          console.log("Box collected!");
        },
      },
    },
    {
      type: "truck",
      direction: true,
      speed: 125,
      vehicles: [
        { initialTileIndex: -4, color: 0x78b14b },
        { initialTileIndex: 0, color: 0xbdb638 },
      ],
      box: {
        position: { x: 0, y: 0 },
        onCollect: () => {
          console.log("Box collected!");
        },
      },
    },
    {
      type: "forest",
      trees: [
        { tileIndex: -8, height: 30 },
        { tileIndex: -3, height: 50 },
        { tileIndex: 2, height: 30 },
      ],
      box: {
        position: { x: 0, y: 0 },
        onCollect: () => {
          console.log("Box collected!");
        },
      },
    },
  ];
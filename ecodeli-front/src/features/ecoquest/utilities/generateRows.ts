import * as THREE from "three";
import { minTileIndex, maxTileIndex, tileSize } from "../constants";
import { type Row, type RowType } from "../types";

export function generateRows(amount: number): Row[] {
  const rows: Row[] = [];
  for (let i = 0; i < amount; i++) {
    const rowData = generateRow();
    rows.push(rowData);
  }
  return rows;
}

function generateRow(): Row {
  const type: RowType = randomElement(["car", "truck", "forest"]);
  if (type === "car") return generateCarLaneMetadata();
  if (type === "truck") return generateTruckLaneMetadata();
  return generateForestMetadata();
}

function randomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function isTileOccupied(occupiedTiles: Set<number>, tileIndex: number): boolean {
  return occupiedTiles.has(tileIndex);
}

function generateForestMetadata(): Row {
  const occupiedTiles = new Set<number>();
  const trees = Array.from({ length: 4 }, () => {
    let tileIndex;
    do {
      tileIndex = THREE.MathUtils.randInt(minTileIndex, maxTileIndex);
    } while (occupiedTiles.has(tileIndex));
    occupiedTiles.add(tileIndex);

    const height = randomElement([20, 45, 60]);

    return { tileIndex, height };
  });

  let boxTileIndex;
  do {
    boxTileIndex = THREE.MathUtils.randInt(minTileIndex, maxTileIndex);
  } while (isTileOccupied(occupiedTiles, boxTileIndex));

  const boxPosition = {
    x: boxTileIndex * tileSize,
    y: 0
  }; 

  return { 
    type: "forest", 
    trees,
    box: { position: boxPosition, onCollect: () => {} }
  };
}

function generateCarLaneMetadata(): Row {
  const direction = randomElement([true, false]);
  const speed = randomElement([125, 156, 188]);

  const occupiedTiles = new Set<number>();

  const vehicles = Array.from({ length: 3 }, () => {
    let initialTileIndex;
    do {
      initialTileIndex = THREE.MathUtils.randInt(minTileIndex, maxTileIndex);
    } while (occupiedTiles.has(initialTileIndex));
    occupiedTiles.add(initialTileIndex - 1);
    occupiedTiles.add(initialTileIndex);
    occupiedTiles.add(initialTileIndex + 1);

    const color: THREE.ColorRepresentation = randomElement([
      0xa52523, 0xbdb638, 0x78b14b,
    ]);

    return { initialTileIndex, color };
  });

  return { type: "car", direction, speed, vehicles };
}

function generateTruckLaneMetadata(): Row {
  const direction = randomElement([true, false]);
  const speed = randomElement([125, 156, 188]);

  const occupiedTiles = new Set<number>();

  const vehicles = Array.from({ length: 2 }, () => {
    let initialTileIndex;
    do {
      initialTileIndex = THREE.MathUtils.randInt(minTileIndex, maxTileIndex);
    } while (occupiedTiles.has(initialTileIndex));
    occupiedTiles.add(initialTileIndex - 2);
    occupiedTiles.add(initialTileIndex - 1);
    occupiedTiles.add(initialTileIndex);
    occupiedTiles.add(initialTileIndex + 1);
    occupiedTiles.add(initialTileIndex + 2);

    const color: THREE.ColorRepresentation = randomElement([
      0xa52523, 0xbdb638, 0x78b14b,
    ]);

    return { initialTileIndex, color };
  });

  let boxTileIndex;
  do {
    boxTileIndex = THREE.MathUtils.randInt(minTileIndex, maxTileIndex);
  } while (isTileOccupied(occupiedTiles, boxTileIndex));  

  const boxPosition = {
    x: boxTileIndex * tileSize,
    y: 0
  };

  return { 
    type: "truck", 
    direction, 
    speed, 
    vehicles,
    box: { position: boxPosition, onCollect: () => {} }
  };
}

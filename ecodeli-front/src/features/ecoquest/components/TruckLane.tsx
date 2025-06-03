import type { Row } from "../types";
import { Road } from "./Road";
import { Truck } from "./Truck";
import Box from "./Box";

type Props = {
  rowIndex: number;
  rowData: Extract<Row, { type: "truck" }>;
};

export function TruckLane({ rowIndex, rowData }: Props) {
  const box = rowData.box;

  return (
    <Road rowIndex={rowIndex}>
      {rowData.vehicles.map((vehicle, index) => (
        <Truck
          key={index}
          rowIndex={rowIndex}
          color={vehicle.color}
          initialTileIndex={vehicle.initialTileIndex}
          direction={rowData.direction}
          speed={rowData.speed}
        />
      ))}
      {box && (
        <Box
          position={box.position}
          onCollect={() => console.log(`Box collected at (${box.position.x}, ${box.position.y})`)}
        />
      )}
    </Road>
  );
}

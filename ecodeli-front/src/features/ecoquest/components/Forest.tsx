import type { Row } from "../types";
import Box from "./Box";
import { Grass } from "./Grass";
import { Tree } from "./Tree";

type Props = {
  rowIndex: number;
  rowData: Extract<Row, { type: "forest" }>;
};

export default function Forest({ rowIndex, rowData }: Props) {
  return (
    <Grass rowIndex={rowIndex}>
      {rowData.trees.map((tree, index) => (
        <Tree
          key={index}
          tileIndex={tree.tileIndex}
          height={tree.height}
        />
      ))}
      {rowData.box && (
        <Box
          position={rowData.box.position}
          onCollect={rowData.box.onCollect}
        />
      )}
    </Grass>
  );
}

import React from "react";
import { Color } from "../types/color.types";

interface Props {
  color: string;
}

export default function PaletteDisplay({ color }: Props) {
  const styles = {
    backgroundColor: `${color}`,
  };

  return (
    <div className="w-20 h-20" style={styles}>
      <div></div>
    </div>
  );
}

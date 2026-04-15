import { N_COLORS, iconIndexToColor } from "./windScale";

const ICON_SIZE = 64;

type DrawFn = (ctx: CanvasRenderingContext2D, ox: number) => void;

function withStroke(drawShape: DrawFn): DrawFn {
  return (ctx, ox) => {
    drawShape(ctx, ox);
    ctx.strokeStyle = "rgba(0, 0, 0, 0.6)";
    ctx.lineWidth = 2;
    ctx.stroke();
  };
}

const drawArrow: DrawFn = (ctx, ox) => {
  ctx.beginPath();
  ctx.moveTo(ox + 32, 4);  // tip
  ctx.lineTo(ox + 50, 32); // right shoulder
  ctx.lineTo(ox + 40, 32); // right indent
  ctx.lineTo(ox + 40, 60); // right base
  ctx.lineTo(ox + 24, 60); // left base
  ctx.lineTo(ox + 24, 32); // left indent
  ctx.lineTo(ox + 14, 32); // left shoulder
  ctx.closePath();
  ctx.fill();
};

const drawTriangle: DrawFn = (ctx, ox) => {
  ctx.beginPath();
  ctx.moveTo(ox + 32, 4);  // apex
  ctx.lineTo(ox + 48, 60); // right base
  ctx.lineTo(ox + 16, 60); // left base
  ctx.closePath();
  ctx.fill();
};

const drawChevron: DrawFn = (ctx, ox) => {
  ctx.beginPath();
  ctx.moveTo(ox + 32, 4);  // tip
  ctx.lineTo(ox + 54, 62); // bottom right
  ctx.lineTo(ox + 32, 48); // center notch (V effect)
  ctx.lineTo(ox +  10, 62); // bottom left
  ctx.closePath();
  ctx.fill();
};

export const DRAW_MODES: Record<string, { label: string; fn: DrawFn }> = {
  arrow:    { label: "Arrow",    fn: withStroke(drawArrow) },
  triangle: { label: "Triangle", fn: withStroke(drawTriangle) },
  chevron:  { label: "Chevron",  fn: withStroke(drawChevron) },
};

export type DrawMode = keyof typeof DRAW_MODES;

export function buildArrowAtlas(mode: DrawMode) {
  const canvas = document.createElement("canvas");
  canvas.width = ICON_SIZE * N_COLORS;
  canvas.height = ICON_SIZE;
  const ctx = canvas.getContext("2d")!;

  const iconMapping: Record<string, { x: number; y: number; width: number; height: number; anchorX: number; anchorY: number }> = {};
  const drawFn = DRAW_MODES[mode].fn;

  for (let i = 0; i < N_COLORS; i++) {
    ctx.fillStyle = iconIndexToColor(i);
    drawFn(ctx, i * ICON_SIZE);
    iconMapping[`arrow_${i}`] = {
      x: i * ICON_SIZE,
      y: 0,
      width: ICON_SIZE,
      height: ICON_SIZE,
      anchorX: ICON_SIZE / 2,
      anchorY: ICON_SIZE / 2,
    };
  }

  return { iconAtlas: canvas.toDataURL(), iconMapping };
}

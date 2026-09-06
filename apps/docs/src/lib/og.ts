import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { Resvg } from "@resvg/resvg-js";
import satori from "satori";
import {
  BRAND_DOMAIN,
  BRAND_LOGO_FILL,
  BRAND_LOGO_PATH,
  BRAND_NAME,
  OG_IMAGE_HEIGHT,
  OG_IMAGE_WIDTH,
} from "./branding";

const resolveFrom = createRequire(import.meta.url);

/**
 * Minimal typed stand-in for the element tree satori accepts. Satori is typed
 * against `ReactNode`, but these endpoints run outside JSX, so we describe the
 * tree structurally instead of casting the whole thing to `any`.
 */
interface OgNode {
  type: string;
  props: Record<string, unknown> & {
    children?: OgNode | OgNode[] | string | undefined;
  };
}

function el(
  type: string,
  props: Record<string, unknown>,
  children?: OgNode | OgNode[] | string,
): OgNode {
  return {
    type,
    props: { ...props, ...(children !== undefined ? { children } : {}) },
  };
}

/* ─── Palette ─────────────────────────────────────────────────────────── */

const OG_BG = "#07080b";
const OG_GLOW = "rgba(211, 157, 42, 0.13)";
const OG_GRID = "rgba(255, 255, 255, 0.055)";
const OG_FOREGROUND = "#f5f7fa";
const OG_MUTED = "#71798c";
const OG_CHIP_BG = "rgba(255, 255, 255, 0.035)";
const OG_CHIP_BORDER = "rgba(255, 255, 255, 0.09)";
const OG_CHIP_TEXT = "#e8ebf2";
const OG_CHIP_PATH = "#6b7383";

const GRID_STEP = 48;

/* ─── Fonts ───────────────────────────────────────────────────────────── */

type FontWeight = 400 | 500 | 800;

function loadFont(specifier: string): ArrayBuffer {
  const buffer = readFileSync(resolveFrom.resolve(specifier));
  return buffer.buffer.slice(
    buffer.byteOffset,
    buffer.byteOffset + buffer.byteLength,
  ) as ArrayBuffer;
}

function interFont(weight: FontWeight) {
  return {
    name: "Inter",
    data: loadFont(`@fontsource/inter/files/inter-latin-${weight}-normal.woff`),
    weight,
    style: "normal" as const,
  };
}

function monoFont(weight: 500) {
  return {
    name: "JetBrains Mono",
    data: loadFont(
      `@fontsource/jetbrains-mono/files/jetbrains-mono-latin-${weight}-normal.woff`,
    ),
    weight,
    style: "normal" as const,
  };
}

/* ─── Layers ──────────────────────────────────────────────────────────── */

/**
 * Satori's support for tiled `background-size` is unreliable, so the grid is
 * drawn as explicit hairlines instead of a repeating background image.
 */
function gridLayer(): OgNode {
  const lines: OgNode[] = [];

  for (let x = GRID_STEP; x < OG_IMAGE_WIDTH; x += GRID_STEP) {
    lines.push(
      el("div", {
        style: {
          position: "absolute",
          top: 0,
          left: `${x}px`,
          width: "1px",
          height: `${OG_IMAGE_HEIGHT}px`,
          backgroundColor: OG_GRID,
        },
      }),
    );
  }

  for (let y = GRID_STEP; y < OG_IMAGE_HEIGHT; y += GRID_STEP) {
    lines.push(
      el("div", {
        style: {
          position: "absolute",
          left: 0,
          top: `${y}px`,
          width: `${OG_IMAGE_WIDTH}px`,
          height: "1px",
          backgroundColor: OG_GRID,
        },
      }),
    );
  }

  return el(
    "div",
    { style: { position: "absolute", inset: 0, display: "flex" } },
    lines,
  );
}

function glowLayer(): OgNode {
  return el("div", {
    style: {
      position: "absolute",
      top: "-320px",
      left: "-260px",
      width: "1000px",
      height: "820px",
      backgroundImage: `radial-gradient(circle at center, ${OG_GLOW} 0%, rgba(211, 157, 42, 0) 62%)`,
    },
  });
}

function wordmark(): OgNode {
  return el(
    "div",
    { style: { display: "flex", alignItems: "center", gap: "16px" } },
    [
      el(
        "svg",
        { width: "50", height: "50", viewBox: "0 0 3000 3000" },
        el("path", { fill: BRAND_LOGO_FILL, d: BRAND_LOGO_PATH }),
      ),
      el(
        "span",
        {
          style: {
            fontSize: "42px",
            fontWeight: 800,
            color: OG_FOREGROUND,
            letterSpacing: "-1.4px",
          },
        },
        BRAND_NAME,
      ),
    ],
  );
}

function headline(
  lead: string,
  tail: string,
  leadSize: number,
  tailSize: number,
): OgNode {
  const line = (size: number) => ({
    fontSize: `${size}px`,
    fontWeight: 400,
    lineHeight: "1.14",
    letterSpacing: `${(-size * 0.032).toFixed(2)}px`,
  });

  return el(
    "div",
    {
      style: {
        display: "flex",
        flexDirection: "column",
        gap: tailSize < leadSize ? "14px" : "0px",
      },
    },
    [
      el("span", { style: { ...line(leadSize), color: OG_FOREGROUND } }, lead),
      el("span", { style: { ...line(tailSize), color: OG_MUTED } }, tail),
    ],
  );
}

function chip(pathname: string): OgNode {
  const path = pathname === "/" ? "" : pathname;

  return el(
    "div",
    {
      style: {
        display: "flex",
        alignItems: "center",
        gap: "14px",
        height: "60px",
        paddingLeft: "22px",
        paddingRight: "26px",
        borderRadius: "14px",
        backgroundColor: OG_CHIP_BG,
        borderWidth: "1px",
        borderStyle: "solid",
        borderColor: OG_CHIP_BORDER,
      },
    },
    [
      el("div", {
        style: {
          width: "10px",
          height: "10px",
          borderRadius: "2px",
          backgroundColor: BRAND_LOGO_FILL,
        },
      }),
      el(
        "span",
        {
          style: {
            display: "flex",
            fontFamily: "JetBrains Mono",
            fontSize: "21px",
            fontWeight: 500,
            letterSpacing: "-0.3px",
          },
        },
        [
          el("span", { style: { color: OG_CHIP_TEXT } }, BRAND_DOMAIN),
          ...(path
            ? [el("span", { style: { color: OG_CHIP_PATH } }, path)]
            : []),
        ],
      ),
    ],
  );
}

/* ─── Renderer ────────────────────────────────────────────────────────── */

export interface OgImageOptions {
  /** First headline line, rendered in the foreground colour. */
  lead: string;
  /** Second headline line, rendered muted. */
  tail: string;
  /** Path appended after the domain in the footer chip. `/` renders bare. */
  pathname?: string;
  /** Font size of the lead line. */
  leadSize?: number;
  /** Font size of the tail line. Smaller than `leadSize` turns it into a subtitle. */
  tailSize?: number;
}

export async function renderOgImage({
  lead,
  tail,
  pathname = "/",
  leadSize = 56,
  tailSize = 56,
}: OgImageOptions): Promise<Uint8Array> {
  const tree = el(
    "div",
    {
      style: {
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "space-between",
        width: `${OG_IMAGE_WIDTH}px`,
        height: `${OG_IMAGE_HEIGHT}px`,
        paddingTop: "76px",
        paddingBottom: "68px",
        paddingLeft: "80px",
        paddingRight: "80px",
        backgroundColor: OG_BG,
        fontFamily: "Inter",
      },
    },
    [
      gridLayer(),
      glowLayer(),
      wordmark(),
      headline(lead, tail, leadSize, tailSize),
      chip(pathname),
    ],
  );

  const svg = await satori(tree as unknown as Parameters<typeof satori>[0], {
    width: OG_IMAGE_WIDTH,
    height: OG_IMAGE_HEIGHT,
    fonts: [interFont(400), interFont(500), interFont(800), monoFont(500)],
  });

  const resvg = new Resvg(svg, {
    fitTo: { mode: "width", value: OG_IMAGE_WIDTH },
  });

  return new Uint8Array(resvg.render().asPng());
}

export function ogResponse(png: Uint8Array): Response {
  const body = png.buffer.slice(
    png.byteOffset,
    png.byteOffset + png.byteLength,
  ) as ArrayBuffer;

  return new Response(body, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { Resvg } from "@resvg/resvg-js";
import type { APIRoute } from "astro";
import satori from "satori";
import {
  BRAND_DOMAIN,
  BRAND_LOGO_FILL,
  BRAND_LOGO_PATH,
  BRAND_NAME,
  BRAND_OG_DESCRIPTION,
  BRAND_TAGLINE,
  OG_IMAGE_HEIGHT,
  OG_IMAGE_WIDTH,
} from "../lib/branding";

export const prerender = true;

function loadFont(weight: 400 | 700): ArrayBuffer {
  const file = `inter-latin-${weight}-normal.woff`;
  const fontPath = join(
    process.cwd(),
    "node_modules/@fontsource/inter/files",
    file,
  );
  return readFileSync(fontPath).buffer as ArrayBuffer;
}

export const GET: APIRoute = async () => {
  const [regular, bold] = [loadFont(400), loadFont(700)];

  const svg = await satori(
    {
      type: "div",
      props: {
        style: {
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#0B0E1A",
          padding: "64px 72px",
          fontFamily: "Inter",
          position: "relative",
        },
        children: [
          // Top golden gradient line
          {
            type: "div",
            props: {
              style: {
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "3px",
                background:
                  "linear-gradient(to right, transparent, #D4A017 30%, #F0C040 50%, #D4A017 70%, transparent)",
              },
            },
          },

          // Subtle dot grid background
          {
            type: "div",
            props: {
              style: {
                position: "absolute",
                inset: 0,
                backgroundImage:
                  "radial-gradient(circle, rgba(212,160,23,0.12) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              },
            },
          },

          // Content — fills remaining height
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                flexDirection: "column",
                flex: 1,
                justifyContent: "space-between",
                zIndex: 1,
              },
              children: [
                // Logo row
                {
                  type: "div",
                  props: {
                    style: {
                      display: "flex",
                      alignItems: "center",
                      gap: "14px",
                    },
                    children: [
                      // Brand logo
                      {
                        type: "svg",
                        props: {
                          width: "44",
                          height: "44",
                          viewBox: "0 0 3000 3000",
                          children: [
                            {
                              type: "path",
                              props: {
                                fill: BRAND_LOGO_FILL,
                                d: BRAND_LOGO_PATH,
                              },
                            },
                          ],
                        },
                      },
                      // Brand name
                      {
                        type: "span",
                        props: {
                          style: {
                            fontSize: "28px",
                            fontWeight: 700,
                            color: "#F0F4FF",
                            letterSpacing: "-0.5px",
                          },
                          children: BRAND_NAME,
                        },
                      },
                    ],
                  },
                },

                // Main headline + subtext block
                {
                  type: "div",
                  props: {
                    style: {
                      display: "flex",
                      flexDirection: "column",
                      gap: "20px",
                    },
                    children: [
                      {
                        type: "p",
                        props: {
                          style: {
                            fontSize: "68px",
                            fontWeight: 700,
                            color: "#F0F4FF",
                            lineHeight: "1.1",
                            margin: 0,
                            letterSpacing: "-2px",
                          },
                          children: `${BRAND_TAGLINE.replace(" for ", "\nfor ")}.`,
                        },
                      },
                      {
                        type: "p",
                        props: {
                          style: {
                            fontSize: "26px",
                            fontWeight: 400,
                            color: "#8A93B0",
                            margin: 0,
                            letterSpacing: "-0.3px",
                          },
                          children: BRAND_OG_DESCRIPTION,
                        },
                      },
                    ],
                  },
                },

                // Footer row — URL
                {
                  type: "div",
                  props: {
                    style: {
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    },
                    children: [
                      {
                        type: "div",
                        props: {
                          style: {
                            width: "6px",
                            height: "6px",
                            borderRadius: "50%",
                            backgroundColor: "#F0C040",
                          },
                        },
                      },
                      {
                        type: "span",
                        props: {
                          style: {
                            fontSize: "20px",
                            fontWeight: 400,
                            color: "#4A5270",
                            letterSpacing: "0px",
                          },
                          children: BRAND_DOMAIN,
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    } as any,
    {
      width: OG_IMAGE_WIDTH,
      height: OG_IMAGE_HEIGHT,
      fonts: [
        { name: "Inter", data: regular, weight: 400, style: "normal" },
        { name: "Inter", data: bold, weight: 700, style: "normal" },
      ],
    },
  );

  const resvg = new Resvg(svg, {
    fitTo: { mode: "width", value: OG_IMAGE_WIDTH },
  });
  const png = resvg.render().asPng();

  return new Response(new Uint8Array(png), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};

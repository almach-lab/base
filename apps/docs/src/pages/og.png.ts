import type { APIRoute } from "astro";
import {
  BRAND_OG_HEADLINE_LEAD,
  BRAND_OG_HEADLINE_TAIL,
} from "../lib/branding";
import { ogResponse, renderOgImage } from "../lib/og";

export const prerender = true;

export const GET: APIRoute = async () => {
  const png = await renderOgImage({
    lead: BRAND_OG_HEADLINE_LEAD,
    tail: BRAND_OG_HEADLINE_TAIL,
  });

  return ogResponse(png);
};

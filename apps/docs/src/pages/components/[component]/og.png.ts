import type { APIRoute, GetStaticPaths } from "astro";
import { DOC_COMPONENT_ITEMS } from "../../../lib/doc-components";
import { ogResponse, renderOgImage } from "../../../lib/og";

export const prerender = true;

export const getStaticPaths: GetStaticPaths = () =>
  DOC_COMPONENT_ITEMS.map((item) => ({
    params: { component: item.slug },
    props: { name: item.name, description: item.description },
  }));

export const GET: APIRoute = async ({ props, params }) => {
  const { name, description } = props as {
    name: string;
    description: string;
  };

  const png = await renderOgImage({
    lead: name,
    tail: description,
    leadSize: 68,
    tailSize: 30,
    pathname: `/components/${params.component}`,
  });

  return ogResponse(png);
};

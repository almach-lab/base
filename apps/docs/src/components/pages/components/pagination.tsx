import { Pagination } from "@almach/ui";
import { useState } from "react";
import { ComponentDoc } from "../../component-doc";
import { DemoStack } from "../../docs/demo";

function PaginationDemo({
  pageCount,
  siblingCount,
  size,
}: {
  pageCount: number;
  siblingCount?: number;
  size?: "sm" | "default" | "lg";
}) {
  const [page, setPage] = useState(1);

  return (
    <Pagination
      page={page}
      pageCount={pageCount}
      onPageChange={setPage}
      {...(siblingCount !== undefined ? { siblingCount } : {})}
      {...(size ? { size } : {})}
    />
  );
}

export function PaginationPage() {
  return (
    <ComponentDoc
      name="Pagination"
      description="Page navigation with collapsed ranges. Standalone and controlled, so it works with any data source — including Table.Data."
      examples={[
        {
          title: "Default",
          description:
            "First and last pages always show; the middle collapses to an ellipsis.",
          preview: <PaginationDemo pageCount={12} />,
          code: `const [page, setPage] = useState(1);

<Pagination page={page} pageCount={12} onPageChange={setPage} />`,
        },
        {
          title: "Wider window",
          description:
            "Raise siblingCount to show more pages either side of the current one.",
          preview: <PaginationDemo pageCount={24} siblingCount={2} />,
          code: `<Pagination page={page} pageCount={24} onPageChange={setPage} siblingCount={2} />`,
        },
        {
          title: "Sizes",
          preview: (
            <DemoStack className="items-start">
              <PaginationDemo pageCount={8} size="sm" />
              <PaginationDemo pageCount={8} />
              <PaginationDemo pageCount={8} size="lg" />
            </DemoStack>
          ),
          code: `<Pagination size="sm" … />
<Pagination … />
<Pagination size="lg" … />`,
          centered: false,
        },
      ]}
      props={[
        {
          name: "page",
          type: "number",
          required: true,
          description: "Current page, 1-indexed.",
        },
        {
          name: "pageCount",
          type: "number",
          required: true,
          description: "Total number of pages.",
        },
        {
          name: "onPageChange",
          type: "(page: number) => void",
          description: "Fired with the clamped target page.",
        },
        {
          name: "siblingCount",
          type: "number",
          default: "1",
          description: "Pages rendered either side of the current page.",
        },
        {
          name: "boundaryCount",
          type: "number",
          default: "1",
          description: "Pages always rendered at each end.",
        },
        {
          name: "showPageNumbers",
          type: "boolean",
          default: "true",
          description:
            "When false, only the previous and next controls render.",
        },
        {
          name: "size",
          type: '"sm" | "default" | "lg"',
          default: '"default"',
          description: "Control dimensions.",
        },
        {
          name: "getPaginationRange",
          type: '(options) => (number | "ellipsis")[]',
          description:
            "Exported helper if you need the same range logic in a custom layout.",
        },
      ]}
    />
  );
}

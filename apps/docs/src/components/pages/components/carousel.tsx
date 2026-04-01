import * as React from "react";
import { Carousel, Card, Badge } from "@almach/ui";
import { cn } from "@almach/utils";
import { ComponentDoc } from "../../component-doc";

const SLIDES = [
	{ title: "Mountain Sunrise", tag: "Nature", color: "from-orange-400 to-rose-500" },
	{ title: "Ocean Depths", tag: "Photography", color: "from-blue-400 to-cyan-600" },
	{ title: "Forest Path", tag: "Travel", color: "from-green-400 to-emerald-600" },
	{ title: "City Lights", tag: "Urban", color: "from-violet-500 to-purple-700" },
];

export function CarouselPage() {
	return (
		<ComponentDoc
			name="Carousel"
			description="Touch-friendly horizontal slide carousel built with CSS scroll-snap. No external dependencies. Supports arrows, dots, multiple slides per view, and loop mode."
			pkg="@almach/ui"
			examples={[
				{
					title: "With arrows",
					description: "Carousel.Previous and Carousel.Next float over the slides.",
					preview: (
						<Carousel className="w-full max-w-md">
							<Carousel.Content>
								{SLIDES.map((s) => (
									<Carousel.Item key={s.title}>
										<div
											className={cn(
												"flex h-40 items-end rounded-xl bg-gradient-to-br p-4",
												s.color,
											)}
										>
											<div>
												<Badge variant="secondary" className="mb-1 text-[10px]">
													{s.tag}
												</Badge>
												<p className="font-semibold text-white">{s.title}</p>
											</div>
										</div>
									</Carousel.Item>
								))}
							</Carousel.Content>
							<Carousel.Previous />
							<Carousel.Next />
						</Carousel>
					),
					code: `<Carousel>
  <Carousel.Content>
    {slides.map((s) => (
      <Carousel.Item key={s.title}>
        <div className="h-40 rounded-xl bg-gradient-to-br ...">
          {s.title}
        </div>
      </Carousel.Item>
    ))}
  </Carousel.Content>
  <Carousel.Previous />
  <Carousel.Next />
</Carousel>`,
				},
				{
					title: "With dots",
					description: "Add Carousel.Dots below the content for page indicators.",
					preview: (
						<Carousel className="w-full max-w-md">
							<Carousel.Content>
								{SLIDES.map((s) => (
									<Carousel.Item key={s.title}>
										<div
											className={cn(
												"flex h-36 items-center justify-center rounded-xl bg-gradient-to-br",
												s.color,
											)}
										>
											<p className="text-lg font-bold text-white">{s.title}</p>
										</div>
									</Carousel.Item>
								))}
							</Carousel.Content>
							<Carousel.Dots />
						</Carousel>
					),
					code: `<Carousel>
  <Carousel.Content>
    {slides.map((s) => (
      <Carousel.Item key={s.title}>{s.title}</Carousel.Item>
    ))}
  </Carousel.Content>
  <Carousel.Dots />
</Carousel>`,
				},
				{
					title: "Multiple per view",
					description:
						"Set basis-1/2 or basis-1/3 on Carousel.Item to show several slides.",
					preview: (
						<Carousel className="w-full max-w-md">
							<Carousel.Content>
								{SLIDES.map((s) => (
									<Carousel.Item key={s.title} className="basis-1/2">
										<div
											className={cn(
												"flex h-28 items-center justify-center rounded-xl bg-gradient-to-br text-sm font-semibold text-white",
												s.color,
											)}
										>
											{s.title}
										</div>
									</Carousel.Item>
								))}
							</Carousel.Content>
							<Carousel.Previous />
							<Carousel.Next />
						</Carousel>
					),
					code: `<Carousel>
  <Carousel.Content>
    {slides.map((s) => (
      <Carousel.Item key={s.title} className="basis-1/2">
        {/* slide content */}
      </Carousel.Item>
    ))}
  </Carousel.Content>
  <Carousel.Previous />
  <Carousel.Next />
</Carousel>`,
				},
				{
					title: "Card slides",
					description: "Use Card inside each Carousel.Item for structured content.",
					preview: (
						<Carousel className="w-full max-w-sm">
							<Carousel.Content>
								{[
									{ title: "Analytics", value: "12,430", delta: "+8.2%" },
									{ title: "Revenue", value: "$48,200", delta: "+12.1%" },
									{ title: "Users", value: "3,201", delta: "+4.5%" },
								].map((stat) => (
									<Carousel.Item key={stat.title}>
										<Card>
											<Card.Content>
												<p className="text-sm text-muted-foreground">{stat.title}</p>
												<p className="mt-1 text-2xl font-bold">{stat.value}</p>
												<Badge variant="success" className="mt-2">
													{stat.delta}
												</Badge>
											</Card.Content>
										</Card>
									</Carousel.Item>
								))}
							</Carousel.Content>
							<Carousel.Dots />
						</Carousel>
					),
					code: `<Carousel>
  <Carousel.Content>
    {stats.map((s) => (
      <Carousel.Item key={s.title}>
        <Card>
          <Card.Content>
            <p className="text-muted-foreground">{s.title}</p>
            <p className="text-2xl font-bold">{s.value}</p>
          </Card.Content>
        </Card>
      </Carousel.Item>
    ))}
  </Carousel.Content>
  <Carousel.Dots />
</Carousel>`,
				},
				{
					title: "Loop",
					description: "loop wraps around from last slide back to first.",
					preview: (
						<Carousel loop className="w-full max-w-md">
							<Carousel.Content>
								{SLIDES.map((s) => (
									<Carousel.Item key={s.title}>
										<div
											className={cn(
												"flex h-32 items-center justify-center rounded-xl bg-gradient-to-br text-white font-bold",
												s.color,
											)}
										>
											{s.title}
										</div>
									</Carousel.Item>
								))}
							</Carousel.Content>
							<Carousel.Previous />
							<Carousel.Next />
							<Carousel.Dots />
						</Carousel>
					),
					code: `<Carousel loop>
  <Carousel.Content>...</Carousel.Content>
  <Carousel.Previous />
  <Carousel.Next />
  <Carousel.Dots />
</Carousel>`,
				},
			]}
			props={[
				{
					name: "loop",
					type: "boolean",
					description: "Wrap from last to first slide and vice versa.",
				},
				{
					name: "Carousel.Item › className",
					type: "string",
					description:
						'Controls how many slides are visible. Default basis-full (1 slide). Use basis-1/2 for 2, basis-1/3 for 3.',
				},
				{
					name: "Carousel.Previous / Next",
					type: "ButtonHTMLAttributes",
					description:
						"Arrow buttons. Disabled automatically when at the boundary (unless loop).",
				},
				{
					name: "Carousel.Dots",
					type: "{ className?: string }",
					description:
						"Dot indicators. Clicking a dot jumps to that slide. Active dot expands.",
				},
			]}
		/>
	);
}

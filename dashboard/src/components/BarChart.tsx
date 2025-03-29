import {
  Bar,
  BarChart as RechartBarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Card } from "./Cards";

export function BarChart({ data, config, ...props }) {

  return (
    <Card {...props} fixLeftPadding title={"title"} description={"description"}>
      <ChartContainer config={config} className="w-full max-h-[280px]">
        <RechartBarChart accessibilityLayer data={data}>
          <CartesianGrid vertical={false} />
          <YAxis tickLine={false} axisLine={false} />
          <XAxis
            dataKey="emotion"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar dataKey="negative" fill="var(--color-positive)" radius={4} />
          <Bar dataKey="neutral" fill="var(--color-neutral)" radius={4} />
          <Bar dataKey="positive" fill="var(--chart-1)" radius={4} />
        </RechartBarChart>
      </ChartContainer>
    </Card>
  );
}

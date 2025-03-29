import {
  CartesianGrid,
  Line,
  LineChart as RechartLineChart,
  XAxis,
  YAxis,
} from "recharts";

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Card } from "./Cards";
import { useEffect, useState } from "react";
import { getEmotionByMonth } from "@/controllers";
import { useDownloadChart } from "@/hooks/useDownloadChart";

export function LineChart({ ...props }) {
  const [data, setData] = useState([]);
  const [config, setConfig] = useState({});

  const { chartRef, downloadChart } = useDownloadChart();

  useEffect(() => {
    const fetchData = async () => {
      const [data, config] = await getEmotionByMonth();
      setData(data);
      setConfig(config);
    };
    fetchData();
  }, []);

  return (
    <Card
      {...props}
      downloadChart={downloadChart}
      title={"Monthly Distribution of Primary Emotions"}
      description={
        "Visualizes the variation of primary emotions identified by NRC throughout the months, allowing the detection of seasonal patterns or shifts in collective emotional states."
      }
    >
      <ChartContainer
        ref={chartRef}
        className="w-full min-h-[300px] max-h-[350px]"
        config={config}
      >
        <RechartLineChart accessibilityLayer data={data}>
          <CartesianGrid vertical={false} />
          <YAxis tickLine={false} axisLine={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            //tickFormatter={(value) => value.slice(0, 3)}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <ChartLegend
            content={
              <ChartLegendContent className="flex flex-wrap justify-center gap-x-2" />
            }
          />
          {Object.keys(config).map((key) => (
            <Line
              dataKey={key}
              type="linear"
              stroke={`var(--color-${key})`}
              strokeWidth={2}
              dot={false}
            />
          ))}
        </RechartLineChart>
      </ChartContainer>
    </Card>
  );
}

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
import { getHourlySentiment } from "@/controllers";
import { useDownloadChart } from "@/hooks/useDownloadChart";

export function LineChart2({ ...props }) {
  const [data, setData] = useState([]);
  const [config, setConfig] = useState({});

  const { chartRef, downloadChart } = useDownloadChart();

  useEffect(() => {
    const fetchData = async () => {
      const [data, config] = await getHourlySentiment();
      setData(data);
      setConfig(config);
    };
    fetchData();
  }, []);

  return (
    <Card
      {...props}
      downloadChart={downloadChart}
      title={"Hourly Distribution of VADER Sentiments"}
      description={
        " Examines how positive, negative, and neutral sentiments vary by hour, helping identify temporal emotional patterns."
      }
    >
      <ChartContainer
        ref={chartRef}
        className="w-full max-h-[350px]"
        config={config}
      >
        <RechartLineChart accessibilityLayer data={data}>
          <CartesianGrid vertical={false} />
          <YAxis tickLine={false} axisLine={false} />
          <XAxis
            dataKey="hour"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            //tickFormatter={(value) => value.slice(0, 3)}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <ChartLegend content={<ChartLegendContent />} />
          {Object.keys(config).map((key) => (
            <Line
              dataKey={key}
              type={"monotone"}
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

import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Card } from "./Cards";
import { getPrimaryEmotionsBySubreddit } from "@/controllers";
import { useDownloadChart } from "@/hooks/useDownloadChart";
import { Button } from "@/components/ui/button";
import { ArrowDownToLine } from "lucide-react";

export function BarChartStacked({ ...props }) {
  const [data, setData] = useState([]);
  const [config, setConfig] = useState({});

  const { chartRef, downloadChart } = useDownloadChart();

  useEffect(() => {
    const fetchData = async () => {
      const [data, config] = await getPrimaryEmotionsBySubreddit();
      setData(data);
      setConfig(config);
    };
    fetchData();
  }, []);

  return (
    <Card
      {...props}
      downloadChart={downloadChart}
      title="Primary Emotion Distribution by Subreddit"
      description="Visualizes the predominant emotions identified by the NRC model for each subreddit, highlighting emotional differences among communities."
    >
      <ChartContainer
        ref={chartRef}
        config={config}
        className="max-h-[400px] w-full"
      >
        <BarChart accessibilityLayer data={data}>
          <CartesianGrid vertical={false} />
          <YAxis tickLine={false} axisLine={false} />
          <XAxis
            allowDuplicatedCategory={false}
            dataKey={"subreddit"}
            tickLine={false}
            tickMargin={10}
            axisLine={false}
          />
          <ChartTooltip content={<ChartTooltipContent hideLabel />} />
          <ChartLegend content={<ChartLegendContent />} />

          {Object.entries(config).map(([key]) => (
            <Bar dataKey={key} stackId={"a"} fill={`var(--color-${key})`} />
          ))}
        </BarChart>
      </ChartContainer>
    </Card>
  );
}

import { TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Card } from "./Cards";
import { useEffect, useState } from "react";
import { getAvgWordCountPerSubreddit } from "@/controllers";
import { useDownloadChart } from "@/hooks/useDownloadChart";

export function HorizontalBarChart({ ...props }) {
  const [data, setData] = useState([]);
  const [config, setConfig] = useState({});

    const { chartRef, downloadChart } = useDownloadChart();

  useEffect(() => {
    const fetchData = async () => {
      const [data, config] = await getAvgWordCountPerSubreddit();
      setData(data);
      setConfig(config);
    };
    fetchData();
  }, []);

  console.log(data);

  return (
    <Card
    downloadChart={downloadChart}
      {...props}
      title="Average Word Count per Post in Each Subreddit"
      description=" Compares the average word count of posts across subreddits, indicating the depth of discussions in each community."
    >
      <ChartContainer ref={chartRef} config={config} className="mx-auto max-h-[250px] h-full w-full">
        <BarChart
          accessibilityLayer
          data={data}
          layout="vertical"
          margin={{
            right: 30,
          }}
        >
          <CartesianGrid horizontal={false} />
          <YAxis
            dataKey="subreddit"
            type="category"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            hide
          />
          <XAxis dataKey="avg_word_count" type="number" hide />
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                style={{ minWidth: "200px" }}
                indicator="line"
              />
            }
          />
          <Bar
            dataKey="avg_word_count"
            layout="vertical"
            fill="var(--color-avg_word_count)"
            radius={4}
          >
            <LabelList
              dataKey="subreddit"
              position="insideLeft"
              offset={8}
              className="font-semibold"
              fill="var(--color-label)"
              fontSize={12}
            />
            <LabelList
              dataKey="avg_word_count"
              position="right"
              offset={8}
              className="fill-foreground"
              fontSize={12}
            />
          </Bar>
        </BarChart>
      </ChartContainer>
    </Card>
  );
}

import { LabelList, Pie, PieChart as RechartPiechart } from "recharts";

import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Card } from "./Cards";
import { getMostCommonWordsCount } from "@/controllers";
import { useEffect, useState } from "react";
import { useDownloadChart } from "@/hooks/useDownloadChart";

export function PieChart({ ...props }) {
  const [data, setData] = useState([]);
  const [config, setConfig] = useState({});

  const { chartRef, downloadChart } = useDownloadChart();

  useEffect(() => {
    const fetchData = async () => {
      const [data, config] = await getMostCommonWordsCount();
      setData(data);
      setConfig(config);
    };
    fetchData();
  }, []);

  return (
    <Card
      {...props}
      downloadChart={downloadChart}
      title="Most Common Words"
      description="Displays the most frequent words in Reddit posts related to mental disorders, providing an overview of recurring topics."
    >
      <ChartContainer
        ref={chartRef}
        config={config}
        className="w-full mx-auto aspect-square max-h-[280px] [&_.recharts-text]:fill-background [&_.recharts-pie-label-text]:fill-foreground"
      >
        <RechartPiechart>
          <ChartTooltip
            content={<ChartTooltipContent nameKey="count" hideLabel />}
          />
          <Pie
            data={data}
            dataKey="count"
            innerRadius={40}
            outerRadius={100}
            labelLine={(props) => {
              const { points } = props;
              const [start, end] = points;
              // Acorta la línea al 50% de su longitud original:
              const shortenedEnd = {
                x: start.x + (end.x - start.x) * 0.5,
                y: start.y + (end.y - start.y) * 0.5,
              };
              return (
                <line
                  x1={start.x}
                  y1={start.y}
                  x2={shortenedEnd.x}
                  y2={shortenedEnd.y}
                  stroke={props.stroke}
                  strokeWidth={1}
                />
              );
            }}
            strokeWidth={"2px"}
            label={({ x, y, word }) => (
              <text
                x={x}
                y={y}
                fill="black"
                textAnchor="middle"
                dominantBaseline="central"
              >
                {word}
              </text>
            )}
          >
            <LabelList
              stroke="2px"
              valueAccessor={({ percent }) => `${(percent * 100).toFixed(1)}%`}
              fontSize={12}
              position="inside"
              angle={0}
              offset={10}
            />
          </Pie>
        </RechartPiechart>
      </ChartContainer>
    </Card>
  );
}

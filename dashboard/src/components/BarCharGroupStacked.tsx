import {
  Bar,
  BarChart,
  CartesianGrid,
  Customized,
  LabelList,
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

import { useEffect, useState } from "react";
import { getDetailedEmotionsDistribution } from "@/controllers";
import { useDownloadChart } from "@/hooks/useDownloadChart";

const RenderCustomizedLabel = ({ label, ...props }) => {
  const { x, y, width } = props;
  const offset = 10; // Ajusta este valor según necesites
  return (
    <g>
      <text
        x={x + width / 2}
        y={y - offset}
        fill="black"
        textAnchor="middle"
        dominantBaseline="central"
      >
        {label}
      </text>
    </g>
  );
};

export function BarChartGroupStacked({ ...props }) {
  const [data, setData] = useState([]);
  const [config, setConfig] = useState({});

  const { chartRef, downloadChart } = useDownloadChart();

  useEffect(() => {
    const fetchData = async () => {
      const [data, config] = await getDetailedEmotionsDistribution();

      setData(data);
      setConfig(config);
    };
    fetchData();
  }, []);

  console.log(data);
  return (
    <Card
      {...props}
      downloadChart={downloadChart}
      title="Detailed Distribution of Emotions by Sentiment Models"
      description=" Analyzes the distribution of primary emotions identified by the NRC model, categorized by VADER and NRC sentiments (positive, negative, neutral). This graph reveals how each primary emotion aligns with both sentiment models."
    >
      <ChartContainer
        ref={chartRef}
        config={config}
        className="mx-auto max-h-[350px] w-full"
      >
        <BarChart accessibilityLayer data={data}>
          <CartesianGrid vertical={false} />
          <YAxis tickLine={false} axisLine={false} />
          <XAxis
            allowDuplicatedCategory={false}
            dataKey={"emotion"}
            tickLine={false}
            tickMargin={10}
            axisLine={false}
          />
          <ChartTooltip content={<ChartTooltipContent hideLabel />} />
          {Object.entries(config).map(([categorizer, { label, sentiments }]) =>
            Object.entries(sentiments).map(
              ([sentiment, color], sentimentIndex, arr) => (
                <Bar
                  key={`${categorizer}_${sentiment}`}
                  dataKey={`${categorizer}_${sentiment}`}
                  stackId={categorizer}
                  fill={color}
                  name={`${label} - ${sentiment}`}
                >
                  {sentimentIndex === arr.length - 1 && (
                    <LabelList
                      content={(props) => (
                        <RenderCustomizedLabel {...props} label={label} />
                      )}
                    />
                  )}
                </Bar>
              )
            )
          )}
        </BarChart>
      </ChartContainer>
    </Card>
  );
}

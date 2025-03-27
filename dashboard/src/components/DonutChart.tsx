import { TrendingUp } from "lucide-react";
import { Cell, LabelList, Legend, Pie, PieChart, Sector } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Card } from "./Cards";
import {
  getCommonWordsByNRCSentiment,
  getCommonWordsByVaderSentiment,
} from "@/controllers";
import { useEffect, useState } from "react";
import { useDownloadChart } from "@/hooks/useDownloadChart";

const COLORS = {
  positive: "#93c47d",
  neutral: "#a4c2f4",
  negative: "#e06666",
};

const chartConfig = {
  positive: {
    label: "Positive",
  },
  neutral: {
    label: "Neutral",
  },
  negative: {
    label: "Negative",
  },
};

export function DonutChart({ ...props }) {
  const [innerData, setInnerData] = useState([]);
  const [outerData, setOuterData] = useState([]);
  const [innerData2, setInnerData2] = useState([]);
  const [outerData2, setOuterData2] = useState([]);
  const { chartRef, downloadChart } = useDownloadChart();

  useEffect(() => {
    const fetchData = async () => {
      const [data] = await getCommonWordsByNRCSentiment();

      const innerData = Object.keys(data).map((sentiment) => ({
        category: sentiment,
        count: data[sentiment].reduce((acc, word) => acc + word.count, 0),
        fill: COLORS[sentiment],
      }));

      const outerData = Object.entries(data).flatMap(([sentiment, words]) =>
        words.map((word, index) => ({
          category: `${word.word}`,
          count: word.count,
          sentiment,
          fill: COLORS[sentiment],
          stroke: "#d0d0d0",
          strokeWidth: 1.5
        }))
      );

      setOuterData(outerData);
      setInnerData(innerData);

      const [data2] = await getCommonWordsByVaderSentiment();
      const innerData2 = Object.keys(data2).map((sentiment) => ({
        category: sentiment,
        count: data2[sentiment].reduce((acc, word) => acc + word.count, 0),
        fill: COLORS[sentiment],
      }));

      const outerData2 = Object.entries(data2).flatMap(([sentiment, words]) =>
        words.map((word, index) => ({
          category: `${word.word}`,
          count: word.count,
          sentiment,
          fill: COLORS[sentiment],
          stroke: "#d0d0d0",
          strokeWidth: 1.5
        }))
      );

      setOuterData2(outerData2);
      setInnerData2(innerData2);
    };

    fetchData();
  }, []);

  const renderLegend = (data) => (
    <ul className="text-sm mt-4 grid grid-cols-2 gap-x-4">
      {data.map((item, index) => (
        <li key={index} className="flex justify-between items-center">
          <span className="font-semibold" style={{ color: COLORS[item.sentiment] }}>{item.category}</span>
          <span style={{ color: COLORS[item.sentiment] }}>({item.sentiment})</span>
          <span style={{ color: COLORS[item.sentiment] }}>{item.count}</span>
        </li>
      ))}
    </ul>
  );

  return (
    <Card
      {...props}
      downloadChart={downloadChart}
      title="Top 3 Most Common Words by NRC Sentiments VS Top 3 Most Common Words by VADER Sentiments"
      description="Displays the most frequent words associated with each sentiment categorized by the VADER model and the NRC model (positive, negative, neutral)."
    >
      <div ref={chartRef} className="w-full text-center flex justify-around items-start gap-6">
        <div className="flex flex-col items-center">
          <h3 className="font-bold">NRC Sentiments</h3>
          <ChartContainer className="w-full aspect-square" config={chartConfig}>
            <PieChart>
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
              <Pie data={innerData} dataKey="count" nameKey="category" innerRadius={40} outerRadius={80} />
              <Pie data={outerData} dataKey="count" nameKey="category" innerRadius={90} outerRadius={100} label={{ fontWeight: "600" }} />
            </PieChart>
          </ChartContainer>
          {renderLegend(outerData)}
        </div>

        <div className="flex flex-col items-center">
          <h3 className="font-bold">VADER Sentiments</h3>
          <ChartContainer className="w-full aspect-square" config={chartConfig}>
            <PieChart>
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
              <Pie data={innerData2} dataKey="count" nameKey="category" innerRadius={40} outerRadius={80} />
              <Pie data={outerData2} dataKey="count" nameKey="category" innerRadius={90} outerRadius={100} label={{ fontWeight: "600" }} />
            </PieChart>
          </ChartContainer>
          {renderLegend(outerData2)}
        </div>
      </div>
    </Card>
  );
}

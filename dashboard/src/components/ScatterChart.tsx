import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  LabelList,
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

const CustomShape = ({ cx, cy, payload, shapeType }) => {
  if (shapeType === "square") {
    return <rect x={cx - 5} y={cy - 5} width={10} height={10} fill="#8884d8" />;
  }
  return <circle cx={cx} cy={cy} r={5} fill="#8884d8" />;
};

export default function BubbleChart({ data, config, ...props }: { data: [] }) {
  return (
    <Card {...props} title="test" description="">
      <ChartContainer config={config} className="min-h-[200px] w-full">
        <ScatterChart width={400} height={300}>
          <CartesianGrid />
          <XAxis type="number" dataKey="positive" name="Positivo" />
          <YAxis type="number" dataKey="negative" name="Negativo" />
          <ZAxis
            type="number"
            dataKey="neutral"
            name="Neutral"
            range={[100, 10000]}
          />
          <ChartTooltip  />
          <ChartLegend  />
          {/* Tristeza */}
          <Scatter
            name="Tristeza - Vader"
            data={data.filter((d) => d.emotion === "tristeza" && d.categorizer === "nrc")}
            fill="#8884d8"
            shape="circle"
          >
             <LabelList  dataKey="emotion" />
            </Scatter>
          <Scatter
            name="Tristeza - NRC"
            data={data.filter((d) => d.emotion === "tristeza" && d.categorizer === "vader")}
            fill="#8884d8"
            shape="square"
          >
              <LabelList  dataKey="emotion" />
              </Scatter>

          {/* Felicidad */}
            <Scatter
            name="Felicidad - Vader"
            data={data.filter(
              (d) => d.emotion === "felicidad" && d.categorizer === "vader"
            )}
            fill="#ffc658"
              shape="square"
          >
              <LabelList  dataKey="emotion" />
              </Scatter>
          <Scatter
            name="Felicidad - NRC"
            data={data.filter(
              (d) => d.emotion === "felicidad" && d.categorizer === "nrc"
            )}
            fill="#ffc658"
            shape="circle"
          > 
            <LabelList  dataKey="emotion" />
            </Scatter>
        </ScatterChart>
      </ChartContainer>
    </Card>
  );
}

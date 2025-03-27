"use client"

import { TrendingUp } from "lucide-react"
import { Pie, PieChart } from "recharts"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"



const COLORS = {
  positive: "#4caf50",
  neutral: "#60a5fa",
  negative: "#f44336",
};

const data = {
  positive: [
    { word: "esperanza", count: 10 },
    { word: "tranquilo", count: 8 },
    { word: "seguro", count: 6 },
  ],
  neutral: [
    { word: "habitual", count: 12 },
    { word: "cotidiano", count: 9 },
    { word: "común", count: 7 },
  ],
  negative: [
    { word: "miedo", count: 15 },
    { word: "preocupación", count: 13 },
    { word: "tensión", count: 10 },
  ],
};

const chartConfig = {
  positive: {
    label: "Positive",
    color: "#4caf50", // Verde
  },
  neutral: {
    label: "Neutral",
    color: "#60a5fa", // Azul
  },
  negative: {
    label: "Negative",
    color: "#f44336", // Rojo
  },
  miedo: {
    label: "Miedo",
    color: "#f44336"
  }
};

// Datos para el círculo interior
const innerData = Object.keys(data).map((sentiment) => ({
  category: sentiment,
  count: data[sentiment].reduce((acc, word) => acc + word.count, 0),
  fill: COLORS[sentiment],
}));

// Datos para el círculo exterior
const outerData = Object.entries(data).flatMap(([sentiment, words]) =>
  words.map((word) => ({
    category: `${word.word}`,
    count: word.count,
    label: `${word.word} - (${word.count})`,
    sentiment,
    fill: COLORS[sentiment],
  }))
);

export function TestComp() {
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Pie Chart - Label</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px] pb-0 [&_.recharts-pie-label-text]:fill-foreground"
        >
      <PieChart>
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />

          {/* Círculo interior */}
          <Pie
            data={innerData}
            dataKey="count"
            nameKey="category"
            innerRadius={20}
            outerRadius={50}
            strokeWidth={20}
            isAnimationActive={false}
          ></Pie>

          {/* Círculo exterior */}
          <Pie
            data={outerData}
            dataKey="count"
            nameKey="category"
            innerRadius={60}
            outerRadius={90}
            isAnimationActive={false}
            label={{
              fontWeight: "600"
            }}
            labelLine={{
              strokeWidth: 2,
            }}
          >
          </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}


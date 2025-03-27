import {
  Word,
  WordCloud,
  WordCloudProps,
  Gradient,
} from "@isoterik/react-word-cloud";
import { Card } from "./Cards";

export function CloudWords() {
  const words: Word[] = [
    { text: "data", value: 30 },
    { text: "analysis", value: 25 },
    { text: "dashboard", value: 20 },
    { text: "report", value: 18 },
    { text: "chart", value: 15 },
    { text: "visualization", value: 12 },
    { text: "insight", value: 10 },
    { text: "report", value: 18 },
    { text: "chart", value: 15 },
    { text: "visualization", value: 12 },
    { text: "insight", value: 10 },
  ];

  const gradients: Gradient[] = [
    {
      id: "gradient1",
      type: "linear",
      angle: 45, // in degrees
      stops: [
        { offset: "0%", color: "#ff7e5f" },
        { offset: "100%", color: "#feb47b" },
      ],
    },
    {
      id: "gradient2",
      type: "radial",
      stops: [
        { offset: "0%", color: "#6a11cb" },
        { offset: "100%", color: "#2575fc" },
      ],
    },
  ];

  return (
    <Card className="h-60 shadow-lg rounded-2xl" title={"title"} description={"description"}>
      <div style={{height:"100px"}}>
      <WordCloud
        words={words}
        spiral="archimedean"
        width={100}
        height={100}
        gradients={gradients}
      />
      </div>
    </Card>
  );
}

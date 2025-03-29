import {
  Card as UICard,
  CardDescription,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "./ui/button";
import { ArrowDownToLine } from "lucide-react";

export function Card({
  title,
  description,
  downloadChart,
  className,
  children,
  ...props
}: {
  title: string;
  description: string;
  className?: string;
  fixLeftPadding?: boolean;
  downloadChart: (s: string)=> void;
  children: any;
}) {
  return (
    <UICard
      {...props}
      className={`relative flex flex-col w-full h-full shadow-lg rounded-2xl min-w-2xs ${className}`}
    >
      <Button variant="outline" size={"icon"} onClick={() => downloadChart("mi_grafico.png")} className="absolute left-2 top-2 w-6 h-6">
        <ArrowDownToLine  />
      </Button>
      <CardHeader className="text-center">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className={`flex flex-1 px-6 h-full items-center`}>
        {children}
      </CardContent>
    </UICard>
  );
}

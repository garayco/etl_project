import { BarChartStacked } from "@/components/BarChartStacked";

import { LineChart } from "@/components/LineChart";

import { BarChartGroupStacked } from "@/components/BarCharGroupStacked";
import { PieChart } from "@/components/PieChart";
import { HorizontalBarChart } from "./components/HorizontalBarChart";
import { DonutChart } from "./components/DonutChart";
import { LineChart2 } from "./components/LineChart2";

export default function Dashboard() {
  return (
    <div className="bg-[#E9ECF4] min-h-screen">
      <div className="p-4 mx-4 md:mx-9">
        <h1 className="text-2xl md:text-3xl font-bold my-4">
          Mental Health Data Analysis on Reddit
        </h1>
        <p className="mb-4">
          This set of visualizations is based on an ETL process applied to a
          Kaggle dataset containing Reddit posts categorized by different
          psychological pathologies.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 print:grid-cols-2 print:gap-2 print:scale-90">
          <BarChartStacked className="col-span-1 md:col-span-2 lg:col-span-3 print:col-span-2 print:break-inside-avoid" />

          <HorizontalBarChart className="col-span-1 md:col-span-2 lg:col-span-2 print:col-span-1 print:break-inside-avoid" />
          <PieChart className="col-span-1 md:col-span-2 lg:col-span-1 print:col-span-1 print:break-inside-avoid" />
          <DonutChart className="col-span-1 md:col-span-2 lg:col-span-2 print:col-span-1 print:break-inside-avoid" />

          <LineChart className="col-span-1 md:col-span-2 lg:col-span-1 print:col-span-1 print:break-inside-avoid" />
          <LineChart2 className="col-span-1 md:col-span-2 lg:col-span-3 print:col-span-2 print:break-inside-avoid" />

          <BarChartGroupStacked
            stacksIds={["vader, nrc"]}
            className="col-span-1 md:col-span-2 lg:col-span-3 print:col-span-2 print:break-inside-avoid"
          />
        </div>
      </div>
    </div>
  );
}

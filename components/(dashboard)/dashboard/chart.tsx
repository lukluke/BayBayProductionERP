"use client";
import { LineChart, LineChartProps } from "@mui/x-charts/LineChart";
import moment from "moment";

type SalesChartProps = LineChartProps & {
  formatDate?: boolean;
};

export default function SalesChart({ formatDate, ...props }: SalesChartProps) {
  if (formatDate) {
    props.xAxis?.map(
      (data) => (data.valueFormatter = (value) => moment(value).format("DD/MM"))
    );
  }
  return <LineChart {...props} width={500} height={300} className="w-full" />;
}

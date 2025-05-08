
import { ResponsiveRadar } from "@nivo/radar";
import { Attribute } from "../types";

interface RadarChartProps {
  attributes: Attribute[];
  size?: "sm" | "md" | "lg";
}

export const RadarChart = ({ attributes, size = "md" }: RadarChartProps) => {
  // Transform attributes data for the radar chart
  const chartData = attributes.map((attr) => ({
    attribute: attr.name,
    value: attr.level,
    color: attr.color,
  }));
  
  // Define chart dimensions based on size prop
  const getDimensions = () => {
    switch (size) {
      case "sm":
        return { height: 150, marginTop: 30, marginRight: 40, marginBottom: 30, marginLeft: 40 };
      case "lg":
        return { height: 400, marginTop: 50, marginRight: 80, marginBottom: 50, marginLeft: 80 };
      case "md":
      default:
        return { height: 250, marginTop: 40, marginRight: 60, marginBottom: 40, marginLeft: 60 };
    }
  };
  
  const { height, marginTop, marginRight, marginBottom, marginLeft } = getDimensions();

  return (
    <div style={{ height }} className="w-full">
      <ResponsiveRadar
        data={chartData}
        keys={["value"]}
        indexBy="attribute"
        maxValue={10}
        margin={{ top: marginTop, right: marginRight, bottom: marginBottom, left: marginLeft }}
        borderWidth={2}
        borderColor={{ from: "color", modifiers: [] }}
        gridLabelOffset={15}
        dotSize={8}
        dotColor={{ theme: "background" }}
        dotBorderWidth={2}
        dotBorderColor={{ from: "color" }}
        enableDotLabel={false}
        colors={attributes.map((attr) => attr.color)}
        fillOpacity={0.25}
        blendMode="multiply"
        motionConfig="gentle"
        gridShape="circular"
        gridLevels={5}
        gridLabel={(node) => node.id}
        theme={{
          textColor: "#FFFFFF",
          fontSize: 12,
          axis: {
            domain: {
              line: {
                stroke: "#777777",
                strokeWidth: 1,
              },
            },
          },
          grid: {
            line: {
              stroke: "#555555",
              strokeWidth: 1,
              strokeDasharray: "6 4",
            },
          },
        }}
      />
    </div>
  );
};

export default RadarChart;

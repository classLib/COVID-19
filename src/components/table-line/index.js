import { Line } from "@antv/g2plot";

export function createTableLine(selection, data) {
  let result = [];

  data[0].values.forEach((d) => {
    result.push({
      date: d.Date_reported,
      value: +d.Cumulative_cases,
      type: "Cumulative_cases",
    });
    result.push({
      date: d.Date_reported,
      value: +d.Cumulative_deaths,
      type: "Cumulative_deaths",
    });
    result.push({
      date: d.Date_reported,
      value: +d.New_cases,
      type: "New_cases",
    });
    result.push({
      date: d.Date_reported,
      value: +d.New_deaths,
      type: "New_deaths",
    });
  });

  const line = new Line(selection.node(), {
    data: result,
    height: 300,
    padding: [20, 0, 20, 50],
    xField: "date",
    yField: "value",
    seriesField: "type",
    legend: {
      position: "top",
    },
    xAxis: {
      type: "time",
    },
    smooth: true,
  });

  line.render();
}

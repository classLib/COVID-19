import "./index.css";
import { csv } from "d3";

export function createTableLine(selection) {
  const thead = selection.append("div");
  const tbody = selection.append("div");
  renderTableHeader(thead);
  renderTableBody(tbody);
}

function renderTableHeader(selection) {
  let titles = [
    {
      id: 0,
      name: "国家",
    },
    {
      id: 1,
      name: "累计病例",
    },
    {
      id: 2,
      name: "死亡病例",
    },
  ];

  selection
    .classed("tr", true)
    .selectAll("div")
    .data(titles, (d) => d.id)
    .join("div")
    .classed("th", true)
    .text((d) => d.name);
}

async function renderTableBody(selection) {
  const data = await csv("/assets/data/WHO_COVID_19_global_data.csv");
  console.log(data);
  // console.log(data);
  // selection
  //   .selectAll("div")
  //   .data(WorldData)
  //   .join("div")
  //   .classed("tr", true)
  //   .text((d, i) => i);
}

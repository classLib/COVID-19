import "./index.css";
import { easeCubic as ease, select, csv, groups, sum } from "d3";
import { createTableLine } from "../table-line";

export async function createTable(selection) {
  selection.classed("border my-3 p-3", true);

  const title = selection.append("h4");
  const thead = selection.append("div");
  const tbody = selection.append("div").classed("data-table-tbody", true);

  const data = await csv("/assets/data/WHO_COVID_19_global_data.csv");
  let dt = dataTransform(data);
  renderTableTitle(title);

  renderTableHeader(thead, {
    onSort: onSort(tbody, dt),
  });

  renderTableBody(tbody, dt);
  renderSearch(dt);
}

function onSort(tbody, dt) {
  let obj = {};
  return (key) => {
    obj[key] = !obj[key];

    let data = null;
    if (key === "Country") {
      data = dt.sort((a, b) =>
        obj[key] ? a[key].localeCompare(b[key]) : b[key].localeCompare(a[key])
      );
    } else {
      data = dt.sort((a, b) => (obj[key] ? b[key] - a[key] : a[key] - b[key]));
    }
    renderTableBody(tbody, data);
  };
}

function renderTableTitle(selection) {
  selection.text("各地区、国家疫情情况");
}

function renderTableHeader(selection, { onSort: onSort }) {
  let titles = [
    {
      id: "Country",
      name: "国家",
    },
    {
      id: "Cumulative_cases",
      name: "累计病例",
    },
    {
      id: "Cumulative_deaths",
      name: "死亡病例",
    },
    {
      id: "Last7Days_cases",
      name: "近7日新增病例",
    },
    {
      id: "Last7Days_deaths",
      name: "近7日死亡病例",
    },
  ];

  selection
    .classed("data-table-tr", true)
    .selectAll("div")
    .data(titles, (d) => d.id)
    .join("div")
    .classed("data-table-th", true)
    .text((d) => d.name)
    .on("click", (e, d) => {
      onSort(d.id);
    });
}

async function renderTableBody(selection, data) {
  selection.html(null);
  const trs = selection
    .selectAll("div")
    .data(data, (d) => d.Country)
    .join("div")
    .attr("id", (d) => d.Country_code)
    .classed("data-table-tr", true)
    .on("click", onRenderChart());

  const dataTrs = trs
    .selectAll(".data")
    .data((d) => [d])
    .join("div")
    .classed("data", true)
    .selectAll("div")
    .data((d) => {
      return [
        d.Country,
        d.Cumulative_cases,
        d.Cumulative_deaths,
        d.Last7Days_cases,
        d.Last7Days_deaths,
      ];
    })
    .join("div")
    .classed("data-table-td", true)
    .text((d) => d);

  const chartTrs = trs
    .selectAll(".chart")
    .data((d) => [d])
    .join("div")
    .classed("chart", true);
}

function dataTransform(data) {
  let result = [];
  const groupedByCountry = groups(data, (d) => d.Country);
  for (let [country, data] of groupedByCountry) {
    let end = data.slice(-1)[0];
    let last7Days = data.slice(-7);
    const nc7 = sum(last7Days, (d) => d.New_cases);
    const nd7 = sum(last7Days, (d) => d.New_deaths);
    result.push({
      values: data,
      Country: country,
      Country_code: end.Country_code,
      Cumulative_cases: +end.Cumulative_cases,
      Cumulative_deaths: +end.Cumulative_deaths,
      Last7Days_cases: nc7,
      Last7Days_deaths: nd7,
      WHO_region: end.WHO_region,
    });
  }
  return result;
}

function onRenderChart() {
  let cache = {};
  return function (e, d) {
    const chart = select(this).selectAll("div.chart");

    if (e.target.nodeName && e.target.nodeName !== "CANVAS") {
      cache[d.Country] = !cache[d.Country];
      const open = cache[d.Country];

      chart.classed("hide", !open).classed("show", open);

      const div = chart
        .selectAll("div")
        .data((d) => [d])
        .join("div");

      createTableLine(div, div.data());
    }
  };
}

function renderSearch(data) {
  select("#select")
    .on("change", function () {
      const id = select(this).property("value");

      const node = select(`#${id}`).node();
      const tbody = document.querySelector(".data-table-tbody");
      tbody.scrollTop = node.offsetTop - tbody.offsetTop;

      // let getTop = scaleLinear()
      //   .domain([0, 300])
      //   .range([0, node.offsetTop - tbody.offsetTop]);

      const startValue = 0;
      const endValue = node.offsetTop - tbody.offsetTop;

      let getTop = (t) => {
        console.log(t);
        const height = startValue + endValue * ease(t / 1000);
        console.log(height);
        return height;
      };

      let start;
      let timer;
      const duration = (time) => {
        if (!start) start = time;
        const t = time - start;

        tbody.scrollTop = getTop(t);

        if (t <= 1000) timer = window.requestAnimationFrame(duration);
        else window.cancelAnimationFrame(timer);
      };

      window.requestAnimationFrame(duration);
    })
    .selectAll("option")
    .data(data)
    .join("option")
    .property("value", (d) => d.Country_code)
    .text((d) => d.Country);
}

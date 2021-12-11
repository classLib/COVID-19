/**
 * 疫苗JS入口
 */
import "bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import "./index.css";

import RadioSet from "../../components/radio-set/radioSet.js";
import Line from "../../components/line/line.js";

import funnel from "../../components/funnel";
import { createBoard } from "../../components/vaccines-board";
import { select, csv, groups } from "d3";

const initChart = async () => {
  const pieAgeData = await csv("/assets/data/vaccinations-by-age-group.csv");
  const manufacturerData = await csv(
    "/assets/data/vaccinations-by-manufacturer.csv"
  );
  const pieGroupData = groups(pieAgeData, (d) => d["location"]);

  const vaccinationsData = await csv("/assets/data/vaccinations.csv");
  const groupData = groups(vaccinationsData, (d) => d["location"]);
  let countrys = [];
  pieGroupData.forEach((d) => {
    countrys.push(d[0]);
  });
  let filterData = [];
  groupData.forEach((d) => {
    if (countrys.includes(d[0])) {
      filterData.push(d);
    }
  });
  // 绘制单选框集合
  let radioSet = new RadioSet(
    "vaccines-left",
    filterData,
    pieGroupData,
    manufacturerData
  );

  // 绘制折线图
  let lineInitData = groupData[0];
  const lineData = {
    country: lineInitData[0],
    data: lineInitData[1],
  };
  let line = new Line("vaccines-center", lineData, pieGroupData);
  radioSet.setLine(line);

  // 绘制漏斗图
  const defaultContry = "Austria";
  const dataByDate = groups(pieGroupData[0][1], (d) => d["date"]);
  let curDateData = dataByDate[dataByDate.length - 1][1];
  let data = [];
  curDateData.forEach((d) => {
    data.push(
      {
        action: d["age_group"],
        visitor: d["people_fully_vaccinated_per_hundred"],
        site: "fully_vaccinated",
      },
      {
        action: d["age_group"],
        visitor: d["people_vaccinated_per_hundred"],
        site: "vaccinated",
      }
    );
  });
  let funnelInstance = funnel(data);
  line.setFunnel(funnelInstance);
  radioSet.setFunnel(funnelInstance);

  // 看板

  const board = createBoard(
    select("#vaccines-board"),
    curDateData,
    manufacturerData.filter((d) => d.location === defaultContry)
  );
  radioSet.setBoard(board);
};

window.onload = function () {
  initChart();
};

/**
 * 疫苗JS入口
 */
import "bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import "./index.css";

import RadioSet from "../../components/radio-set/radioSet.js";
import Line from "../../components/line/line.js";

import * as d3 from 'd3';
import { Chart } from '@antv/g2';
import funnel from "../../components/funnel";

const initChart = async () => {
  const pieAgeData = await d3.csv(
    '/assets/data/vaccinations-by-age-group.csv'
  );

  const pieGroupData = d3.groups(pieAgeData, (d) => d["location"]);

  const vaccinationsData = await d3.csv(
    '/assets/data/vaccinations.csv'
  );
  const groupData = d3.groups(vaccinationsData, (d) => d["location"]);
  let countrys = [];
  pieGroupData.forEach((d) => {
    countrys.push(d[0]);
  })
  let filterData = [];
  groupData.forEach((d) => {
    if (countrys.includes(d[0])) {
      filterData.push(d);
    }
  })
  // 绘制单选框集合
  let radioSet = new RadioSet('vaccines-left', filterData, pieGroupData);

  // 绘制折线图
  let lineInitData = groupData[0];
  const lineData = {
    'country': lineInitData[0],
    'data': lineInitData[1]
  }
  let line = new Line('vaccines-center', lineData, pieGroupData);
  radioSet.setLine(line);
  // 绘制表格
  // 绘制漏斗图
  const dataByDate = d3.groups(pieGroupData[1][1], d => d["date"]);
  let curDateData = dataByDate[dataByDate.length - 1][1];
  let data = [];
  curDateData.forEach((d) => {
    data.push({
      action: d["age_group"],
      visitor: d["people_fully_vaccinated_per_hundred"],
      site: "fully_vaccinated"
    }, {
      action: d["age_group"],
      visitor: d["people_vaccinated_per_hundred"],
      site: "vaccinated"
    })
  })
  let funnelInstance = funnel(data);
  line.setFunnel(funnelInstance);
  radioSet.setFunnel(funnelInstance);
}
initChart();

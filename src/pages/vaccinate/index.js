/**
 * 疫苗JS入口
 */
import "bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import "./index.css";

import RadioSet from "../../components/radio-set/radioSet.js";
import Line from "../../components/line/line.js";

import * as d3 from 'd3';
const initChart = async () => {
  const vaccinationsData = await d3.csv(
    '/assets/data/vaccinations.csv'
  );
  const groupData = d3.groups(vaccinationsData, (d) => d["location"]);
  // 绘制单选框集合
  let radioSet = new RadioSet('vaccines-left', groupData);

  // 绘制折线图
  let lineInitData = groupData[0];
  const lineData = {
    'country': lineInitData[0],
    'data': lineInitData[1]
  }
  let line = new Line('vaccines-center', lineData);
  radioSet.setLine(line);
  // 绘制表格
  // const tableData = [
  //     { "公司": "111", "data": "test" },
  //     { "公司": "222", "data": "test11" },
  // ]
  // let table = new Table('table', tableData);
  // // 绘制饼图
  // let pieData = [
  //     { name: 'apple', value: 150 },
  //     { name: 'banana', value: 200 },
  //     { name: 'orange', value: 120 },
  //     { name: 'mango', value: 100 },
  //     { name: 'pineapple', value: 210 },
  //     { name: 'watermelon', value: 160 },
  //     { name: 'pitaya', value: 331 },
  //     { name: 'strawberry', value: 105 }
  // ];
  // let pie = new Pie('pie', pieData);
}
initChart();
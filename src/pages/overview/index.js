/**
 * 概览JS入口
 */
import "bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import "./index.css";

import {
  select
} from "d3-selection";

import * as d3 from 'd3';

import WorldMap from "../../components/map/worldMap";
import Bar from "../../components/bar/bar"
import overScrollHistogram from "../../components/scroll_histogram/scrollHistogram"
import overViewPie from "../../components/pie/pie"
import overViewLiquidPlot from "../../components/liquidPlot/liquidPlot"

overViewmMap();
async function overViewmMap() {
  const data = await d3.csv('/assets/data/WHO_COVID_19_global_data.csv');
  const g = await d3.json('/assets/data/worldGeo.json');
  data.forEach(d => {
    d['mortality'] = (+d['Cumulative_cases']) / (+d['Cumulative_cases']);
  })
  data.columns.push('mortality');

  let groupedByCountryName = Array.from(d3.group(data, d => d.Country), ([key, values]) => ({
    key,
    values
  }))
  let groupedByCountryDate = Array.from(d3.group(data, d => d.Date_reported), ([key, values]) => ({
    key,
    values
  }))
  // // 绘制柱状图
  let bar = new Bar('overViewBar', groupedByCountryName, groupedByCountryDate);
  // 绘制流动比例圆
  let liquidPlot = overViewLiquidPlot(0.25);
  // 交互
  bar.setliquidPlot(liquidPlot)
  // 绘制地图
  let worldGeo = new WorldMap("worldMap", groupedByCountryDate, g)
  // 绘制横轴柱状图
  overScrollHistogram(data);
  worldGeo.setBar(bar);
  worldGeo.setliquidPlot(liquidPlot)

  // 取出中国一天的数据


}
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

const create = async () => {

  const data = await d3.csv('../../assets/data/WHO_COVID_19_global_data.csv').then((data) => {
    d3.json('./data/worldGeo.json').then(geo => {
      data.forEach(d => {
        d['mortality'] = (+d['Cumulative_cases']) / (+d['Cumulative_cases']);
      })
      data.columns.push('mortality'); //添加死亡率

      let groupedByCountryName = Array.from(d3.group(data, d => d.Country), ([key, value]) => ({
        key,
        value
      }))
      let groupedByCountryDate = Array.from(d3.group(data, d => d.Date_reported), ([key, value]) => ({
        key,
        value
      }))

      console.log(groupedByCountryDate)
      console.log(groupedByCountryName)

      // 4. 绘制柱状图
      // let histogram = new MyHistogram('histogram', groupedByCountryName);

      // 5. 绘制地图
      // let worldMap = new WorldMap('worldMap', groupedByCountryDate, geo);
      // worldMap.setHistogram(histogram);

    }).catch(error => {
      console.log(error);
    })
  }).catch((error) => {
    console.log(error);
  })
  console.log(data)

}
let start = create();
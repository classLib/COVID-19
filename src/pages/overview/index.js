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


index();
async function index() {
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
  console.log(groupedByCountryDate)
  console.log(groupedByCountryName)
  let worldGeo = new WorldMap("worldMap", groupedByCountryDate, g)



}
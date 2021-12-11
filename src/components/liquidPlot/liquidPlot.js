import {
  Liquid,
  measureTextWidth
} from '@antv/g2plot';
import * as d3 from 'd3';
export default function overViewLiquidPlot(d) {
  // data 为上面两个选项的的合并选择数值占全世界最后一天的百分比，
  d3.select('#overViewLiquidPlot').append("span")
    .attr("id", "textLiquidPlo")
    .style("opacity", 0.8)
    .style('font-weight', 900)
    .html('<ul style="height: 10px">' +
      '<span style="font-size : 25px">Proportion Of Selected Attributes By Deadline </span>' +
      '<br/>' +
      '<span style="font-size : 16px ;opacity:0.5 ">please click on the map and click the selection box below</span>' +
      '</ul>');

  const liquidPlot = new Liquid('overViewLiquidPlot', {
    percent: 0.1842,
    outline: {
      border: 1,
      distance: 6,
    },


    wave: {
      length: 128,
    },
  });
  liquidPlot.render();
  return liquidPlot
}
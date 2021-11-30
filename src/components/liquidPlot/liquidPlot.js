import {
  Liquid
} from '@antv/g2plot';
export default function overViewLiquidPlot(d) {
  // data 为上面两个选项的的合并选择数值占全世界最后一天的百分比，
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
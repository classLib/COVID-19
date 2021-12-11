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
  let radioSet = new RadioSet('vaccines-left', filterData);

  // 绘制折线图
  let lineInitData = groupData[0];
  const lineData = {
    'country': lineInitData[0],
    'data': lineInitData[1]
  }
  let line = new Line('vaccines-center', lineData);
  radioSet.setLine(line);
  // 绘制表格
  // 绘制漏斗图
  const data = [
    { action: '访问', visitor: 500, site: '站点1' },
    { action: '浏览', visitor: 400, site: '站点1' },
    { action: '交互', visitor: 300, site: '站点1' },
    { action: '下单', visitor: 200, site: '站点1' },
    { action: '完成', visitor: 100, site: '站点1' },
    { action: '访问', visitor: 550, site: '站点2' },
    { action: '浏览', visitor: 420, site: '站点2' },
    { action: '交互', visitor: 280, site: '站点2' },
    { action: '下单', visitor: 150, site: '站点2' },
    { action: '完成', visitor: 80, site: '站点2' },
  ];
  data.sort(function (obj1, obj2) {
    // 从小到大
    return obj1.visitor - obj2.visitor;
  });
  const chart = new Chart({
    container: 'vaccines-funnel',
    autoFit: true,
    height: 600,
    padding: [30, 120, 55],
  });
  chart.data(data);
  chart.axis(false);
  chart.tooltip({
    showMarkers: false,
    showTitle: false,
    itemTpl:
      '<li class="g2-tooltip-list-item" data-index={index} style="margin-bottom:4px;">' +
      '<span style="background-color:{color};" class="g2-tooltip-marker"></span>' +
      '{name}<br/>' +
      '<span style="padding-left: 16px">{value}</span>' +
      '</li>',
  });

  chart.facet('mirror', {
    fields: ['site'],
    transpose: true,
    padding: 0,
    eachView(view, facet) {
      view
        .interval()
        .position('action*visitor')
        .color('action', ['#BAE7FF', '#69C0FF', '#40A9FF', '#1890FF', '#0050B3'])
        .shape('funnel')
        .tooltip('site*action*visitor', (site, action, visitor) => {
          return {
            name: site,
            value: action + ': ' + visitor,
          };
        })
        .style({
          lineWidth: 1,
          stroke: '#fff',
        })
        .animate({
          appear: {
            animation: 'fade-in'
          },
          update: {
            annotation: 'fade-in'
          }
        });

      data.map((obj) => {
        if (obj.site === facet.columnValue) {
          view.annotation().text({
            top: true,
            position: [obj.action, 'min'],
            content: obj.visitor,
            style: {
              fill: '#fff',
              stroke: null,
              fontSize: 12,
              textAlign: facet.columnIndex ? 'start' : 'end',
              shadowBlur: 2,
              shadowColor: 'rgba(0, 0, 0, .45)',
            },
            offsetX: facet.columnIndex ? 10 : -10,
          });
        }
        return null;
      });
    },
  });
  chart.interaction('element-active');
  chart.removeInteraction('legend-filter');
  chart.render();

}
initChart();

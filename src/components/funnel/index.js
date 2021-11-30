/*
将数据筛选为公共部分的数据，首先是点击国家，已经实现与柱状图的交互。
点击国家时，将国家的名字传到右边去，
此时我们选用的数据是最近这一周的数据，
之后我根据进度条的时候来切换对应的图表，找出那个时间位于的区间，来绘制我们右边的图表.
*/
import { Chart } from '@antv/g2';
export default function funnel(cur) {
  let data = [];
  cur.forEach((d) => {
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
  console.log(data);
  data.sort(function (obj1, obj2) {
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
  return chart;
}
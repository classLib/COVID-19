/*
将数据筛选为公共部分的数据，首先是点击国家，已经实现与柱状图的交互。
点击国家时，将国家的名字传到右边去，
此时我们选用的数据是最近这一周的数据，
之后我根据进度条的时候来切换对应的图表，找出那个时间位于的区间，来绘制我们右边的图表.
*/
import * as G2 from '@antv/g2';
// export default class Funnel {
//   constructor(id, data) {
//     this.id = id;
//     this.data = [{
//       action: '访问',
//       visitor: 500,
//       site: '站点1'
//     }, {
//       action: '浏览',
//       visitor: 400,
//       site: '站点1'
//     }, {
//       action: '交互',
//       visitor: 300,
//       site: '站点1'
//     }, {
//       action: '下单',
//       visitor: 200,
//       site: '站点1'
//     }, {
//       action: '完成',
//       visitor: 100,
//       site: '站点1'
//     }, {
//       action: '访问',
//       visitor: 550,
//       site: '站点2'
//     }, {
//       action: '浏览',
//       visitor: 420,
//       site: '站点2'
//     }, {
//       action: '交互',
//       visitor: 280,
//       site: '站点2'
//     }, {
//       action: '下单',
//       visitor: 150,
//       site: '站点2'
//     }, {
//       action: '完成',
//       visitor: 80,
//       site: '站点2'
//     }];
//     this.data.sort(function (obj1, obj2) {
//       // 从小到大
//       return obj1.visitor - obj2.visitor;
//     });

//     var chart = new G2.Chart({
//       container: `#${this.id}`,
//       forceFit: true,
//       height: document.querySelector(`#${this.id}`).offsetHeight - 10,
//       padding: [30, 120, 95]
//     });
//     console.group(chart);
//     chart.source(data);
//     chart.axis(false);
//     chart.tooltip({
//       crosshairs: false,
//       showTitle: false,
//       itemTpl: '<li data-index={index} style="margin-bottom:4px;">' + '<span style="background-color:{color};" class="g2-tooltip-marker"></span>' + '{name}<br/>' + '<span style="padding-left: 16px">{value}</span>' + '</li>'
//     });
//     chart.legend({
//       reversed: true
//     });
//     chart.facet('mirror', {
//       fields: ['site'],
//       transpose: true,
//       padding: 0,
//       eachView: function eachView(view, facet) {
//         view.interval().position('action*visitor').color('action', ['#BAE7FF', '#69C0FF', '#40A9FF', '#1890FF', '#0050B3']).shape('funnel').tooltip('site*action*visitor', function (site, action, visitor) {
//           return {
//             name: site,
//             value: action + ': ' + visitor
//           };
//         }).style({
//           lineWidth: 1,
//           stroke: '#fff'
//         });

//         data.map(function (obj) {
//           if (obj.site === facet.colValue) {
//             view.guide().text({
//               top: true,
//               position: [obj.action, 'min'],
//               content: obj.visitor,
//               style: {
//                 fill: '#fff',
//                 fontSize: '12',
//                 textAlign: facet.colIndex ? 'start' : 'end',
//                 shadowBlur: 2,
//                 shadowColor: 'rgba(0, 0, 0, .45)'
//               },
//               offsetX: facet.colIndex ? 10 : -10
//             });
//           }
//         });
//       }
//     });
//     chart.render();

//   }

// }
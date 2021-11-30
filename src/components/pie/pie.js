import {
  Chart,
  registerAnimation
} from '@antv/g2';


export default function overViewPie(groupedByCountryName) {
  const ChinaData = []
  groupedByCountryName.forEach((d, i) => {
    if (d.key == 'China') {
      ChinaData.push(d)
    }
  })
  let regin = ['Cumulative_cases', 'Cumulative_deaths', 'New_deaths',
    'New_cases'
  ]
  console.log(ChinaData)
  let pieData = []
  const d = ChinaData[0].values[ChinaData[0].values.length - 1]
  console.log()
  Object.keys(d).map((key, i) => {
    regin.forEach((ele) => {
      if (key === ele) {
        console.log(key)
        pieData.push(Object.assign({}, {
          item: key,
          count: 25
        }))
      }
    })
  })
  console.log(pieData)

  const pie = new Chart({
    container: '',
    autoFit: true,
  });

  pie.coordinate('theta', {
    radius: 0.75,
  })
  pie.data(pieData);
  pie.tooltip({
    showTitle: true,
    // showMarkers: true,
  });
  pie
    .interval()
    .position('count')
    .color('item')
    // .label('percent', {
    //   content: (data) => {
    //     return `${data.item}: ${data.percent * 100}%`;
    //   },
    // })
    .adjust('stack');
  // 设置交互
  pie.interaction('element-active');
  pie.render();
  return pie;
}
import {
  Chart,
  registerAnimation
} from '@antv/g2';
import * as d3 from 'd3';

export default function overScrollHistogram(data) {
  // 去20的国家累计死亡病例
  let resDatagroupedByCountryDate_ = processData(data)
  let resDatagroupedByCountryDate = resDatagroupedByCountryDate_.slice(200, 400)
  console.log(resDatagroupedByCountryDate)
  let count = 0;
  let scrollChart;
  let interval;

  function countUp() {
    if (count === 0) {
      scrollChart = new Chart({
        container: 'scroll_histogram',
        autoFit: true,

      });
      scrollChart.data(handleData(resDatagroupedByCountryDate[count].values));
      scrollChart.coordinate('rect').transpose();
      ~
      scrollChart.legend(false);
      scrollChart.tooltip(false);
      scrollChart.axis('Country', {
        animateOption: {
          update: {
            duration: 1000,
            easing: 'easeLinear'
          }
        }
      });
      scrollChart.annotation().text({
        position: ['95%', '90%'],
        content: resDatagroupedByCountryDate[count].keys,
        style: {
          fontSize: 40,
          fontWeight: 'bold',
          fill: '#ddd',
          textAlign: 'end'
        },
        animate: false,
      });
      scrollChart
        .interval()
        .position('Country*Cumulative_cases')
        .color('Country')
        .label('Cumulative_cases', (value) => {
          // if (value !== 0) {
          return {
            animate: {
              appear: {
                animation: 'label-appear',
                delay: 0,
                duration: 1000,
                easing: 'easeLinear'
              },
              update: {
                animation: 'label-update',
                duration: 1000,
                easing: 'easeLinear'
              }
            },
            offset: 5,
          };
          // }
        }).animate({
          appear: {
            duration: 1000,
            easing: 'easeLinear'
          },
          update: {
            duration: 1000,
            easing: 'easeLinear'
          }
        });

      scrollChart.render();
    } else {
      scrollChart.annotation().clear(true);
      scrollChart.annotation().text({
        position: ['95%', '90%'],
        content: resDatagroupedByCountryDate[count].keys,
        style: {
          fontSize: 40,
          fontWeight: 'bold',
          fill: '#ddd',
          textAlign: 'end'
        },
        animate: false,
      });
      scrollChart.changeData(handleData(resDatagroupedByCountryDate[count].values));
    }

    ++count;

    if (count === resDatagroupedByCountryDate.length) {
      clearInterval(interval);
    }
  }
  countUp();
  interval = setInterval(countUp, 1200);
}

registerAnimation('label-appear', (element, animateCfg, cfg) => {
  const label = element.getChildren()[0];
  const coordinate = cfg.coordinate;
  const startX = coordinate.start.x;
  const finalX = label.attr('x');
  const labelContent = label.attr('text');

  label.attr('x', startX);
  label.attr('text', 0);

  const distance = finalX - startX;
  label.animate((ratio) => {
    const position = startX + distance * ratio;
    const text = (labelContent * ratio).toFixed(0);

    return {
      x: position,
      text,
    };
  }, animateCfg);
});

registerAnimation('label-update', (element, animateCfg, cfg) => {
  const startX = element.attr('x');
  const startY = element.attr('y');
  // @ts-ignore
  const finalX = cfg.toAttrs.x;
  // @ts-ignore
  const finalY = cfg.toAttrs.y;
  const labelContent = element.attr('text');
  // @ts-ignore
  const finalContent = cfg.toAttrs.text;

  const distanceX = finalX - startX;
  const distanceY = finalY - startY;
  const numberDiff = +finalContent - +labelContent;

  element.animate((ratio) => {
    const positionX = startX + distanceX * ratio;
    const positionY = startY + distanceY * ratio;
    const text = (+labelContent + numberDiff * ratio).toFixed(0);

    return {
      x: positionX,
      y: positionY,
      text,
    };
  }, animateCfg);
});

function handleData(source) {
  source.sort((a, b) => {
    return a.Cumulative_cases - b.Cumulative_cases;
  });

  return source;
}
// 
function processData(data) {
  let groupedByCountryDate = Array.from(d3.group(data, d => d.Date_reported), ([key, values]) => ({
    key,
    values
  }))
  let tempData = groupedByCountryDate[groupedByCountryDate.length - 1].values.sort((a, b) => {
    return a.Cumulative_deaths < b.Cumulative_deaths;
  })
  let upContryName = tempData.slice(0, 20).map((d) => d.Country);
  let resData = [];
  upContryName.forEach(item => {
    data.forEach(ele => {
      if (item === ele.Country) {
        resData.push(ele);
      }
    })
  })
  let resDatagroupedByCountryDate = Array.from(d3.group(resData, d => d.Date_reported), ([key, values]) => ({
    key,
    values
  }))
  return resDatagroupedByCountryDate;
}
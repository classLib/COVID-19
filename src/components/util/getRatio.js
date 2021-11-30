import * as d3 from "d3"
/***
 * 根据data， type，name 找到对应的数据比例
 */
export default function getRatioByName(data, type, name) {
  let sumDateByTarge_ = d3.sum(data, d => +d[type])
  console.log(sumDateByTarge_)
  for (let i = 0; i < data.length; i++) {
    if (data[i].Country === name) {
      return sumDateByTarge_ === 0 ? 0 : parseFloat(+data[i][type] / sumDateByTarge_)
    }
  }
  return 0;
}
import * as d3 from 'd3';

import getRatioByName from '../util/getRatio';


export default class Bar {
  constructor(id, dataByName, dataByDate) {
    //数据部分
    this.data = dataByName;
    this.targetDataName = 'China';
    this.targetData = this.getDataByCountryName(this.targetDataName);
    this.leastData = dataByDate[dataByDate.length - 1].values
    this.targetDataType = 'New_cases'; // 默认的数据类型

    //视图部分
    this.id = id;
    this.svg = null;
    this.rg = null;


    this.app = null;
    this.form = null;
    this.input = null;
    this.submitBtn = null;

    this.width = document.querySelector(`#${id}`).offsetWidth;
    this.height = document.querySelector(`#${id}`).offsetHeight;
    this.margin = {
      top: 20,
      right: 50,
      bottom: 50,
      left: 50
    };
    this.innerHeight = this.height - this.margin.top - this.margin.bottom;
    this.innerWidth = this.width - this.margin.left - this.margin.right;

    // 渐变效果
    this.transition = null;
    this.duration = 250;
    // 点击事件
    this.selectCountry = null;
    this.liquidPlot = null;

    this.init(); //初始化画布
    this.render(); //更新画布
  }

  // 1. 初始化函数
  init() {
    this.initSvg(); //初始化svg容器
    this.initRectGroup(); //初始化存放矩形元素的组
    this.initAxesGroup(); //初始化存分坐标轴的容器
    this.initSelectrEvents(); //选择事件的绑定
    this.initInput(); // 输入框
    this.showInfoByInput(); //通过输入框的值，更新画布

  }


  // 1.1 初始化svg画布
  initSvg() {
    this.svg = d3.select(`#${this.id}`)
      .append('svg')
      .style('background-color', '#eee')
      .attr('viewBox', `0 0 ${this.width} ${this.height}`)
  }

  // 1.2 初始化存放矩形元素的组
  initRectGroup() {
    this.rg = this.svg.append('g')
      .attr('id', 'rectGroup')
      .attr('transform', `translate(${this.margin.left},${this.margin.top})`)
  }


  //1.3 初始化存分坐标轴的容器()
  initAxesGroup() {
    this.xAxisGroup = this.svg.append("g")
      .attr("id", "xAxis")
      // .attr("class","axis")
      .attr('transform', `translate(${this.margin.left},${this.innerHeight + this.margin.top})`)
    this.yAxisGroup = this.svg.append('g')
      .attr('id', 'yAxis')
      //x轴右，y轴下
      // .attr("class","axis")
      .attr('transform', `translate(${this.margin.left},${this.margin.top})`)

  }
  //1.4 绑定事件
  initSelectrEvents() {
    // 得到所有的国家名称
    let keys = [];
    this.data.forEach(d => {
      keys.push(d['key'])
    })
    // 下拉选择框
    this.inputs = d3.select(`#${this.id}`)
      .append('div')
      .attr('id', 'select_item')
      .style('display', 'flex')
      .style('align-items', 'center')
      .style("margin-top", "5px")
    this.selectCountry = this.inputs
      .append('select')
      .style("cursor", "pointer")
      .attr("class", "input_my")
      .style('display', 'flex')
      .attr('id', 'selectCountry')
      // 增加监听事件，
      .on('change', (event) => {
        let name = event.target.value;
        this.targetDataName = name;
        this.targetData = this.getDataByCountryName(name);
        this.render();
        // 更新流动图
        let curRatio = getRatioByName(this.leastData, this.targetDataType, this.targetDataName)
        this.liquidPlot.changeData(curRatio)
      })

    this.selectCountry
      .selectAll('option')
      .data(keys)
      .join('option')
      .property('selected', d => d === 'China')
      .text(d => d);

    this.countryInfo = this.inputs
      .append('select')
      .style("cursor", "pointer")
      .attr("class", "input_my")
      .on('change', (event) => {
        this.targetDataType = event.target.value;
        this.render();

        // 更新流动图
        let curRatio = getRatioByName(this.leastData, this.targetDataType, this.targetDataName)
        this.liquidPlot.changeData(curRatio)

      })
      .selectAll('option')
      // 对所有的案例进行绑定
      .data(['New_cases', 'New_deaths', 'Cumulative_cases', 'Cumulative_deaths', 'mortality'])
      .join('option')
      .text(d => d)
      .style("font-weight", "600")


  }

  // 渐变效果
  initTransition() {
    this.transition = this.svg.transition()
      .duration(this.duration)
      .ease(d3.easeLinear);
  }


  // 通过输入框得到我对应的数据
  initInput() {
    this.app = d3.select(`#${this.id}`)
      .append("div")
      .style('display', 'flex')
      .attr('id', 'input_item')
    // 表单
    this.form = this.app.append("form")
      // .style('display', 'flex')
      .attr("class", "fprm_my")
    // 表单里面是输入框
    this.input = this.form.append("input")
      .attr("type", "text")
      .attr("placeholder", "input country name ....")
      .attr("class", "input_my")
    // 表单里面的提交按钮
    this.submitBtn = this.form.append("button")
      .style("background-color", "steelblue")
      .style("cursor", "pointer")
      .attr("type", "button")
      .attr('class', 'btn_my')
      .text("Submit");
    // todolist
  }

  // 通过输入框的名称改变图形
  showInfoByInput() {
    this.submitBtn.on("click", () => {
      let name = this.input.node().value;
      console.log(name);
      console.log(typeof (name));

      if (name) {
        this.targetData = this.getDataByCountryName(name);
        console.log(this.targetData);
        this.render();
        // 更新流动图
        let curRatio = getRatioByName(this.leastData, this.targetDataType, name)
        this.liquidPlot.changeData(curRatio)
      }
    })
  }

  // 通过国家名称去找到对应的数据
  getDataByCountryName(name) {
    for (let i = 0; i < this.data.length; i++) {
      if (this.data[i].key === name) {
        return this.data[i].values;
      }
    }
  }

  // 2. 画柱状图
  render() {
    // 调库映射比例尺
    this.renderScale();
    // 画图
    this.renderRect();
    // 坐标轴
    this.renderAxes();

  }

  // 2.1 映射比例尺
  renderScale() {
    // 线性替换
    this.y = d3.scaleLinear()
      // 数据范围(在当前targetDataType找targetData.values里面最大的数据)
      .domain([0, d3.max(this.targetData, d => +d[this.targetDataType])])
      .nice()
      // 画布范围
      .range([this.innerHeight, 0]);
    //  时间比例尺（根据时间去替换映射，改变的是整体的放缩）
    this.x = d3.scaleTime()
      .domain(d3.extent(this.targetData, d => new Date(d['Date_reported'])))
      .nice()
      .range([0, this.innerWidth])



  }

  // 2.2 画柱状图
  renderRect() {
    this.rg.selectAll('rect')
      .data(this.targetData)
      .join("rect")
      .transition(this.transition)
      .attr("fill", "steelblue")
      .attr('width', (this.width / this.data.length) / 2)
      .attr('height', d => {
        return this.innerHeight - this.y(d[this.targetDataType]);
      })
      .attr('x', d => {
        return this.x(new Date(d['Date_reported']));
      })
      .attr('y', d => this.y(d[this.targetDataType]))

  }
  // 2.3 坐标轴（就是对应着比例尺）
  renderAxes() {
    this.yAxisGroup
      .on("mouseover", (event) => {
        d3.select(event.target)
          .style("opacity", "0.5")
      })
      .on('mouseout', (event) => {
        d3.select(event.target)
          .style('opacity', '1');
      })
      .transition(this.transition)
      .call(d3.axisLeft(this.y)
        .tickSizeInner(`-${this.innerWidth}`)
      )
      .call(g => {
        g.selectAll("line").attr("stroke", "white")
        return g;
      })


    // .style("font-size","0.7em")
    // .style("font-weight","900")

    this.xAxisGroup
      .on("mouseover", (event) => {
        d3.select(event.target)
          .style("opacity", "0.5")
        // .style("fill","rgb(221, 227, 233)")
      })
      .on('mouseout', (event) => {
        d3.select(event.target)
          .style('opacity', '1');
      })
      .transition(this.transition)

      .call(
        d3.axisBottom(this.x)
        .tickSizeInner(`-${this.innerHeight}`)
        .tickFormat(d => {
          let date = new Date(d);
          return date.toLocaleDateString();
        }))
      .call(g => {
        g.selectAll("line").attr("stroke", "white")
        return g;
      })
      .attr("class", "axis")
      // .style("font-size","0.7em")
      .style("text-anchor", "start")

  }
  // 根据最后一组找所有的比例
  getRatioByName(name) {
    console.log(this.targetData)
    let sumDateByTarge_ = d3.sum(this.targetData.values, d => +d[this.targetDataType])
    console.log(sumDateByTarge_)
    for (let i = 0; i < this.targetData.values.length; i++) {
      if (this.targetData.values[i].Country === name) {
        return sumDateByTarge_ === 0 ? 0 : parseFloat(+this.targetData.values[i][this.targetDataType] / sumDateByTarge_)
      }
    }
    return 0;
  }
  setliquidPlot(liquidPlot) {
    this.liquidPlot = liquidPlot;
  }


}
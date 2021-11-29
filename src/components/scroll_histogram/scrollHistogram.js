export default class ScrollHistogram {

  constructor(id, data) {
    this.data = data;
    this.id = id;
    // 边框
    this.margin = {
      top: 150,
      right: 100,
      bottom: 150,
      left: 100
    };
    // 具体的宽高
    this.width = document.querySelector(`#${id}`).offsetWidth;
    this.height = document.querySelector(`#${id}`).offsetHeight;

    this.svg = null;
    this.mg = null;

    this.maxHeight = '100%';
    this.maxWidth = '100%';
    // 过渡效果
    this.duration = 1000;
    this.transition = d3.transition().duration(this.duration).ease(d3.easeLinear);
    this.init();
  }
  init() {
    // 初始化标签
    this.initSvg();
    // 初始化主体部分
    this.initMainGroup();
    // 初始化组别
    this.initGroups();
    // 初始化坐标轴
    this.initScale();
    // 缩放
    this.initZoom();
    return this;
  }
  initSvg() {
    this.svg = d3.select(`#${this.id}`)
      .append('svg');
    // 响应式盒子
    this.innerHeight = this.height - this.margin.top - this.margin.bottom;
    this.innerWidth = this.width - this.margin.left - this.margin.right;
    this.viewBox = `0 0 ${this.width} ${this.height}`;

    this.svg
      .attr('id', `${this.id}svg`)
      .attr('viewBox', this.viewBox)
      .style('background-color', this.backgroundColor)
      .style('max-height', this.maxHeight)
      .style('max-width', this.maxWidth)
  }
  initMainGroup() {
    this.mg = this.svg.append('g')
      .attr('id', `${this.id}MainGroup`)
      .attr('transform', `translate(${this.margin.left},${this.margin.top})`);
  }
  initGroups() {
    // 线条组 ：
    this.barGroup = this.mg.append('g')
      .attr('id', 'linesGroup')
      .attr('transform', `translate(${this.innerWidth / 2},${this.innerHeight / 2})`)
    // 文字组:
    this.textGroup = this.mg.append('g')
      .attr('id', 'textGroup')
      .attr('transform', `translate(${this.innerWidth / 2},${this.innerHeight / 2})`)
    // 图例
    // this.tooltip = d3.select('body')
    //   .append('div')
    //   .style('position', 'absolute')
    //   .style('z-index', '10')
    //   .style('visibility', 'hidden')
    //   .style('text-anchor', 'middle')
    //   .text('')
  }
  initScale() {

    this.xScale = d3.scaleLinear()
      .domain([0, 1000])
      .range([0, this.innerWidth])
      .nice()
    this.yScale = d3.scaleLinear()
      .domain([0, 1000])
      .range([this.innerHeight, 0])
      .nice()
  }
  initAxis() {
    this.xAxisGroup
      .call(d3.axisTop(this.xScale)
        .tickSizeInner(`-${this.innerHeight}`)
        .ticks(5).tickSize(0)
      )
      .selectAll('g text')
      .attr('y', 10)
      .attr("x", 10)
      .attr('font-size', '1em')
      .attr('font-weight', 900)
    this.yAxisGroup
      .call(d3.axisLeft(this.yScale)
        .tickSizeInner(`-${this.innerWidth}`)
        .ticks(6)
      )
      .selectAll('g text')
      .attr('font-size', '1em')
      .attr('font-weight', 900)
      .attr('x', '-10')
  }

}
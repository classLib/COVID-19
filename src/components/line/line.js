import * as d3 from "d3";

export default class Line {
  constructor(id, data) {
    this.id = id;
    this.data = data;
    this.countryName = null;
    this.dataCountry = null;
    this.svg = null;
    this.mg = null;
    this.color = null;
    this.targetDataIndex = null;
    this.duration = 250;
    this.targetDataType = "daily_vaccinations";
    this.dataAll = null;
    this.funnelData = null;
    this.width = document.querySelector(`#${this.id}`).offsetWidth;
    this.height = document.querySelector(`#${this.id}`).offsetHeight;
    this.dataY = null;
    this.xScale = null;
    this.yScale = null;
    this.tooltip = null;
    this.line = null;
    this.margin = {
      top: 10,
      right: 50,
      bottom: 70,
      left: 40,
    };
    this.init(); //初始化画布
    this.render();
  }
  init() {
    this.initSvg();
    this.initTransition();
    this.initMainGroup();
    this.initAxis();
    this.initEvents();
    this.initZoom();
  }
  initTransition() {
    this.transition = this.svg
      .transition()
      .duration(this.duration)
      .ease(d3.easeLinear);
  }
  initAxis() {
    this.xAxis = this.mg.append("g").attr("class", "x-axis");
    this.yAxis = this.mg.append("g").attr("class", "y-axis");
    this.lineGroup = this.mg.append("g").attr("class", "line-group");
    this.rectGroup = this.mg.append("g").attr("class", "rect-group");
  }
  initSvg() {
    this.name = d3.select(`#${this.id}`).append("div");
    this.rangeBox = d3
      .select(`#${this.id}`)
      .append("div")
      .attr("class", "range-box");
    this.svg = d3.select(`#${this.id}`).append("svg");
    // 响应式盒子
    this.innerHeight = this.height - this.margin.top * 2 - this.margin.bottom;
    this.innerWidth = this.width - this.margin.left - this.margin.right;
    this.viewBox = `0 0 ${this.width} ${this.height}`;

    this.svg
      .attr("id", `${this.id}svg`)
      .attr("viewBox", this.viewBox)
      .style("background-color", this.backgroundColor)
      .style("max-height", this.maxHeight)
      .style("max-width", this.maxWidth);
  }
  initMainGroup() {
    this.mg = this.svg
      .append("g")
      .attr("id", `${this.id}MainGroup`)
      .attr("transform", `translate(${this.margin.left},${this.margin.top})`);
    this.tooltip = d3
      .select("body")
      .append("div")
      .style("position", "absolute")
      .style("z-index", "10")
      .style("visibility", "hidden")
      .style("text-anchor", "middle")
      .text("");
  }
  initZoom() {
    //拖拽
    this.svg.call(d3.zoom().on("zoom", this.zoomed));
  }
  zoomed = (event) => {
    this.mg.attr(
      "transform",
      `translate(${event.transform.x},${event.transform.y}) scale(${event.transform.k})`
    );
  };
  initEvents() {
    this.inputs = d3
      .select(`#${this.id}`)
      .append("div")
      .style("display", "flex")
      .style("align-items", "center")
      .style("margin-top", "10px");
    this.countryInfo = this.inputs
      .append("select")
      .style("cursor", "pointer")
      .attr("class", "input")
      .style("margin-left", "20px")
      .style("display", "flex")
      .on("change", (e) => {
        this.targetDataType = e.target.value;
        //数据改变更新视图
        this.render();
      })
      .selectAll("option")
      // 对所有的案例进行绑定
      .data([
        "daily_vaccinations",
        "people_vaccinated",
        "people_fully_vaccinated",
        "total_boosters",
        "daily_vaccinations_raw",
        "daily_people_vaccinated",
        "total_vaccinations_per_hundred",
        "people_vaccinated_per_hundred",
        "people_fully_vaccinated_per_hundred",
        "total_boosters_per_hundred",
        "daily_vaccinations_per_million",
        "daily_people_vaccinated_per_hundred",
      ])
      .join("option")
      .text((d) => d)
      .style("font-weight", "600");
  }
  initColor() {
    return d3.scaleOrdinal(this.countryName, d3.schemeCategory10);
  }

  render(data, funnel) {
    if (data) this.data = data;
    this.countryName = this.data.country;
    this.dataCountry = this.data.data;
    this.dataAll = this.dataCountry;
    this.funnelData = funnel;
    this.color = this.initColor();
    this.renderInputControl();
    this.initInputControlEvent();
    this.renderRectBox();
  }
  renderRectBox(data) {
    if (data) this.data = data;
    this.countryName = this.data.country;
    this.dataCountry = this.data.data;
    this.renderScale();
    this.renderAxis();
    this.renderRect();
  }
  renderInputControl() {
    this.name.text(this.countryName);
    // div容器
    this.inputControl = this.rangeBox.style("display", "flex");
    // 控制按钮
    this.playShowBtn = this.inputControl
      .selectAll("button")
      .data([1])
      .join("button")
      .style("cursor", "pointer")
      .attr("type", "button")
      .style("width", "100px")
      .style("margin-right", "8px")
      .classed("btn btn-sm btn-primary", true)
      .text("Play");

    // 范围选择
    this.rangeInput = this.inputControl
      .selectAll("input")
      .data([1])
      .join("input")
      .style("width", "calc(100% - 200px)")
      .classed("form-range", true)
      .attr("id", "rangeInput")
      .attr("type", "range")
      .attr("min", 0)
      .attr("max", this.dataCountry.length - 1)
      .property("value", 0);
    // 时间控制
    this.rangeOutput = this.inputControl
      .selectAll("output")
      .data([1])
      .join("output")
      .attr("id", "rangeOutput")
      .text(this.dataCountry[this.dataCountry.length - 1]["date"]);
  }
  renderByBar(index) {
    // 改变outinput
    this.rangeInput.property("value", this.targetDataIndex);
    this.rangeOutput.text(this.dataAll[index].date);
    // 更新视图
    this.renderRectBox({
      countryname: this.countryName,
      data: this.dataAll.slice(0, index),
    });
    // for (let i = 0; i < this.funnelData.length; ++i) {
    //     let cur = this.funnelData[i];
    //     let d = new Date(cur[0]),
    //         day_ = new Date(this.dataAll[index - 1].date);
    //     if (d.getTime() - day_.getTime() >= 0) {
    //         let data = [];
    //         cur[1].forEach((d) => {
    //             data.push({
    //                 action: d["age_group"],
    //                 visitor: d["people_fully_vaccinated_per_hundred"],
    //                 site: "people_fully_vaccinated_per_hundred"
    //             }, {
    //                 action: d["age_group"],
    //                 visitor: d["people_vaccinated_per_hundred"],
    //                 site: "people_vaccinated_per_hundred"
    //             })
    //         })
    //         this.funnel.changeData(data);
    //         break;
    //     }

    // }
  }
  initInputControlEvent() {
    // 1. 监听选择框
    //改变视图
    this.rangeInput.on("change", (e) => {
      let index = d3.select(e.target).property("value");
      this.targetDataIndex = index;
      this.renderByBar(index);
    });

    // 只是改变了时间，不变视图
    this.rangeInput.on("input", (e) => {
      let index = d3.select(e.target).property("value");
      this.rangeOutput.text(this.dataAll[index].key);
    });

    // 2. 监听按钮的播放和暂停
    this.playShowBtn.on("click", (e) => {
      // 如果是play按钮，就按时间进行变化
      if (e.target.textContent === "Play") {
        e.target.textContent = "Pause";
        this.play();
      } else {
        // 如果是暂停按钮，就暂停事件
        e.target.textContent = "Play";
        this.pause();
      }
    });
  }

  play() {
    this.interval = setInterval(() => {
      // 默认数据的时间下标进行增加
      if (++this.targetDataIndex === this.dataAll.length) {
        this.playShowBtn.text("Play");
        this.pause();
        return;
      }
      // 修改默认的下标并且更改对应的时间的国家数据
      // this.setTargetDataIndex(this.targetDataIndex);
      this.renderByBar(this.targetDataIndex);
    }, 250);
  }
  pause() {
    // setInterval的返回值传给clearInterval用来暂停计时器
    clearInterval(this.interval);
  }
  renderRect() {
    this.rectGroup
      .selectAll("rect")
      .data(this.dataCountry, (d) => {
        return d.date;
      })
      .join("rect")
      
      .transition()
      .attr("width", this.width / this.dataCountry.length / 2)
      .attr("x", (d) => {
        return this.xScale(new Date(d["date"]));
      })
      .attr("fill", "steelblue")
      .attr("height", (d) => {
        return (
          this.height -
          this.margin.bottom -
          this.yScale(+d[this.targetDataType])
        );
      })
      .attr("y", (d) => this.yScale(+d[this.targetDataType]));
    // .on("mouseover", (event, d) => {
    //   this.tooltip
    //     .style("visibility", "visible")
    //     .style("left", `${event.pageX + 40 + "px"}`)
    //     .style("top", `${event.pageY + "px"}`)
    //     .style("opacity", 0.5)
    //     .style("color", "#EA5151")
    //     .style("font-size", "1rem")
    //     .style("font-weight", 900)
    //     .text(
    //       `时间:${d["date"]}` +
    //         "\n" +
    //         `${this.targetDataType}: ${+d[this.targetDataType]}`
    //     );
    // })
    // .on("mouseout", () => {
    //   this.tooltip.style("visibility", "hidden");
    // });
  }
  renderScale() {
    this.xScale = d3
      .scaleTime()
      //规范日期格式后找最大
      .domain(d3.extent(this.dataCountry, (d) => new Date(d["date"])))
      .nice()
      .range([this.margin.left, this.innerWidth]);

    this.dataY = this.dataCountry.map((d) => +d[this.targetDataType]);
    const yMax = Number.parseInt(d3.max(this.dataY));
    this.yScale = d3.scaleLinear(
      [0, yMax],
      [this.height - this.margin.bottom, this.margin.top]
    );
  }

  renderAxis() {
     this.xAxis
      .attr("transform", `translate(0,${this.height - this.margin.bottom})`).transition()
      .call(d3.axisBottom(this.xScale).tickFormat(d3.timeFormat("%Y %m %d")));

    this.yAxis
      .attr("transform", `translate(${this.margin.left},0)`).transition()
      .call(d3.axisLeft(this.yScale));
  }

  renderLine() {
    this.line = d3
      .line()
      .x((d) => this.xScale(new Date(d.date)))
      .y((d) => this.yScale(+d["daily_vaccinations"]))
      .curve(d3.curveNatural);
    this.lineGroup
      .selectAll("path")
      .data([this.dataCountry])
      .join("path")
      .attr("d", this.line)
      .style("stroke", (d) => this.color(this.countryName))
      .style("stroke-width", 2)
      .style("fill", "transparent");
  }

  setFunnel(funnel) {
    this.funnel = funnel;
  }
}

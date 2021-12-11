import { select, groups } from "d3";
import funnel from "../funnel";
export default class RadioSet {
  constructor(id, data, ageData, manufacturerData) {
    this.id = id;
    this.data = data;
    this.ageData = ageData;
    this.manufacturerData = manufacturerData;
    this.chart = null;
    this.funnel = null;
    this.board = null;
    this.svg = null;
    this.mg = null;
    this.dataByDate = null;
    this.width = document.querySelector(`#${this.id}`).offsetWidth;
    this.height = document.querySelector(`#${this.id}`).offsetHeight;

    this.margin = {
      top: 60,
      right: 200,
      bottom: 150,
      left: 100,
    };
    this.init(); //初始化画布
  }
  init() {
    this.initEvents(); //初始化监听事件
  }

  initEvents() {
    let countyNames = [];
    this.data.forEach((d) => {
      countyNames.push(d[0]);
    });
    this.selectCountry = select(`#${this.id}`);

    // 添加一个div，每个div里面有一个input和label
    this.selectCountryDiv = this.selectCountry
      .selectAll("div")
      .data(countyNames)
      .join("div")
      .attr("class", "selectCountryDiv")
      .attr("name", (d) => d);

    this.selectCountryRadio = this.selectCountryDiv
      .selectAll("input")
      .data((d) => [d])
      .join("input")
      .attr("type", "radio")
      .attr("id", (d) => `${d}-input`)
      .style("cursor", "pointer")
      .attr("name", "contouryName")
      .on("click", (e) => {
        // 点击当前的div，则选中对应的radio，并切换数据为这个国家的数据
        let input = e.target;
        let countryName = input.id.split("-")[0];

        // 找到这个国家的数据
        this.ageDataFiltered = this.ageData.filter(
          (d) => d[0] === countryName
        )[0][1];

        // 找到今天的数据
        this.dataByDate = groups(this.ageDataFiltered, (d) => d["date"]);
        // 将数据传到line去，这是我这个国家的由时间分组的数据。
        let curDateData = this.dataByDate.slice(-1)[0][1];
        let data = [];
        curDateData.forEach((d) => {
          data.push(
            {
              action: d["age_group"],
              visitor: d["people_vaccinated_per_hundred"],
              site: "vaccinated",
            },
            {
              action: d["age_group"],
              visitor: d["people_fully_vaccinated_per_hundred"],
              site: "fully_vaccinated",
            }
          );
        });

        this.funnel.destroy();
        this.funnel = funnel(data);

        this.data.forEach((d) => {
          let tmp = {
            country: d[0],
            data: d[1],
          };
          if (d[0] === countryName) {
            this.line.render(tmp, this.dataByDate);
          }
        });

        const mData = this.manufacturerData.filter(
          (d) => d.location === countryName
        );

        this.board.vData(curDateData);
        this.board.mData(mData);
        this.board.render();
      });

    this.selectCountryLabel = this.selectCountryDiv
      .selectAll("label")
      .data((d) => [d])
      .join("label")
      .style("margin-left", "16px")
      .style("width", "calc(100% - 30px)")
      .style("cursor", "pointer")
      .attr("for", (d) => `${d}-input`)
      .text((d) => d);
  }

  // 组合Line
  setLine(line) {
    this.line = line;
  }

  // 组合Board
  setBoard(board) {
    this.board = board;
  }

  // 组合Funnel
  setFunnel(funnel) {
    this.funnel = funnel;
  }
}

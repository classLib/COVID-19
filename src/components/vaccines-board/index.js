import {
  groups,
  sum
} from "d3";

class Board {
  constructor(selection, vData, manufacturerData) {
    this._selection = selection;
    this._vData = vData;
    this._manufacturerData = manufacturerData;
    this.init();
  }

  init() {
    this._vTitle = this._selection
      .append("div")
      .append("p")
      .style("text-align", "center")
      .style("margin", 0)
      .text("Vaccination status");
    this._vDataContainer = this._selection.append("div").attr("id", "v-data");

    this._mTitle = this._selection
      .append("div")
      .append("p")
      .style("text-align", "center")
      .style("margin", 0)
      .text("Manufacturer");
    this._mDataContainer = this._selection
      .append("div")
      .attr("id", "dose-data");
  }
  // 求取每一个每一百人下面的所有年龄段之和，那就是每多少个一百人下面的对应的完全接种和部分接种
  tansformData() {
    this.people_vaccinated_per_hundred = this.sumData = sum(
      this._vData,
      (d) => d.people_vaccinated_per_hundred
    );
    console.log(this._vData)
    this.count = this._vData.length;
    this.people_fully_vaccinated_per_hundred = sum(
      this._vData,
      (d) => d.people_fully_vaccinated_per_hundred
    );

    this._mData = groups(this._manufacturerData, (d) => d.date).slice(-1)[0][1];
    console.log(this.mData);
  }

  render() {
    this.tansformData();

    this.renderV();
    this.renderM();
  }

  renderV() {
    const vRows = this._vDataContainer
      .selectAll("div")
      .data(
        [{
            // 接种方案规定的所有剂量
            title: "people_fully_vaccinated" + '    /    ' + `${ this.count * 100}`,
            value: this.people_fully_vaccinated_per_hundred,
            color: "#008000",
          },
          {
            // 至少接种一针的比例
            title: "people_vaccinated" + '    /    ' + `${ this.count * 100}`,
            value: this.people_vaccinated_per_hundred,
            color: "#4395FF",
          }
        ],
        (d) => d.title
      )
      .join("div")
      .style("padding", "2px")
      .style("display", "flex");

    vRows
      .selectAll("div")
      .data((d) => {
        return [{
            text: d.title,
            color: "#212121"
          },
          {
            text: d.value.toFixed(2),
            color: d.color
          },
        ];
      })
      .join("div")
      .style("width", "50%")
      .style("font-weight", "700")
      .style("margin-top", "2px 0")
      .style("padding", "4px")
      .style("width", "50%")
      .transition()
      .duration(300)
      .style("background", "#fafafa")
      .style("text-align", "center")
      .style("border-bottom", "1px solid #eee")
      .style("color", (d) => d.color)
      .text((d) => d.text);
  }

  renderM() {
    const mRows = this._mDataContainer
      .selectAll("div")
      .data(this._mData, (d) => d.vaccine)
      .join("div")
      .style("padding", "2px")
      .style("display", "flex");

    mRows
      .selectAll("div")
      .data((d) => {
        return [{
            text: d.vaccine,
            color: "#212121"
          },
          {
            text: d.total_vaccinations,
            color: "#212121"
          },
        ];
      })
      .join("div")
      .style("width", "50%")
      .style("font-weight", "700")
      .style("margin-top", "2px 0")
      .style("padding", "4px")
      .style("width", "50%")
      .transition()
      .duration(300)
      .style("background", "#fafafa")
      .style("text-align", "center")
      .style("border-bottom", "1px solid #eee")
      .style("color", (d) => d.color)
      .text((d) => d.text);
  }

  vData(data) {
    this._vData = data;
  }

  mData(mData) {
    this._manufacturerData = mData;
  }
}

export function createBoard(selection, vData, mData) {
  const board = new Board(selection, vData, mData);
  board.render();
  return board;
}
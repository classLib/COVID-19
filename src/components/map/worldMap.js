import * as d3 from "d3";
import getRatioByName from "../util/getRatio";
export default class WorldMap {
    constructor(id, data, geoData) {
        //数据
        this.data = data;
        this.targetDataIndex = data.length - 1; // 初始的时间索引
        this.targetData = this.data[this.targetDataIndex]; // 初始的当天的所有国家的信息

        console.log(this.targetData);
        this.targetDataType = "Cumulative_cases";

        this.mapByCode = null;
        this.mapByName = null;

        //地图
        this.geoData = geoData;
        this.initProjection = null;
        this.geoPath = null;

        // 鼠标悬浮显示国家信息
        this.targetInfo = null;
        //渐变效果
        this.transition = null;
        this.duration = 250;
        this.liquidPlot = null;

        //视图
        this.id = id;

        this.width = document.querySelector(`#${id}`).offsetWidth;
        this.height = document.querySelector(`#${id}`).offsetHeight;
        this.svg = null;
        this.mg = null;
        this.map = null;

        this.color = null;

        this.bar = null;

        this.init();
        this.render();
    }

    init() {
        this.initSvg();
        //初始地图组
        this.initMapGroup();
        // 缩放
        this.initZoom();
        // 绑定事件
        // this.initEvent();
    }

    render() {
        // 更新
        this.renderDataMap();
        this.renderScale();
        this.renderProjection();
        this.renderMap();
    }
    // 初始SVG画布
    initSvg() {
        this.svg = d3
            .select(`#${this.id}`)
            .append("svg")
            .attr("viewBox", `0 0 ${this.width} ${this.height}`)
            .style("background-color", "#fff")
            .attr("id", "mapSvg");
    }
    // 初始地图组
    initMapGroup() {
        this.mg = this.svg.append("g").attr("id", "mapGroup");
        // 图例
        this.tooltip = d3
            .select("body")
            .append("div")
            .style("position", "absolute")
            .style("z-index", "10")
            .style("visibility", "hidden")
            .style("text-anchor", "middle")
            .text("");
        this.text = this.mg
            .append("text")
            .attr("id", "textShow")
            .attr("transform", `translate(${this.width / 3},${this.height / 20})`)
            .style("font-size", "2rem")
            .style("opacity", 0.8)
            .style("font-weight", 900)
            .text("Cumulative_cases Cases \n ");
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

    /*
     * 用国家代码和国家名称作为键，国家信息作为值
     * 根据传过来的时间分组好的数据，
     */
    renderDataMap() {
        // 用国家代码和国家名称作为键，国家信息作为值
        this.mapByCode = new Map();
        // key 是国家名称，值是国家信息
        this.mapByName = new Map();

        this.targetData.values.forEach((d) => {
            this.mapByCode.set(d["Country_code"], d);
            this.mapByName.set(d["Country"], d);
        });
        console.log(this.mapByCode);
        console.log(this.mapByName);
    }

    // 更新颜色比例尺
    renderScale() {
        let values = this.targetData.values.map((d) => +d[this.targetDataType]);
        let extent = d3.extent(
            this.targetData.values,
            (d) => +d[this.targetDataType]
        );
        this.color = d3
            .scaleSequentialQuantile()
            .domain([...values])
            .interpolator(d3.interpolatePuBu);
    }

    // 更新路径
    renderProjection() {
        this.initProjection = d3
            .geoEquirectangular()
            .fitSize([this.width * 1.2, this.height * 1.2], this.geoData)
            .translate([this.width * 0.46, this.height * 0.6]);
        this.geoPath = d3.geoPath().projection(this.initProjection);
    }

    // 更新地图
    renderMap() {
        this.map = this.mg
            .selectAll("path")
            .data(this.geoData.features)
            .join(
                (enter) =>
                enter
                .append("path")
                .style("cursor", "pointer")
                .attr("fill", "transparent")
                .on("click", (event, d) => {
                    let name = this.getDataByGeoData(d)["Country"]; //取得中文名字
                    console.log(name);
                    let data = this.bar.getDataByCountryName(name);
                    let curRatio = getRatioByName(
                        this.targetData.values,
                        this.targetDataType,
                        name
                    );
                    this.liquidPlot.changeData(curRatio);
                    this.bar.targetData = data == null ? [] : data;
                    this.bar.selectCountry.property("value", name);
                    this.bar.render();
                })
                .on("mouseover", (event, d) => {
                    // 设置透明度
                    event.target.style["fill-opacity"] = "1";
                    event.target.style["stroke"] = "#111";
                    // // 展示国家数据
                    let data = this.getDataByGeoData(d); //得到对应疫情数据
                    let name = this.getDataByGeoData(d)["Country"]; //取得中文名
                    this.tooltip
                        .style("visibility", "visible")
                        .style("left", event.pageX + "px")
                        .style("top", event.pageY + 20 + "px")
                        .style("opacity", 0.8)
                        .style("font-weight", 900)
                        .style("font-size", "1rem")
                        .style("font-weight", 900)
                        .text(name)
                        .transition(this.transition);
                })
                .on("mouseout", (event) => {
                    event.target.style["fill-opacity"] = "0.8";
                    event.target.style["stroke"] = "white";
                    this.tooltip.style("visibility", "hidden");
                }),
                // 得到对应的数据集
                (update) => update,
                (exit) => exit.remove()
            )
            .transition()
            .attr("d", this.geoPath)
            .style("fill", (d) => {
                // 如果找得到这个国家信息，就按颜色比例尺给对应的数据类型标签上色
                if (this.getDataByGeoData(d)) {
                    return this.color(+this.getDataByGeoData(d)[this.targetDataType]);
                }
                // 如果没有的话，就是透明
                return "transparent";
            })
            .style("fill-opacity", "0.8")
            .style("stroke", "write")
            .style("stroke-width", ".75px");
    }
    /**
     * 通过国家编码和国家名称找到对应的数据
     * 之前进行哈希表的分类，就可以通过键得到对应的值(这个国家的信息)
     *
     */
    getDataByGeoData(d) {
        return (
            this.mapByCode.get(d.properties.POSTAL) ||
            this.mapByName.get(d.properties.NAME) ||
            this.mapByName.get(d.properties.FORMAL_EN) ||
            this.mapByName.get(d.properties.NAME_LONG) ||
            this.mapByCode.get(d.properties.ISO_A2) ||
            this.mapByCode.get(d.properties.FIPS_10_) ||
            this.mapByCode.get(d.properties.ISO_A3) ||
            this.mapByCode.get(d.properties.WB_A2) ||
            this.mapByCode.get(d.properties.WB_A3) ||
            this.mapByName.get(d.properties.SOVEREIGNT) ||
            this.mapByName.get(d.properties.REGION_UN) ||
            this.mapByName.get(d.properties.ADMIN) ||
            this.mapByName.get(d.properties.GEOUNIT) ||
            this.mapByName.get(d.properties.SUBUNIT) ||
            undefined
        );
    }
    // 根据最后一组找所有的比例
    getRatioByName(name) {}
    setBar(bar) {
        this.bar = bar;
    }
    setliquidPlot(liquidPlot) {
        this.liquidPlot = liquidPlot;
    }
    // 渐变效果
    initTransition() {
        this.transition = this.svg
            .transition()
            .duration(this.duration)
            .ease(d3.easeLinear);
    }
}
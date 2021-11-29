import * as d3 from 'd3'
export default class WorldMap {
    constructor(id, data, geoData) {
        //数据
        this.data = data;
        this.targetDataIndex = 0; // 初始的时间索引
        this.targetData = this.data[this.targetDataIndex]; // 初始的当天的所有国家的信息
        this.targetDataType = 'Cumulative_cases';

        this.mapByCode = null;
        this.mapByName = null;

        //地图
        this.geoData = geoData;
        this.initProjection = null;
        this.geoPath = null;

        // 鼠标悬浮显示国家信息
        this.targetInfo = null
        //渐变效果
        this.transition = null;
        this.duration = 250;


        //视图
        this.id = id;

        this.width = document.querySelector(`#${id}`).offsetWidth;
        this.height = document.querySelector(`#${id}`).offsetHeight;
        this.svg = null;
        this.mg = null;
        this.map = null;

        this.color = null;

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
        this.svg = d3.select(`#${this.id}`)
            .append('svg')
            .attr('viewBox', `0 0 ${this.width} ${this.height}`)
            .style('background-color', '#eee')
            .attr('id', 'mapSvg');
    }
    // 初始地图组
    initMapGroup() {
        this.mg = this.svg.append('g')
            .attr('id', 'mapGroup')
        // 图例
        this.tooltip = d3.select('body')
            .append('div')
            .style('position', 'absolute')
            .style('z-index', '10')
            .style('visibility', 'hidden')
            .style('text-anchor', 'middle')
            .text('')
    }


    // initEvent() {
    //     this.selectControl = d3.select(`#${this.id}`)
    //         .append('div')
    //         .attr('class', 'my-1')
    //         .style('display', 'flex')
    //         .style('align-items', 'center');
    //     this.selectType = this.selectControl
    //         .append('select')
    //         .on('change', () => {
    //             this.targetDataType = d3.event.target.value;
    //             //数据改变更新视图
    //             this.render();
    //         })
    //         .selectAll('option')
    //         .data(['new_cases', 'new_death', 'cumulative_cases', 'cumulative_deaths', 'mortality'])
    //         .join('option')
    //         .text(d => d);
    // }
    initZoom() { //拖拽
        this.svg
            .call(d3.zoom()
                .on('zoom', this.zoomed)
            )
    }
    zoomed = (event) => {
        this.mg.attr('transform', `translate(${event.transform.x},${event.transform.y}) scale(${event.transform.k})`)
    }

    /*
     * 用国家代码和国家名称作为键，国家信息作为值
     * 根据传过来的时间分组好的数据，
     */
    renderDataMap() {
        // 用国家代码和国家名称作为键，国家信息作为值
        this.mapByCode = new Map();
        // key 是国家名称，值是国家信息
        this.mapByName = new Map();

        this.targetData.values.forEach(d => {
            this.mapByCode.set(d["Country_code"], d);
            this.mapByName.set(d["Country"], d);
        });
        console.log(this.mapByCode);
        console.log(this.mapByName);
    }


    // 更新颜色比例尺
    renderScale() {

        let values = this.targetData.values.map(d => +d[this.targetDataType]);
        // 映射颜色比例尺的数据范围
        let extent = d3.extent(this.targetData.values, d => +d[this.targetDataType]);
        console.log(values)

        this.color = d3.scaleSequentialQuantile()
            .domain([...values])
            .interpolator(d3.interpolatePuBu)

    }

    // 更新路径
    renderProjection() {
        this.initProjection = d3
            // 投影在二维平面
            .geoEquirectangular()
            // .scale 是缩放的
            // .fitSize 是大小宽度的
            .fitSize([this.width * 1.2, this.height * 1.2], this.geoData)
            // .translate 是左右移动的
            .translate([this.width * 0.46, this.height * 0.6]);
        // 路径生成器,生成path所需要的标准数据
        this.geoPath = d3.geoPath().projection(this.initProjection);
        // console.log(this.geoPath);
    }


    // 更新地图
    renderMap() {
        this.map = this.mg.selectAll('path')

            .data(this.geoData.features)
            .join(
                enter => enter.append('path')
                .style('cursor', 'pointer')
                .attr('fill', 'transparent')
                .on('click', d => {
                    let data = this.getDataByGeoData(d); //得到对应疫情数据
                    if (data) {
                        let name = this.getDataByGeoData(d)['country_zh']; //取得中文名字
                        this.histogram.targetData = this.histogram.getDataByCountryName(name)
                        this.histogram.selectCountry.property('value', name);
                        this.histogram.render();
                    }
                })
                .on("mouseover", (event, d) => {
                    // 设置透明度
                    event.target.style["fill-opacity"] = "1";
                    event.target.style["stroke"] = "#111";
                    // // 展示国家数据   
                    let data = this.getDataByGeoData(d); //得到对应疫情数据
                    let name = this.getDataByGeoData(d)['Country']; //取得中文名
                    this.tooltip.style('visibility', 'visible')
                        .style("left", (event.pageX) + "px")
                        .style("top", (event.pageY + 20) + "px")
                        .style("opacity", 0.8)
                        .style("font-weight", 900)
                        .style('font-size', '1rem')
                        .style('font-weight', 900)
                        .text(name)
                        .transition(this.transition)
                })
                .on('mouseout', (event) => {
                    event.target.style['fill-opacity'] = '0.8';
                    event.target.style['stroke'] = 'white';
                    this.tooltip.style('visibility', 'hidden')
                })
                // 得到对应的数据集
                ,
                update => update,
                exit => exit.remove()
            )
            .transition()
            .attr('d', this.geoPath)
            .style('fill', (d) => {
                // 如果找得到这个国家信息，就按颜色比例尺给对应的数据类型标签上色
                if (this.getDataByGeoData(d)) {
                    return this.color(+this.getDataByGeoData(d)[this.targetDataType]);
                }
                // 如果没有的话，就是透明
                return 'transparent';
            })
            .style("fill-opacity", "0.8")
            .style("stroke", "write")
            .style('stroke-width', '.75px')
    }
    /**
     * 通过国家编码和国家名称找到对应的数据
     * 之前进行哈希表的分类，就可以通过键得到对应的值(这个国家的信息)
     * 
     */
    getDataByGeoData(d) {
        return this.mapByCode.get(d.properties.POSTAL) ||
            this.mapByName.get(d.properties.NAME) ||
            this.mapByName.get(d.properties.FORMAL_EN) ||
            this.mapByName.get(d.properties.NAME_LONG)

            ||
            this.mapByCode.get(d.properties.ISO_A2) ||
            this.mapByCode.get(d.properties.FIPS_10_) ||
            this.mapByCode.get(d.properties.ISO_A3) ||
            this.mapByCode.get(d.properties.WB_A2) ||
            this.mapByCode.get(d.properties.WB_A3)

            ||
            this.mapByName.get(d.properties.SOVEREIGNT) ||
            this.mapByName.get(d.properties.REGION_UN) ||
            this.mapByName.get(d.properties.ADMIN) ||
            this.mapByName.get(d.properties.GEOUNIT) ||
            this.mapByName.get(d.properties.SUBUNIT) ||
            undefined;
    }
    // setHistogram(histogram) {
    //     this.histogram = histogram;
    // }
    // 渐变效果
    initTransition() {
        this.transition = this.svg.transition()
            .duration(this.duration)
            .ease(d3.easeLinear);
    }

}
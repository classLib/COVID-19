import * as d3 from 'd3'
export default class Line {
    constructor(id, data) {
        this.id = id;
        this.data = data;
        this.countryName = null;
        this.dataCountry = null;
        this.svg = null;
        this.mg = null;
        this.color = null;
        this.targetDataType = "daily_vaccinations";

        this.width = document.querySelector(`#${this.id}`).offsetWidth;
        this.height = document.querySelector(`#${this.id}`).offsetHeight;
        this.dataY = null;
        this.xScale = null;
        this.yScale = null;
        this.line = null;
        this.margin = {
            top: 50,
            right: 50,
            bottom: 130,
            left: 40
        };
        this.init();//初始化画布
        this.render();
    }
    init() {
        this.initSvg();
        this.initMainGroup();
        this.initAxis();
        this.initEvents();
    }
    initAxis() {
        this.xAxis = this.mg.append('g').attr('class', 'x-axis');
        this.yAxis = this.mg.append('g').attr('class', 'y-axis');
        this.lineGroup = this.mg.append('g').attr('class', 'line-group');
        this.rectGroup = this.mg.append('g').attr('class', 'rect-group');
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
    initEvents() {
        this.inputs = d3.select(`#${this.id}`)
            .append('div')
            .style('display', 'flex')
            .style('align-items', 'center')
            .style("margin-top", "10px")
        this.countryInfo = this.inputs
            .append('select')
            .style("cursor", "pointer")
            .attr("class", "input")
            .style("margin-left", "20px")
            .style('display', 'flex')
            .on('change', (e) => {
                this.targetDataType = e.target.value;
                //数据改变更新视图
                this.render();
            })
            .selectAll('option')
            // 对所有的案例进行绑定
            .data(['daily_vaccinations', 'people_vaccinated', 'people_fully_vaccinated', 'total_boosters',
                'daily_vaccinations_raw', 'daily_people_vaccinated', 'total_vaccinations_per_hundred',
                'people_vaccinated_per_hundred', 'people_fully_vaccinated_per_hundred', 'total_boosters_per_hundred',
                'daily_vaccinations_per_million', 'daily_people_vaccinated_per_hundred'
            ])
            .join('option')
            .text(d => d)
            .style("font-weight", "600")
    }
    initColor() {
        return d3.scaleOrdinal(
            this.countryName,
            d3.schemeCategory10
        );
    }

    render(data) {
        if (data) this.data = data;
        this.countryName = this.data.country;
        this.dataCountry = this.data.data;
        this.color = this.initColor();
        this.renderScale();
        this.renderAxis();
        this.renderRect();
        // this.renderLine();
    }

    renderRect() {
        this.rectGroup.selectAll('rect')
            .data(this.dataCountry)
            .join("rect")
            .transition(this.transition)
            .attr("fill", this.color(this.countryName))
            .attr('width', (this.width / this.dataCountry.length) / 2)
            .attr('height', d => {
                return this.height - this.margin.bottom - this.yScale(+d[this.targetDataType]);
            })
            .attr('x', d => {
                return this.xScale(new Date(d['date']));
            })
            .attr('y', d => this.yScale(+d[this.targetDataType]))
    }
    renderScale() {
        const startDate = new Date(this.dataCountry[0].date),
            endDate = new Date(this.dataCountry[this.dataCountry.length - 1].date);
        this.xScale = d3.scaleTime()
            //规范日期格式后找最大
            .domain(d3.extent(this.dataCountry, d => new Date(d['date'])))
            .nice()
            .range([this.margin.left, this.width - this.margin.right]//range);

        // d3.scaleTime(
        //     [startDate, endDate], //domain
        //     [this.margin.left, this.width - this.margin.right]//range

        // );
            );
        this.dataY = this.dataCountry.map(d => +d[this.targetDataType]);
        const yMax = Number.parseInt(d3.max(this.dataY));
        this.yScale = d3.scaleLinear(
            [0, yMax],
            [this.height - this.margin.bottom, this.margin.top]
        );
    }

    renderAxis() {
        this.xAxis = this.xAxis
            .attr('transform', `translate(0,${this.height - this.margin.bottom})`)
            .call(d3.axisBottom(this.xScale));

        this.yAxis = this.yAxis
            .attr('transform', `translate(${this.margin.left},0)`)
            .call(d3.axisLeft(this.yScale));
    }

    renderLine() {
        this.line = d3.line()
            .x(d => this.xScale(new Date(d.date)))
            .y(d => this.yScale(
                +d["daily_vaccinations"]
            ))
            .curve(d3.curveNatural);
        this.lineGroup
            .selectAll('path')
            .data([this.dataCountry])
            .join('path')
            .attr('d', this.line)
            .style('stroke', d => this.color(this.countryName))
            .style('stroke-width', 2)
            .style('fill', 'transparent')
    }
}
export default class RadioSet {
    constructor(id, data) {
        this.id = id;
        this.data = data;

        this.svg = null;
        this.mg = null;

        this.width = document.querySelector(`#${this.id}`).offsetWidth;
        this.height = document.querySelector(`#${this.id}`).offsetHeight;

        this.margin = {
            top: 60,
            right: 200,
            bottom: 150,
            left: 100
        };
        this.init();//初始化画布
    }
    init() {
        // this.initSvg();
        // this.initMainGroup();
        this.initEvents();//初始化监听事件
    }
    render() {

    }

    initEvents() {
        let countyNames = [];
        this.data.forEach(d => {
            countyNames.push(d[0]);
        })
        this.selectControl = d3.select(`#${this.id}`)
            .append('div')
            .style('display', 'flex')
            .style('align-items', 'center');

        this.selectCountry = this.selectControl
            .append('div')
            .attr('id', 'selectCountry')
        // .on('change', () => {
        //     this.targetData = (d3.event.target.value);
        //     this.render();
        // });
        // 添加一个div，每个div里面有一个input和label
        this.selectCountryDiv = this.selectCountry
            .selectAll("div")
            .data(countyNames)
            .join("div")
            .attr("class", "selectCountryDiv")
            .attr("name", d => d)
            .on("click", (e) => {
                // 点击当前的div，则选中对应的radio，并切换数据为这个国家的数据
                let input = e.target.childNodes[0];
                let countryName = e.target.childNodes[1].innerText;
                input.checked = 'checked';
                this.data.map((d) => {
                    if (d[0] === countryName) this.line.render(
                        {
                            "country": d[0],
                            "data": d[1]
                        });
                })
            })
        this.selectCountryRadio = this.selectCountryDiv.selectAll("input")
            .data([1])
            .join("input")
            .attr("type", "radio")
            .attr("name", "countryNames");
        this.selectCountryLabel = this.selectCountryDiv.selectAll("label")
            .data(d => [d])
            .join("label")
            .text(d => d);
    }
    setLine(line) {
        this.line = line;
    }

}

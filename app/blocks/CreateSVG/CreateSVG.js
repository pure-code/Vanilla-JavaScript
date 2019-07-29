export default class CreateSVG{

  constructor(chart, View){
    
    let view = View;
    this.CHART = chart;
    this.ctx = document.querySelector('.chart');
    this.isActive = false;
    this.maxGrafhTop = 1;

    this.data = {};
    this.setData();

    this.chart = {

      columns: this.data.columns,
      data: {},
      getData(){

        for(let key in chart){
  
          let value = chart[key]
  
          this.data = value[0];
  
          return;
  
        }
  
      },

    };

    const count = this.data.columns[1].length;

    this.x = 35;

    this.y = ()=>{

      let coors = [];
      let arrIndex = 0;

      for(let i = 1; i < this.data.columns.length; i++){

        coors[arrIndex] = [];

        for(let index = 1; index < count; index++){
          
          coors[arrIndex].push(this.data.columns[i][index]);

        }

        arrIndex++;

      }
      
      return coors;

    };

    const property = {
      class: 'chart__svg',
      width: '100%',
      height: window.innerHeight > 600 ? 500 : window.innerHeight * .5,
    };
    
    let lineStep = (property.height - 20) / 5;
    const template = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    template.setAttribute('class', property.class);
    template.setAttribute('height', property.height);
    template.setAttribute('width', property.width);
    template.innerHTML = `
        <g class="viewCount">
          <text x="0" y="15" fill="#4d5b75">0</text>
            <path d="M0 20 L5000 20" stroke="#344058" stroke-width="1" />
          <text x="0" y="${lineStep * 1 + 10}" fill="#4d5b75">0</text>
            <path d="M0 ${lineStep * 1 + 20} L5000 ${lineStep * 1 + 20}" stroke="#344058" stroke-width="1" />
          <text x="0" y="${lineStep * 2 + 10}" fill="#4d5b75">0</text>
            <path d="M0 ${lineStep * 2 + 20} L5000 ${lineStep * 2 + 20}" stroke="#344058" stroke-width="1" />
          <text x="0" y="${lineStep * 3 + 10}" fill="#4d5b75">0</text>
            <path d="M0 ${lineStep * 3 + 20} L5000 ${lineStep * 3 + 20}" stroke="#344058" stroke-width="1" />
          <text x="0" y="${lineStep * 4 + 10}" fill="#4d5b75">0</text>
            <path d="M0 ${lineStep * 4 + 20} L5000 ${lineStep * 4 + 20}" stroke="#344058" stroke-width="1" />
          <text x="0" y="${property.height - 10}" fill="#4d5b75">0</text>
            <path d="M0 ${property.height} L5000 ${property.height}" stroke="#344058" stroke-width="1" />
        </g>
        <g class="chart__graphs">
        </g>
    
    `;

    this.init(template, view);
    
  } 

  setData(){

    for(let key in this.CHART){

      let value = this.CHART[key]

      this.data = value[0];

    }

  };


  init(template, View){

    this.ctx.appendChild(template);
    
    this.setGraphs();
    let view = new View();
    view.setGraphsHeight();
    this.setDates();
    
  }

  setDates(){

    const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let dates = this.chart.columns[0];
    let wrap = document.createElement('div');
    let svgWidth = document.querySelector('.chart__line').getBoundingClientRect().width;
    let count = 0;

    wrap.className = 'chart__dates';
    wrap.style.width = svgWidth + 'px';
    wrap.style.transform = `translateX(-${svgWidth - this.ctx.offsetWidth}px)`;

    
    for(let i = 1; i < dates.length; i++){

      if(i === 1 || count === 3 || i === dates.length - 1){
        let date = document.createElement('span');
        let curDate = new Date(dates[i]);

        date.className = 'chart__date';
        date.innerText = MONTHS[curDate.getMonth()] + ' ' + curDate.getDate();

        wrap.appendChild(date);
      }

      count = count === 3 ? 0 : count + 1;

    }

    this.ctx.appendChild(wrap);

  }

  setGraphs(){

    let x = 0;
    let y = this.y();
    let svg = this.ctx.querySelector('.chart__graphs');

    let d = [];

    for(let i1 = 0; i1 < y.length; i1++){

      let colors = i1 === 0 ? this.data.colors.y0 : this.data.colors.y1;

      for(let i = 0; i < y[0].length; i++){

        i === 0 ? d.push('M' + 0 + ' ' + Math.round(document.querySelector('.chart__svg').getBoundingClientRect().height - y[i1][i]) ) : d.push( 'L' + x + ' ' + Math.round(document.querySelector('.chart__svg').getBoundingClientRect().height - y[i1][i]) );

        x += this.x;
      }
      if(!this.isActive){

        let template =  `
            <g class="chart__line">
              <path d="${d.join().replace(/,/gi, ' ')}" stroke="${colors}" stroke-linejoin="round" vector-effect="non-scaling-stroke" fill="none" stroke-width="2.2px"></path>
              <circle class="selection" cx="0" cy="${document.querySelector('.chart__svg').getBoundingClientRect().height}" r="6" stroke="${colors}" stroke-width="2px" fill="#242f3e"></circle>
            </g>
        
          `;
        
        svg.innerHTML += template;

      } else{
        
        let path = svg.querySelectorAll('path');
        
        path[i1].setAttribute('d', d.join().replace(/,/gi, ' '));

      }



      x = 0;
      d = [];

    }

    let svgWidth = svg.getBoundingClientRect().width;
    svg.style.transform = `translateX(-${svgWidth - this.ctx.offsetWidth}px)`;

    this.isActive = true;

  }


}
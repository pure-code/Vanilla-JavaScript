import * as data from '../../chart_data.json';

export default class View{

  constructor(){
    this.ctx = document.querySelector('.chart');
    this.svgPos = this.ctx.querySelector('svg').getBoundingClientRect();
    this.linesWidth = this.ctx.querySelector('.chart__graphs').getBoundingClientRect().width;
    this.betweenSize = Math.round(this.linesWidth / 111);
    this.lines = document.querySelectorAll('.chart__line');

    window.addEventListener('resize', ()=> {
      this.svgPos = this.ctx.querySelector('svg').getBoundingClientRect();
      this.linesWidth = this.ctx.querySelector('.chart__graphs').getBoundingClientRect().width;
    });

  }

  showData(e, curPos){

    const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let dates = data[0].columns[0];
    let countY1 = data[0].columns[1];
    let countY2 = data[0].columns[2];
    this.ctx = document.querySelector('.chart');
    let pointer = document.querySelector('.chart__pointer');
    let bubble = document.querySelector('.bubble');
    let selectionDot = document.querySelectorAll('.selection');

    if(e.type === 'mouseleave' || e.type === 'touchend'){

      pointer.style.display = 'none';
      bubble.style.display = 'none';
      selectionDot[0].style.display = 'none';
      selectionDot[1].style.display = 'none';

      return;

    }

    this.setValue(curPos);//////////////-------------------------

    let date = document.querySelector('.bubble__date');
    let bubbleCount = bubble.querySelectorAll('.bubble__count');
    let mousePos = e.type === 'touchmove' ? e.targetTouches[0].pageX : e.clientX;
    let testMouse = (this.svgPos.right - mousePos) + (this.firstTranslate - curPos - 15);
    let selection = Math.round((this.linesWidth - testMouse) / this.betweenSize);
    let isMouseOutLeft = mousePos - this.svgPos.left - (bubble.offsetWidth / 2);
    let isMouseOutRight = (mousePos - this.svgPos.left);
    
    selectionDot[0].style.transform = `translate(${(selection - 1) * this.betweenSize}px, -${(countY1[selection] * this.maxGrafhTop)}px)`;
    selectionDot[1].style.transform = `translate(${(selection - 1) * this.betweenSize}px, -${(countY2[selection] * this.maxGrafhTop)}px)`;
    selectionDot[0].style.display = 'block';
    selectionDot[1].style.display = 'block';
    
    if(mousePos - this.svgPos.left >= this.svgPos.width - 2){

      pointer.style.left = this.svgPos.width - 2 + 'px';

    } else {

      pointer.style.left = mousePos - this.svgPos.left + 'px';

    }
    
    if(isMouseOutLeft <= 0){

      bubble.style.left = 0;

    } else if(isMouseOutRight >= this.svgPos.width - (bubble.offsetWidth / 2)){

        bubble.style.left = this.svgPos.width - (bubble.offsetWidth) + 'px';

    } else {

        bubble.style.left = mousePos - this.svgPos.left - (bubble.offsetWidth / 2) + 'px';

    }

    pointer.style.display = 'block';
    bubble.style.display = 'block';
    bubbleCount[0].innerText = countY1[selection];
    bubbleCount[1].innerText = countY2[selection];
    
    let curDate = new Date(dates[selection])
    date.innerText = DAYS[curDate.getDay()] + ', ' + MONTHS[curDate.getMonth()] + ' ' + curDate.getDate();

  }

  setValue(curPos = this.firstTranslate){

    let isHideLine = document.querySelectorAll('.chart__line')[0].classList.contains('chart__line--hide');
    let countY = isHideLine ? data[0].columns[2] : data[0].columns[1];
    let currentValues = [];
    let maxGrafhTop;
    let valueBox = [];
    let selection = Math.round(((this.linesWidth - (this.firstTranslate - curPos)) - this.svgPos.width ) / this.betweenSize);
    let countPos = document.querySelectorAll('text');

    for(let i = 1; i < countY.length; i++){
      currentValues.push(countY[i]);
    }

    let testTranslateRight = (this.firstTranslate - curPos) / this.betweenSize;

    for(let i = selection; i < (currentValues.length - testTranslateRight); i++){
      valueBox.push(currentValues[i]);
    }

    maxGrafhTop = (Math.max.apply(null, valueBox));
    this.maxGrafhTop = (this.svgPos.height - 20) / maxGrafhTop;
    
    let countLine = maxGrafhTop / (countPos.length - 1);

    for(let i = 0; i < countPos.length; i++){

      countPos[i].innerHTML = Math.round(maxGrafhTop, 1);

      maxGrafhTop -= countLine;

    }
    this.setGraphsHeight();

  }

  setGraphsHeight(){
    
    for(let i = 0; i < this.lines.length; i++){

      this.lines[i].querySelector('path').style.transform = `scale(1, ${this.maxGrafhTop})`;
      
    }

    

  }

}
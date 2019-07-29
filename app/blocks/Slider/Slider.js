export default class Slider{
  
  constructor(option) {
    
    this.View = new option.view(); 
    this.app = option.app;
    this.slider = option.slider;
    this.pointer = option.pointer;
    this.changeWidth = option.changeWidth;
    this.svg = document.querySelector('.chart__graphs');
    let svgWidth = this.getRect(this.svg).width;
    this.svgMaxWidth = svgWidth / 112;
    this.wrap = document.querySelector('.chart');
    this.isActive = false;
    this.maxScale = 1;
    this.minScale = this.slider.offsetWidth / svgWidth;
    this.resizeSide = {};
    this.rightMove = this.getRect(this.slider).right - this.getRect(this.pointer).right;
    this.leftSideCoord = this.getRect(this.slider).left;
    this.lastLeftPosition = this.getRect(this.pointer).left - this.getRect(this.slider).left;
    this.currentTranslate = svgWidth - this.wrap.offsetWidth;
    this.currentScale = this.maxScale;
    this.datesWrap = document.querySelector('.chart__dates');
    
    this.slider.addEventListener('mousedown', e => this.dragStart(e));
    document.addEventListener('mousemove', e => this.dragStart(e));
    document.addEventListener('mouseup', e => this.dragEnd(e));
    this.slider.addEventListener('touchstart', e=>this.dragStart(e));
    this.slider.addEventListener('touchmove', e=>this.move(e));
    this.slider.addEventListener('touchmove', e=>this.resize(e));
    this.slider.addEventListener('touchend', e=>this.dragEnd(e));
    window.addEventListener('resize', ()=> this.leftSideCoord = this.getRect(this.slider).left);

    /////////-----------------------!!!
    this.View.firstTranslate = this.currentTranslate;
    this.View.setValue();
    this.wrap.addEventListener('mousemove', e => this.View.showData(e, this.currentTranslate));
    this.wrap.addEventListener('mouseleave', e => this.View.showData(e));
    this.wrap.addEventListener('touchmove', e => this.View.showData(e, this.currentTranslate));
    this.wrap.addEventListener('touchend', e => this.View.showData(e));
    /////////-----------------------

  }

  dragStart(e){

    if(e.type === 'mousedown'){
      this.isActive = true;
      this.draggedItem = e.target;
      this.shiftX = e.clientX - this.getRect(this.pointer).left;
    }

    if(e.type === 'touchstart'){
      this.isActive = true;
      this.draggedItem = e.target;
      this.shiftX = e.targetTouches[0].pageX - this.getRect(this.pointer).left;
    }
    
    if(this.isActive){

      this.draggedItem.classList.contains('slider__move') ? this.move(e) : this.resize(e);

    }

    return false; 

  }

  move(e){
    
    if(!this.isActive){
      return;
    }

    let leftPosition, rightPosition;
    let mousePos = e.type === 'touchmove' ? e.targetTouches[0].pageX : e.clientX;
    let rightSide = this.leftSideCoord + this.slider.offsetWidth;
    let graphsTransform = mousePos - this.leftSideCoord - this.shiftX;
    this.setPosition = mousePos - this.shiftX - this.leftSideCoord;
    
    if((mousePos - this.shiftX) < this.leftSideCoord){

      this.setPosition = 0;
      graphsTransform = 0;

    }

    if((mousePos - this.shiftX) + this.pointer.offsetWidth > rightSide){
      
      // rightPosition = this.slider.offsetWidth - this.pointer.offsetWidth;

    } else{
      
      let sliderWidth = this.slider.offsetWidth;
      let pointer = this.pointer.offsetWidth;
      let appWidth = this.wrap.offsetWidth;
      let svgWidth = this.getRect(this.svg).width - appWidth;
      
      leftPosition = this.setPosition;
      rightPosition = this.lastLeftPosition - this.setPosition;

      this.svg.style.transform = `translateX(-${graphsTransform * (svgWidth / (sliderWidth - pointer))}px) scale(${this.currentScale}, 1)`;
      this.datesWrap.style.transform = `translateX(-${graphsTransform * (svgWidth / (sliderWidth - pointer))}px)`;

      this.currentTranslate = graphsTransform * (svgWidth / (sliderWidth - pointer));
      
    }
    
    this.pointer.style.left = leftPosition + 'px';
    this.pointer.style.right = rightPosition + 'px';

    this.pointer.ondragstart = ()=> false;
    
    this.View.setGraphsHeight();
    this.View.setValue(this.currentTranslate);

  }

  resize(e){

    return;

    if(e.type === 'touchstart'){
      return;
    }
    
    if(!this.isActive){
      return;
    }
    
    let mousePos = e.type === 'touchmove' ? e.targetTouches[0].pageX : e.clientX;
    let push = e.type === 'touchstart' || e.type === 'mousedown';
    let rightSide = this.leftSideCoord + this.slider.offsetWidth;
    
    if(mousePos < this.leftSideCoord) return;
    if(mousePos > rightSide) return;

    let scaleStep = (this.maxScale - this.minScale) / this.wrap.offsetWidth;
    let testScaleStep = scaleStep * (this.wrap.offsetWidth - (this.slider.offsetWidth - this.pointer.offsetWidth));
    
    this.svg.style.transform = ` translate(-${this.getRect(this.svg).width - this.wrap.offsetWidth}px, 0px) scale(${this.currentScale}, 1)`;
    this.currentScale = this.maxScale - testScaleStep;
    
    if( push && e.target.classList.contains('slider__resize--right')){
      
      this.resizeSide.right = e.target;

    } else if( push && e.target.classList.contains('slider__resize--left')){

      this.resizeSide.left = e.target;

    }
    
    if(this.resizeSide.right){
      this.pointer.style.right = this.getRect(this.slider).right - mousePos + 'px';
    }
    
    if(this.resizeSide.left){
      this.pointer.style.left = mousePos - this.getRect(this.slider).left + 'px';
    }

    this.lastLeftPosition = (this.getRect(this.pointer).left - this.getRect(this.slider).left) + (this.getRect(this.slider).right - this.getRect(this.pointer).right);

    this.changeWidth.ondragstart = ()=> false;

    this.View.setGraphsHeight();

  }

  dragEnd(){

    if(!this.isActive) return;

    this.isActive = false;
    this.resizeSide = {};

  }

  getRect(elem) {

    let rect = elem.getBoundingClientRect();
  
    return rect;
  
  }

}
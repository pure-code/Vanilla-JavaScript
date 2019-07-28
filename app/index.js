import './sass/style.scss';
import Slider from './blocks/Slider/Slider';
import CreateSVG from './blocks/CreateSVG/CreateSVG';
import View from './blocks/View/View';
import ViewControls from './blocks/ViewControls/ViewControls';
import * as data from './chart_data.json';

document.addEventListener('DOMContentLoaded', ()=>{

  const chart = data;
  let createSVG = new CreateSVG(chart, View);
  let slider = new Slider({
    slider: document.querySelector('.slider'),
    pointer: document.querySelector('.slider__move'),
    changeWidth: document.querySelector('.slider__resize'),
    app: createSVG,
    view: View
  });
  let viewControls = new ViewControls(slider.View);
  
});

export default class ViewControls {
  
  constructor(View){
    this.view = View;
    this.lines = document.querySelectorAll('.chart__line');
    document.querySelector('.viewControls').addEventListener('click', e => this.changeView(e));
  }

  changeView(e){
    
    let t = e.target;

    while (t !== document.body){

      if(t.classList.contains('viewControls__item--green')){

        t.querySelector('.viewControls__selection').classList.toggle('viewControls__selection--hideGreen');
        document.querySelector('.bubble__item--joined').classList.toggle('bubble__item--hide');
        this.lines[0].classList.toggle('chart__line--hide');
        this.view.setValue();

        return;

      }

      if(t.classList.contains('viewControls__item--red')){
        
        t.querySelector('.viewControls__selection').classList.toggle('viewControls__selection--hideRed');
        document.querySelector('.bubble__item--left').classList.toggle('bubble__item--hide');
        this.lines[1].classList.toggle('chart__line--hide');
        this.view.setValue();

        return;

      }

      t = t.parentNode;

    }
  
  }

};

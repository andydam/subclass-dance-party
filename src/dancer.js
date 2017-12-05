//declare Dancer class
var Dancer = class Dancer { 
  constructor (top, left, timeBetweenSteps) {
    //assign properties of Dancer
    //create DOM node
    this.$node = $('<div class="dancer"></div>');
    this.timeBetweenSteps = timeBetweenSteps;
    //set position of Dancer
    this.setPosition(top, left);
    //store start position
    this.start = [top, left];
    //create storage for timer
    this.timer;
    //start dance steps
    this.step();
  }

  setPosition (top, left) {
    var styleSettings = {
      top: top,
      left: left
    };
    //set start position
    this.$node.css(styleSettings);
  }

  step () {
    //set interval of steps
    this.timer = setTimeout(this.step.bind(this), this.timeBetweenSteps);
  }
};

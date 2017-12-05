var Dancer = class Dancer {

  constructor (top, left, timeBetweenSteps) {
    this.$node = $('<div class="dancer"></div>');
    this.timeBetweenSteps = timeBetweenSteps;
    this.step();
    this.setPosition(top, left);
    this.start = [top, left]
    this.timer;
  }

  setPosition (top, left) {
    var styleSettings = {
      top: top,
      left: left
    };
    this.$node.css(styleSettings);
  }
  step () {
    this.timer = setTimeout(this.step.bind(this), this.timeBetweenSteps);
  }
};

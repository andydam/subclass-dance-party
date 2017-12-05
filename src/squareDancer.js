var SquareDancer = class SquareDancer extends Dancer {
  constructor(top, left, timeBetweenSteps) {
    super(top, left, timeBetweenSteps);
    this.$node.addClass('squareDancer');
    this.stepCount = 0;
  }
  dance () {
    switch (this.stepCount) {

    case 0:
      this.$node.animate({'left': '+=50px'});
      this.stepCount = 1;
      break;
    case 1:
      this.$node.animate({'top': '+=50px'});
      this.stepCount = 2;
      break;
    case 2:
      this.$node.animate({'left': '-=50px'});
      this.stepCount = 3;
      break;
    case 3:
      this.$node.animate({'top': '-=50px'});
      this.stepCount = 0;
      break;
    }
  }
  step() {
    super.step();
    this.dance();
  }
};
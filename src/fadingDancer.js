var FadingDancer = class FadingDancer extends Dancer {
  constructor(top, left, timeBetweenSteps) {
    super(top, left, timeBetweenSteps);
    this.$node.addClass('fadingDancer');
  }
  step() {
    super.step();
    this.$node.fadeToggle();
  }
};
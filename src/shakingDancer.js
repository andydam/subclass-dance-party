var ShakingDancer = class ShakingDancer extends Dancer {
  constructor(top, left, timeBetweenSteps) {
    super(top, left, timeBetweenSteps);
    this.$node.addClass('shakingDancer');
    this.$node.show();
  }
  step() {
    super.step();
    this.$node.slideToggle();
  }
};
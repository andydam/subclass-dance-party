var ShakingDancer = class ShakingDancer extends Dancer {
  constructor(top, left, timeBetweenSteps) {
    //inherit Dancer properties and methods
    super(top, left, timeBetweenSteps);
    //set class of DOM node
    this.$node.addClass('shakingDancer');
    //ensure DOM node is displayed
    this.$node.show();
  }
  step() {
    //call Dancer's step
    super.step();
    //slide dancer in and out
    this.$node.slideToggle();
  }
};
var FadingDancer = class FadingDancer extends Dancer {
  constructor(top, left, timeBetweenSteps) {
    //inherit Dancer properties and methods
    super(top, left, timeBetweenSteps);
    //set class of DOM node
    this.$node.addClass('fadingDancer');
  }

  step() {
    //call Dancer's step
    super.step();
    //fade in and out dancer
    this.$node.fadeToggle();
  }
};
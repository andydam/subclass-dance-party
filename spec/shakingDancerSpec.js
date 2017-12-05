describe('shakingDancer', function() {

  var shakingDancer, clock;
  var timeBetweenSteps = 100;

  beforeEach(function() {
    clock = sinon.useFakeTimers();
    shakingDancer = new ShakingDancer(10, 20, timeBetweenSteps);
  });

  it('should have a jQuery $node object', function() {
    expect(shakingDancer.$node).to.be.an.instanceof(jQuery);
  });

  it('should have a step function that makes its node blink', function() {
    sinon.spy(shakingDancer.$node, 'toggle');
    shakingDancer.step();
    expect(shakingDancer.$node.toggle.called).to.be.true;
  });

  describe('dance', function() {
    it('should call step at least once per second', function() {
      sinon.spy(shakingDancer, 'step');
      expect(shakingDancer.step.callCount).to.be.equal(0);
      clock.tick(timeBetweenSteps); // ? it seems an extra tick is necessary...
      clock.tick(timeBetweenSteps);

      expect(shakingDancer.step.callCount).to.be.equal(1);

      clock.tick(timeBetweenSteps);
      expect(shakingDancer.step.callCount).to.be.equal(2);
    });
  });
});

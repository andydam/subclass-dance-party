$(document).ready(function() {
  window.dancers = [];
  window.lineUp = false;
  window.following = false;

  $('.addDancerButton').on('click', function(event) {
    /* This function sets up the click handlers for the create-dancer
     * buttons on dancefloor.html. You should only need to make one small change to it.
     * As long as the "data-dancer-maker-function-name" attribute of a
     * class="addDancerButton" DOM node matches one of the names of the
     * maker functions available in the global scope, clicking that node
     * will call the function to make the dancer.
     */

    /* dancerMakerFunctionName is a string which must match
     * one of the dancer maker functions available in global scope.
     * A new object of the given type will be created and added
     * to the stage.
     */
    var dancerMakerFunctionName = $(this).data('dancer-maker-function-name');

    // get the maker function for the kind of dancer we're supposed to make
    var dancerMakerFunction = window[dancerMakerFunctionName];

    // make a dancer with a random position
    var dancer = new dancerMakerFunction(
      $('body').height() * Math.random(),
      $('body').width() * Math.random(),
      Math.random() * 1000
    );
    //add dancer to page
    $('body').append(dancer.$node);
    //add dancer to dancers storage array
    window.dancers.push(dancer);
    //add event handler for mouse over
    dancer.$node.mouseover(mouseOver);
  });

  //add event listener for follow mouse
  document.addEventListener('click', function(ev) {
    var f = document.getElementsByClassName('follower');
    for (var i = 0; i < f.length; i++) {
      f[i].style.transform = 'translateY(' + (ev.clientY - 25) + 'px)';
      f[i].style.transform += 'translateX(' + (ev.clientX - 25) + 'px)';
    }
  }, false);
});

$('.findPartner').on('click', function() {
  //find parnter button clicked
  //iterate through dancers array
  dancers.forEach(function(dancer) {
    //get random color
    var color = randomColor();
    //get closest dancer
    var closest = findClosest(dancer);
    //set pair of dancers to same random color
    dancer.$node.css({'background-color': `${color}`});
    closest.$node.css({'background-color': `${color}`});
  });
});

$('.followMouse').on('click', function() {
  //follow mouse button clicked
  if (!following) {
    //pull first dancer
    var f = dancers[0];
    //freeze first dancer
    freezeAndMove(f, 0, 0);
    //add follower class
    f.$node.addClass('follower');
    //remove mouseover bind
    f.$node.unbind('mouseover');
    following = true;
  } else {
    //pull first dancer
    var f = dancers[0];
    //remove follower class
    f.$node.removeClass('follower');
    //rebind mouseover
    f.$node.mouseover(mouseOver);
    //reset dancers
    resetAllDancers();
    following = false;
  }
});

var randomColor = function() {
  //create possible array of colors
  var colors = ['green', 'red', 'blue', 'yellow', 'white', 'brown', 'black', 'orange', 'grey'];
  //randomly generate index for random color
  var colorIndex = Math.floor(Math.random(colors.length) * 10);
  //return random color
  return colors[colorIndex];
};

//found rotate animation function online
var animateRotate = function(element, angle, duration, easing, complete) {
  var args = $.speed(duration, easing, complete);
  var step = args.step;
  return $(element).each(function(i, e) {
    args.complete = $.proxy(args.complete, e);
    args.step = function(now) {
      $.style(e, 'transform', 'rotate(' + now + 'deg)');
      if (step) { return step.apply(e, arguments); }
    };

    $({deg: 0}).animate({deg: angle}, args);
  });
};

var mouseOver = function(event) {
  //get target element
  let element = event.target;
  //rotate element 360 degrees
  animateRotate(element, 360);
};

var freezeAndMove = function(element, top, left) {
  //stop dancer's timer
  clearInterval(element.timer);
  //clear dancer's timer
  element.timer = null;
  //stop dancer's animations
  element.$node.stop(true, true);
  //make sure dancer is shown
  element.$node.show();
  //move dancer in line
  element.$node.css({'top': `${top}px`, 'left': `${left}px`});
};

var lineup = function() { // buggy. If we populate with dancers, invoke lineup, and populate more dancers, they're out of sync.
  //iterate through all dancers
  if (!lineUp) {
    dancers.forEach(function(dancer, index) {
      freezeAndMove(dancer);
      //move dancer in line
      var leftPos = 48.5;
      if (index === 0) {
        leftPos = 50;
      } else if (index % 2 === 0) {
        //if even
        leftPos += index * 3;
      } else {
        //if odd
        leftPos -= index * 3;
      }
      dancer.$node.css({'background-color': 'transparent', 'top': '77%', 'left': `${leftPos}%`, 'position': 'absolute'});
    });
    //set lined up status
    lineUp = true;
  } else {
    //reset dancers
    resetAllDancers();
    //set lined up status
    lineUp = false;
  }
};

var resetAllDancers = function() {
  //iterate through dancers and reset
  dancers.forEach(function(dancer, index) {
    //check if dancer still has timer
    if (dancer.timer) {
      //for new dancers populated when lineUp == true
      //has timer, clear it
      clearInterval(dancer.timer);
    }
    //move dancer back to start position
    dancer.setPosition(dancer.start[0], dancer.start[1]);
    //restart dancer's timer
    dancer.timer = setTimeout(dancer.step.bind(dancer), dancer.timeBetweenSteps); 
  });
};

var findDistance = function(elem1, elem2) {
  //find distance between two elements
  var verticalDiff = Math.abs(elem1[0] - elem2[0]);
  var horizontalDiff = Math.abs(elem1[1] - elem2[1]);

  return Math.sqrt(Math.pow(verticalDiff, 2) + Math.pow(horizontalDiff, 2));
};

var findClosest = function(element) {
  //declare variables for shortest distance and closest element
  var shortest, closestElement;
  //iterate through all dancers
  dancers.forEach(function(dancer) {
    //test if dancer is the same as current
    if (dancer !== element) {
      //not the same, proceed with comparison
      //get distances between dancers
      var distance = findDistance([element.$node.position().top, element.$node.position().left], [dancer.$node.position().top, dancer.$node.position().left]);
      //test if first dancer
      if (shortest === undefined) {
        //is first dancer, set shortest and clostElement to first dancer
        shortest = distance;
        closestElement = dancer;
      }
      //compare current distance with shortest
      if (distance < shortest) {
        //is shorter than shortests, set shortest and closestElement
        shortest = distance;
        closestElement = dancer;
      }
    }
  });
  
  //return nearest element
  return closestElement;
};

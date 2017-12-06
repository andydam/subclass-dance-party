$(document).ready(function() {
  window.dancers = [];
  window.settings = {
    linedUpToggle: false,
    followMouseToggle: false,
    partnerToggle: false,
    canCan: {
      toggle: false,
      timer: null,
      stepCount: 0
    }
  };

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
    dancer.$node.mouseover(function(event) {
      if (!settings.canCan.toggle) {
        //get target element
        var element = event.target;
        //rotate element 360 degrees
        animateRotate(element, 360);
      }
    });
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

var playMusic = function(url) {
  //set source of music to url
  document.getElementsByClassName('musicPlayer')[0].setAttribute('src', url);
  //reload player element
  document.getElementsByClassName('musicPlayer')[0].load();
  //play music
  document.getElementsByClassName('musicPlayer')[0].play();
};

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

var freezeAndMove = function(element, top, left) {
  //stop dance and move to top, left
  //stop dancer's timer
  clearInterval(element.timer);
  //clear dancer's timer
  element.timer = null;
  //stop dancer's animations
  element.$node.stop(true, true);
  //make sure dancer is shown
  element.$node.show();
  if (arguments.length > 1) {
    //move dancer to position
    element.$node.css({'top': top, 'left': left, 'position': 'absolute'});
  }
};

var returnAllToStage = function() {
  //move all dancers to stage
  dancers.forEach(function(dancer, index) {
    //calculate dancer stage position
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
    //move dancer to stage position
    freezeAndMove(dancer, '77%', `${leftPos}%`);
  });
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
    //stop current animations
    dancer.$node.stop(true, true);
    //move dancer back to start position
    dancer.setPosition(dancer.start[0], dancer.start[1]);
    //restart dancer's timer
    dancer.timer = setTimeout(dancer.step.bind(dancer), dancer.timeBetweenSteps); 
  });
  //toggle toggles off
  settings.linedUpToggle = false;
  settings.canCan.toggle = false;
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

var canCanDance = function() {
  //perform can can dance with all dancers
  switch (settings.canCan.stepCount) {
  case 0:
    //move all dancers 50px left and 50px up
    $('.dancer').animate({'left': '-=50px', 'top': '-=50px'});
    //advance count by one
    settings.canCan.stepCount = 1;
    break;
  case 1:
    //move all dancers 50px right and 50px down
    $('.dancer').animate({'left': '+=50px', 'top': '+=50px'});
    //advance count by one
    settings.canCan.stepCount = 2;
    break;
  case 2:
    //move all dancers 100px left and 100px up
    $('.dancer').animate({'left': '-=100px', 'top': '-=100px'});
    //advance count by one
    settings.canCan.stepCount = 3;
    break;
  case 3:
    //move all dancers 100px right and 100px down
    $('.dancer').animate({'left': '+=100px', 'top': '+=100px'});
    //advance count by one
    settings.canCan.stepCount = 4;
    break;
  case 4:
    //move all dancers 50px right and 50px up
    $('.dancer').animate({'left': '+=50px', 'top': '-=50px'});
    //advance count by one
    settings.canCan.stepCount = 5;
    break;
  case 5:
    //move all dancers 50px left and 50px down
    $('.dancer').animate({'left': '-=50px', 'top': '+=50px'});
    //advance count by one
    settings.canCan.stepCount = 6;
    break;
  case 6:
    //move all dancers 100px right and 100px up
    $('.dancer').animate({'left': '+=100px', 'top': '-=100px'});
    //advance count by one
    settings.canCan.stepCount = 7;
    break;
  case 7:
    //move all dancers 100px left and 50px down
    $('.dancer').animate({'left': '-=100px', 'top': '+=100px'});
    //set count to zero
    settings.canCan.stepCount = 0;
    break;
  }

  //call canCanDance again
  settings.canCan.timer = setTimeout(canCanDance, 350);
};

$('.lineUp').on('click', function() {
  //lineUp button clicked
  //iterate through all dancers
  if (!settings.linedUpToggle) {
    if (settings.canCan.toggle) {
      //if cancan is running stop all cancan
      //stop cancan dance timer
      clearInterval(settings.canCan.timer);
      //reset music back to mario theme song
      playMusic('https://upload.wikimedia.org/wikipedia/en/c/c3/Super_Mario_Bros._theme.ogg');
      //clear cancan settings
      settings.canCan.stepCount = 0;
      settings.canCan.timer = null;
      settings.canCan.toggle = false;
    }
    //return all dancers to stage
    returnAllToStage();
    //set toggle
    settings.linedUpToggle = true;
  } else {
    //reset dancers
    resetAllDancers();
    //set lined up status
    settings.linedUpToggle = false;
  }
});

$('.canCan').on('click', function() {
  //canCan button clicked
  if (!settings.canCan.toggle) {
    //return all dancers to stage
    returnAllToStage();
    //clear lineUp
    settings.linedUpToggle = false;
    //set cancan dance timer
    settings.canCan.timer = setTimeout(canCanDance, 500);
    //play cancan music
    playMusic('https://upload.wikimedia.org/wikipedia/commons/6/63/Offenbach_-_Orpheus_in_the_Underworld_-_Overture%2C_Can_Can_section.ogg');
    //set cancan toggle
    settings.canCan.toggle = true;
  } else {
    //clear cancan dance timer
    clearInterval(settings.canCan.timer);
    //reset all dancers
    resetAllDancers();
    //reset music back to mario theme song
    playMusic('https://upload.wikimedia.org/wikipedia/en/c/c3/Super_Mario_Bros._theme.ogg');
    //clear cancan settings
    settings.canCan.stepCount = 0;
    settings.canCan.timer = null;
    settings.canCan.toggle = false;
  }
});

$('.findPartner').on('click', function() {
  //find partner button clicked
  //iterate through dancers array
  if (!settings.partnerToggle) {
    dancers.forEach(function(dancer) {
      //get random color
      var color = randomColor();
      //get closest dancer
      var closest = findClosest(dancer);
      //set pair of dancers to same random color
      dancer.$node.css({'background-color': `${color}`});
      closest.$node.css({'background-color': `${color}`});
    });
    //set toggle
    settings.partnerToggle = true;
  } else {
    //clear background-color
    dancers.forEach(function(dancer) {
      dancer.$node.css({'background-color': 'transparent'});
    });
    //set toggle
    settings.partnerToggle = false;
  }
});

$('.followMouse').on('click', function() {
  //follow mouse button clicked
  if (!settings.followMouseToggle) {
    //pull first dancer
    var f = dancers[0];
    //freeze first dancer
    freezeAndMove(f, 0, 0);
    //add follower class
    f.$node.addClass('follower');
    //remove mouseover bind
    f.$node.unbind('mouseover');
    settings.followMouseToggle = true;
  } else {
    //pull first dancer
    var f = dancers[0];
    //remove follower class
    f.$node.removeClass('follower');
    //rebind mouseover
    f.$node.mouseover(mouseOver);
    //reset dancers
    resetAllDancers();
    settings.followMouseToggle = false;
  }
});

$('.music').on('click', function() {
  //music button clicked
  if (document.getElementsByClassName('musicPlayer')[0].paused) {
    //play music
    document.getElementsByClassName('musicPlayer')[0].play();
  } else {
    //pause music
    document.getElementsByClassName('musicPlayer')[0].pause();
  }
});

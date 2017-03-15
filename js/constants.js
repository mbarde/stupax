var CONS_SCALE = 3.0; // Defines how big in real WebGL one unit of the game measurement is
var CONS_EPS = 0.2; // Epsilon value used as constant for some fine tuning (use search function)

var CONS_FINISH_CELEB_TIME = 3000; // Time in ms when new level loads after door is reached
var CONS_DEATH_TIME_TO_RESTART = 3000; // Time in ms when level will restart after player death

var CONS_MOV_PLAT_MASS = 2;
var CONS_MOV_PLAT_UPLIFT = 0.15; // uplift of movable platform when no movement button is pressed, needed to fight against gravity

var CONS_BOX_DEFAULT_MASS = 2; // default mass of a box

var CONS_GUY_MASS = 1;
var CONS_GUY_TOLERANCE_VERTICAL_DIVE = 0.1; // Guy can 'dive' this deep into (vertical) walls without toggling direction
var CONS_GUY_TOLERANCE_HORIZONTAL_DIVE = 0.2; // Guy can 'dive' this deep into (horizontal) grounds without toggling direction (or: How high can be a step the player can climb without changing direction?)
var CONS_GUY_STAND_TOGGLE_TIME = 1000; // Time how long guy stands before he changes direction in ms, used to make sure that guy changes direction, even if 'wall-hit-detection' fails

// Restitution defines how "bumpy" the physics is. The higher the bumpier.
var CONS_RESTITUTION_GUY = 0.3;
var CONS_RESTITUTION_PLAT = 0.3;

var CONS_LEVEL_BOTTOM = 0;
var CONS_LEVEL_TOP = 13;

// Editor modes
var CONS_EM_PLATFORM = 0;
var CONS_EM_GUY = 1;
var CONS_EM_MOV_PLAT = 2;
var CONS_EM_FINISH = 3;
var CONS_EM_BOX = 4;
var CONS_EM_EMITTER = 5;

// Guy modes
var CONS_GM_STAND = 0;
var CONS_GM_RUN = 1;
var CONS_GM_JUMP = 2;

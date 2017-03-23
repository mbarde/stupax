var CONS_SCALE = 3.0; // Defines how big in real WebGL one unit of the game measurement is
var CONS_EPS = 0.2; // Epsilon value used as constant for some fine tuning (use search function)

var CONS_LEVEL_LEFT_BOUNDARY = -13; // x coordinate of left boundary of levels

var CONS_FINISH_CELEB_TIME = 3000; // Time in ms when new level loads after door is reached
var CONS_DEATH_TIME_TO_RESTART = 3000; // Time in ms when level will restart after player death

var CONS_MOV_PLAT_MASS = 2;
var CONS_MOV_PLAT_UPLIFT = 0.15; // uplift of movable platform when no movement button is pressed, needed to fight against gravity
var CONS_MOV_PLAT_TOLERANCE_DIVE = 0.1; // Movable platform can 'dive' this deep into blocks before movement is blocked
var CONS_MOV_PLAT_TOLERANCE_CORNER = 0.2; // Movable platform

var CONS_BOX_DEFAULT_MASS = 2; // default mass of a box

var CONS_PROJECTILE_SIZE = 0.2; // size (width and height) of a projectile
var CONS_PROJECTILE_LIFETIME = 15000; // max life time of a projectile in ms

var CONS_GUY_MASS = 1;
var CONS_GUY_TOLERANCE_VERTICAL_DIVE = 0.1; // Guy can 'dive' this deep into (vertical) walls without toggling direction
var CONS_GUY_TOLERANCE_HORIZONTAL_DIVE = 0.2; // Guy can 'dive' this deep into (horizontal) grounds without toggling direction (or: How high can be a step the player can climb without changing direction?)
var CONS_GUY_STAND_TOGGLE_TIME = 1000; // Time how long guy stands before he changes direction in ms, used to make sure that guy changes direction, even if 'wall-hit-detection' fails
var CONS_GUY_MIN_TIME_BETWEEN_DIR_TOGGLES = 1000; // After a direction toggle happend this time has to elapse before another direction toggle is allowed (prevents crazy twitching of guy)

// Restitution defines how "bumpy" the physics is. The higher the bumpier.
var CONS_RESTITUTION_GUY = 0.3;
var CONS_RESTITUTION_PLAT = 0.3;

// defines how much movable platform "pushes" guy to the right or left to avoid that it is possible to glitch guy through level at one vertical(!) side of the movable platform
// this constant does not go in the Oimo Physics Engine, is handled by the game itself
// the higher this value is the more bumpy it looks like when pushing the guy, but the less glitchy it gets :)
var CONS_RESTITUTION_PENALTY_GUY_MOV_PLAT = 8;

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

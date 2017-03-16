requirejs([	"js/constants.js", "js/animatable.js",
	"js/mode.js", "js/game.js", "js/level.js", "js/entity.js", "js/finish.js",
	"js/background.js", "js/levelFactory.js", "js/platform.js",
	"js/movablePlatform.js", "js/box.js", "js/guy.js", "js/projectile.js",
	"js/emitter.js", "js/controls.js", "js/loadingScreen.js"],

function() {

	var canvas = document.getElementById("renderCanvas");
	var engine = new BABYLON.Engine(canvas, true);

	//var loadingScreen = new MyLoadingScreen("I'm loading!!");
	//engine.loadingScreen = loadingScreen;

	var mode;
	var scene;
	var assetsManager;
	var doRender = false;
	var showOverlay = true;
	var controls;
	var camera;

	function hideOverlayAndUnpause() {
		if (!doRender) {
			doRender = true;
		}
		$('.overlay').hide();
		showOverlay = false;
		mode.startRunning();
	}

	function loadLevel(data) {
		mode.loadLevel(data);
		assetsManager.load();
		assetsManager.onFinish = function(tasks) {
			doRender = true;
		};
	}

	function loadLevelFromServer(name) {
		doRender = false;
		jQuery.get("levels/" + name + ".txt", function(data) {
			document.title = "Stupax - " + name;
			loadLevel(data);
		});
	}

	var createScene = function () {
		var myScene = new BABYLON.Scene(engine);

		// Need a free camera for collisions
		camera = new BABYLON.FreeCamera("FreeCamera", new BABYLON.Vector3(0, 0, -50), myScene);
		var q = BABYLON.Quaternion.RotationYawPitchRoll(0, 0.2, 0);
		camera.rotationQuaternion = q;

		myScene.enablePhysics(new BABYLON.Vector3(0, -10, 0), new BABYLON.OimoJSPlugin());

		return myScene;
	}

	scene = createScene();
	assetsManager = new BABYLON.AssetsManager(scene);
	mode = new Game(scene, camera, assetsManager, loadLevel);

	var workWithCookie = false;
	var tmpLevelCookie = getCookie("tempLevel");
	if (tmpLevelCookie.length > 10) {
		workWithCookie = true; // confirm("Found Stupax level in cookies. Do you want to load? Only confirm this if you just started the testing mode from editor.");
	}

	if (workWithCookie) {
		loadLevel(tmpLevelCookie);
	} else {
		var level = "level01";
		var arr = window.location.href.split('?');
		var last = arr.pop();
		if (last.indexOf("level") !== -1) {
			level = last;
		}
		loadLevelFromServer(level);
	}
	// --------------------------------------------------------------------------

	// Setup controls -----------------------------------------------------------
	function onKeyDown(ctrlCode) {
	  if (mode) mode.keyDown(ctrlCode);
	}

	function onKeyUp(ctrlCode) {
	  if (mode) mode.keyUp(ctrlCode);
	}

	controls = new Controls(onKeyDown, onKeyUp);

	window.addEventListener("keydown", function(event){
			if (event.keyCode == 27) {
				if (!showOverlay) {
					showOverlay = true;
					mode.onPause();
					$('.overlay').show();
					doRender = false;
				} else {
					hideOverlayAndUnpause();
				}
			}
			if (!showOverlay && mode) {
				mode.keyDown( controls.keyCodeToCTRLCode(event.keyCode) );
			}
	}, false);

	window.addEventListener("keyup", function(event){
			if (!showOverlay && mode) {
				mode.keyUp( controls.keyCodeToCTRLCode(event.keyCode) );
			}
	}, false);

	$('#btnStart').click( function() {
		hideOverlayAndUnpause();
	});

	window.addEventListener("resize", function () {
		engine.resize();
	});
	// --------------------------------------------------------------------------

	// Render loop --------------------------------------------------------------
	engine.runRenderLoop(function () {
		if (doRender) {
			if (mode) mode.update();
			$('#spanFps').text( Math.round(engine.fps) );
			if (scene) scene.render();
			if (controls) controls.update();
		}
	});
	// --------------------------------------------------------------------------

	function getCookie(cname) {
		var name = cname + "=";
		var decodedCookie = decodeURIComponent(document.cookie);
		var ca = decodedCookie.split(';');
		for(var i = 0; i <ca.length; i++) {
			var c = ca[i];
		  	while (c.charAt(0) == ' ') {
		    	c = c.substring(1);
		  	}
		  	if (c.indexOf(name) == 0) {
		      return c.substring(name.length, c.length);
		  	}
		}
		return "";
	}

});

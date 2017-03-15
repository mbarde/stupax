requirejs([	"js/constants.js", "js/animatable.js", "js/platformMarker.js",
	"js/marker.js", "js/mode.js", "js/editor.js", "js/game.js",
	"js/level.js", "js/entity.js", "js/finish.js",
	"js/background.js", "js/levelFactory.js", "js/platform.js",
	"js/movablePlatform.js", "js/box.js", "js/guy.js", "js/projectile.js",
	"js/emitter.js", "js/controls.js", "js/ControllableGuy.js",
	"js/loadingScreen.js"],

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

	function log(message) {
		$('#spanLog').text("> " + message);
	}

	function loadLevel(name) {
		doRender = false;
		jQuery.get("levels/" + name + ".txt", function(data) {
			document.title = "Stupax - " + name;

			mode.loadLevel(data);

			assetsManager.load();

			assetsManager.onFinish = function(tasks) {
				doRender = true;
			};
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

	// If URL looks like "...?editor" start editor, else start game -------------
	var editor = false;
	var arr = window.location.href.split('?');
	if (arr.length > 2) {
		if (arr[arr.length-2] == "editor") {
			editor = true;
		}
	} else {
		if (arr[arr.length-1] == "editor") {
			 editor = true;
		}
	}

	if (editor) {
		$('#spanLog').show();
		$('.overlay').hide();
		showOverlay = false;
		log("Use 1 - 6 to switch between modes | Press TAB to save");

		scene = createScene();
		assetsManager = new BABYLON.AssetsManager(scene);
		mode = new Editor(scene, camera, log, assetsManager);

		// If URL looks like "...?editor?levelXX" load levelXX
		var last = arr.pop();
		if (last.indexOf("level") !== -1) {
			level = last;
			jQuery.get("levels/" + level + ".txt", function(data) {
				mode.loadLevel(data);
			});
		}

		assetsManager.load();
		assetsManager.onFinish = function(tasks) {
			doRender = true;
		};
	} else {
		scene = createScene();
		assetsManager = new BABYLON.AssetsManager(scene);
		mode = new Game(scene, camera, assetsManager, loadLevel);

		var level = "level01";
		$('#spanFps').show();
		var last = arr.pop();
		if (last.indexOf("level") !== -1) {
			level = last;
		}
		loadLevel(level);
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
			if (!showOverlay && mode) mode.keyDown( controls.keyCodeToCTRLCode(event.keyCode) );
	}, false);

	window.addEventListener("keyup", function(event){
			if (!showOverlay && mode) mode.keyUp( controls.keyCodeToCTRLCode(event.keyCode) );
	}, false);

	$('#btnStart').click( function() {
		$('.overlay').hide();
		showOverlay = false;
		mode.startRunning();
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

});

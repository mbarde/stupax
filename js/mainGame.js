requirejs([
	"plugins/hand.minified-1.2.js", "plugins/oimo.js", "plugins/babylon.custom.js",
	"js/entity.js",  "js/mode.js", "js/constants.js", "js/animatable.js", "js/resourceHandler.js",
	"js/backgroundMusic.js", "js/countdown.js",
	"js/platform.js", "js/collisionHelper.js", "js/game.js",
	"js/level.js", "js/finish.js", "js/levelFileLoader.js", "js/background.js",
	"js/movablePlatform.js", "js/box.js", "js/guy.js",
	"js/projectile.js", "js/emitter.js", "js/controls.js", "js/loadingScreen.js",
	"js/levelFactory.js", "js/menuManager.js"],

function() {

	var game;
	var scene;
	var resourceHandler;
	var countOfAllAssetsManagerTasks = 0;
	var openAssetsManagerTaskNames = [];

	var doRender = false;
	var showOverlay = true;

	var controls;
	var camera;

	function activateRendering() {
		doRender = true;
	}

	function hideOverlayAndUnpause() {
		menuManager.hideMenuOverlay();
		showOverlay = false;
		doRender = true;
		game.onResume();
	}

	function showOverlayAndPause() {
		menuManager.showMenuOverlay();
		showOverlay = true;
		doRender = false;
		game.onPause();
	}

	var createScene = function () {
		var myScene = new BABYLON.Scene(engine);

		camera = new BABYLON.FreeCamera("FreeCamera", new BABYLON.Vector3(0, 0, -50), myScene);
		var q = BABYLON.Quaternion.RotationYawPitchRoll(0, 0.2, 0);
		camera.rotationQuaternion = q;

		myScene.enablePhysics(new BABYLON.Vector3(0, -10, 0), new BABYLON.OimoJSPlugin());

		return myScene;
	}

	var menuManager = new MenuManager( $('#divMenuOverlay'), hideOverlayAndUnpause, activateRendering );

	var canvas = document.getElementById("renderCanvas");
	var engine = new BABYLON.Engine(canvas, true);

	//var loadingScreen = new MyLoadingScreen("che mf im loading");
	//engine.loadingScreen = loadingScreen;

	scene = createScene();
	var assetsManager = new BABYLON.AssetsManager(scene);
	resourceHandler = new ResourceHandler(scene, assetsManager);
	assetsManager.onFinish = function(tasks) {
		var workWithCookie = false;
		var tmpLevelCookie = getCookie("tempLevel");
		if (tmpLevelCookie.length > 10) {
			workWithCookie = true;
		}

		if (workWithCookie) {
			game = new Game(scene, camera, resourceHandler, []);
			game.loadLevelFromString(tmpLevelCookie);
			hideOverlayAndUnpause();
		} else {
			var levelFileLoader = new LevelFileLoader();
			levelFileLoader.loadLevelFilesIntoArray(
				function(arrLevelStrings) {
					game = new Game(scene, camera, resourceHandler, arrLevelStrings);
					game.loadFirstLevel();
					doRender = true;

					menuManager.setGame( game );
					menuManager.loadMenuMain();
				}
			);
		}

	};
	assetsManager.onTaskSuccess = function(task) {
		var index = openAssetsManagerTaskNames.indexOf( task.url );
		openAssetsManagerTaskNames.splice(index, 1);

		var openTasksString = "";
		for (var i = 0; i < openAssetsManagerTaskNames.length; i++) {
			openTasksString = openTasksString + "<br>" + openAssetsManagerTaskNames[i];
		}

		$('#spanFps').html("Loading (" + Math.round((1 - (assetsManager.waitingTasksCount / countOfAllAssetsManagerTasks)) * 100) + "%):" + openTasksString);
	}
	assetsManager.load();

	countOfAllAssetsManagerTasks = assetsManager.waitingTasksCount;
	openAssetsManagerTaskNames = new Array();
	for (var i = 0; i < assetsManager.tasks.length; i++) {
		openAssetsManagerTaskNames.push( assetsManager.tasks[i].url );
	}

	engine.runRenderLoop(function () {
		if (doRender) {
			if (game) game.update();
			$('#spanFps').text( Math.round(engine.fps) );
			if (scene) scene.render();
			if (controls) controls.update();
		}
	});

	// Setup controls -----------------------------------------------------------
	function onKeyDown(ctrlCode) {
	  if (game) game.keyDown(ctrlCode);
	}

	function onKeyUp(ctrlCode) {
	  if (game) game.keyUp(ctrlCode);
	}

	controls = new Controls(onKeyDown, onKeyUp);

	window.addEventListener("keydown", function(event){
			if (game && event.keyCode == 27) { // ESC
				if (!showOverlay) {
					showOverlayAndPause();
				} else {
					hideOverlayAndUnpause();
				}
			}
			if (!showOverlay && game) {
				game.keyDown( controls.keyCodeToCTRLCode(event.keyCode) );
			}
	}, false);

	window.addEventListener("keyup", function(event){
			if (!showOverlay && game) {
				game.keyUp( controls.keyCodeToCTRLCode(event.keyCode) );
			}
	}, false);

	$('#btnStart').click( function() {
		hideOverlayAndUnpause();
	});

	window.addEventListener("resize", function () {
		engine.resize();
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

requirejs([	"js/constants.js", "js/platformMarker.js",
	"js/marker.js", "js/mode.js", "js/editor.js",
	"js/controls.js", "js/loadingScreen.js"],

function() {

	var canvas = document.getElementById("renderCanvas");
	var engine = new BABYLON.Engine(canvas, true);

	//var loadingScreen = new MyLoadingScreen("I'm loading!!");
	//engine.loadingScreen = loadingScreen;

	var mode;
	var scene;
	var assetsManager;
	var doRender = false;
	var controls;
	var camera;

	function log(message) {
		$('#spanLog').text("> " + message);
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

	log("Use 1 - 6 to switch between modes | Press TAB to save | Press L to load file | Press T to test level");

	scene = createScene();
	assetsManager = new BABYLON.AssetsManager(scene);
	mode = new Editor(scene, camera, log, assetsManager);

	assetsManager.load();
	assetsManager.onFinish = function(tasks) {
		doRender = true;
	};
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
			if (event.keyCode == 76) {
				loadLevelFile();
			}
			if (event.keyCode == 84) {
				var lvlStr = mode.levelToString(false);
				if (lvlStr) {
					document.cookie="tempLevel=" + lvlStr;
					window.open("/stupax",'_blank');
				}
			}
			if (mode) {
				mode.keyDown( controls.keyCodeToCTRLCode(event.keyCode) );
			}
	}, false);

	window.addEventListener("keyup", function(event){
			if (mode) {
				mode.keyUp( controls.keyCodeToCTRLCode(event.keyCode) );
			}
	}, false);

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

	// Loading ------------------------------------------------------------------
	function loadLevelFile() {
	  	if ('FileReader' in window) {
	   	$('#inputFile').click();
	  	} else {
	   	alert('Your browser does not support the HTML5 FileReader.');
	  }
	};

	document.getElementById('inputFile').onchange = function(event) {
	  	var fileToLoad = event.target.files[0];

	  	if (fileToLoad) {
		   var reader = new FileReader();
		   reader.onload = function(fileLoadedEvent) {
		   	var textFromFileLoaded = fileLoadedEvent.target.result;
		      mode.loadLevel(textFromFileLoaded);
		   };
	   	reader.readAsText(fileToLoad, 'UTF-8');
	  	}
	};

}); // requireJS

requirejs([	"js/constants.js", "js/platformMarker.js",
	"js/marker.js", "js/mode.js", "js/editor.js",
	"js/controls.js", "js/loadingScreen.js"],

function() {

	var canvas = document.getElementById("renderCanvas");
	var engine = new BABYLON.Engine(canvas, true);

	//var loadingScreen = new MyLoadingScreen("I'm loading!!");
	//engine.loadingScreen = loadingScreen;

	var editor;
	var scene;
	var assetsManager;
	var doRender = false;
	var controls;
	var camera;

	function showContextMenu(name, contextData) {
		jQuery.get("partials/context." + name + ".html", function(data) {
			$('#div-context-menu').html( data );
			$('#div-context-menu').show();

			if (name === "emitter") {
				$('#input-interval').val( contextData.interval );
				$('#input-interval').change( function() { contextData.interval = $(this).val(); });

				$('#input-offset').val( contextData.offset );
				$('#input-offset').change( function() { contextData.offset = $(this).val(); });

				$('#input-directions').val( JSON.stringify(contextData.directions) );
				$('#input-directions').change( function() {
					try {
						contextData.directions = JSON.parse( $(this).val());
					} catch(e) {
						alert('Directions string has wrong format!');
					}
				});

				$('#button-delete-emitter').click( function() { contextData.mesh.dispose(); });
			}
		});
	}

	function hideContextMenu() {
		$('#div-context-menu').hide();
	}

	function log(message) {
		updateActiveModeBtn();
		$('#spanLog').text("> " + message);
	}

	function startLevelTest() {
		var lvlStr = editor.levelToString(false);
		if (lvlStr) {
			document.cookie="tempLevel=" + lvlStr;
			window.open("/stupax/index.html",'_blank');
		}
	}

	function updateActiveModeBtn() {
		if (editor)  {
			$('.btn-mode').removeClass('active');
			var curMode = editor._curMode;
			$('.btn-mode[mode=' + curMode + ']').addClass('active');
		}
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
	editor = new Editor(scene, camera, log, showContextMenu, hideContextMenu, assetsManager);

	assetsManager.load();
	assetsManager.onFinish = function(tasks) {
		doRender = true;
	};
	// --------------------------------------------------------------------------

	// Setup controls -----------------------------------------------------------
	function onKeyDown(ctrlCode) {
	  if (editor) editor.keyDown(ctrlCode);
	}

	function onKeyUp(ctrlCode) {
	  if (editor) editor.keyUp(ctrlCode);
	}

	controls = new Controls(onKeyDown, onKeyUp);

	window.addEventListener("keydown", function(event){
		var focused = $(':focus');
		if (!focused.hasClass("input-element")) {
			if (event.keyCode == 76) { // L
				loadLevelFile();
			}
			if (event.keyCode == 84) { // T
				startLevelTest();
			}
			if (editor) {
				editor.keyDown( controls.keyCodeToCTRLCode(event.keyCode) );
			}
		}
	}, false);

	window.addEventListener("keyup", function(event){
		var focused = $(':focus');
		if (!focused.hasClass("input-element")) {
			if (editor) {
				editor.keyUp( controls.keyCodeToCTRLCode(event.keyCode) );
			}
		}
	}, false);

	window.addEventListener("resize", function () {
		engine.resize();
	});
	// --------------------------------------------------------------------------

	// Render loop --------------------------------------------------------------
	engine.runRenderLoop(function () {
		if (doRender) {
			if (editor) editor.update();
			$('#spanFps').text( Math.round(engine.fps) );
			if (scene) scene.render();
			if (controls) controls.update();
		}
	});
	// --------------------------------------------------------------------------

	// Buttons ------------------------------------------------------------------
	$('.btn-mode').click( function() {
		editor.setCurMode( parseInt($(this).attr('mode')) );
	});

	$('#btn-load').click( loadLevelFile );
	$('#btn-save').click( function() { editor.saveLevelToFile(); } );
	$('#btn-clear').click( function() { if (confirm("All changes will be lost!")) { editor.clearAll(); } } );
	$('#btn-test').click( startLevelTest );
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
		      editor.loadLevel(textFromFileLoaded);
		   };
	   	reader.readAsText(fileToLoad, 'UTF-8');
	  	}
	};
	// --------------------------------------------------------------------------

}); // requireJS

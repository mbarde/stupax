requirejs([
	"plugins/hand.minified-1.2.js", "plugins/oimo.js", "plugins/babylon.custom.js",
	"js/constants.js", "js/platformMarker.js",
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

	function isPointerBlocked() {
		return $('.overlay').is(':visible');
	}

	function log(message) {
		updateActiveModeBtn();
		$('#spanLog').text("> " + message);
	}

	function startLevelTest() {
		var lvlStr = editor.levelToString(false);
		if (lvlStr) {
			document.cookie="tempLevel=" + lvlStr;
			window.open("index.html",'_blank');
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
	editor = new Editor(scene, camera, log, showContextMenu, hideContextMenu, isPointerBlocked, assetsManager);

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

	window.addEventListener("keydown", function(event) {
		if ( $('.overlay').is(':visible') ) {
			if (event.keyCode == 27) $('.overlay').hide();
		} else {
			var focused = $(':focus');
			if (!focused.hasClass("input-element")) {
				if (event.keyCode == 76) { // L
					loadLocalLevelFile();
				}
				if (event.keyCode == 84) { // T
					startLevelTest();
				}
				if (editor) {
					editor.keyDown( controls.keyCodeToCTRLCode(event.keyCode) );
				}
			}
		}
	}, false);

	window.addEventListener("keyup", function(event) {
		if ( !$('.overlay').is(':visible') ) {
			var focused = $(':focus');
			if (!focused.hasClass("input-element")) {
				if (editor) {
					editor.keyUp( controls.keyCodeToCTRLCode(event.keyCode) );
				}
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
	$('button').click( function() {
		if ( $(this).attr('id') != 'btn-publish') $('.overlay').hide();
	});

	$('.btn-mode').click( function() {
		editor.setCurMode( parseInt($(this).attr('mode')) );
	});

	$('#btn-load').click( function() {
		$('.overlay').hide();
		$('#div-level-select').html('');

		$.get('http://localhost:3000/levels/read', function(levels) {
			$.get('partials/menu.levels.item.html', function(template) {
				// clear list
				var list = $( document.createElement('ul') );

				// populate list
				for (var i = 0; i < levels.length; i++) {
					var level = levels[i];
					list.append(
						template.replace('$$id$$', 		level.id)
								  .replace('$$title$$', 	level.title)
								  .replace('$$author$$', 	level.author)
  								  .replace('$$date$$', 		new Date(level.timestamp * 1000).toLocaleDateString())
				 	);
				}

				$('#div-level-select').append(list);
				$('#div-level-select').show();
			});
		});
	});

	$('#div-level-select').delegate('li', 'click', function() {
		loadLevel( $(this).attr('level-id') );
	});

	$('#btn-download').click( function() {
		editor.saveLevelToFile();
	});

	$('#btn-upload').click( loadLocalLevelFile );

	$('#btn-show-publish-div').click( function() {
		if (editor.levelToString()) {
			$('.overlay').hide();
			$('#div-publish').show();
		}
	});

	$('#btn-publish').click( function() {
		$('#div-publish #inTitle').removeClass('error');
		$('#div-publish #inAuthor').removeClass('error');

		var title = $('#div-publish #inTitle').val();
		var author = $('#div-publish #inAuthor').val();

		var inputMissing = false;
		if (!title) {
			$('#div-publish #inTitle').addClass('error');
			inputMissing = true;
		}
		if (!author) {
			$('#div-publish #inAuthor').addClass('error');
			inputMissing = true;
		}
		if (inputMissing) return;

		var level = {};
		level.title = title;
		level.author = author;

		var date = new Date();
		level.timestamp = date.valueOf()/1000;
		level.content = editor.levelToString();

		var data = {};
		data.level = level;
		$.ajax({	url: 'http://localhost:3000/levels/create',
					type: 'POST',
					data: JSON.stringify(data),
					contentType: "application/json; charset=utf-8",
					dataType: "json" });

		$('#div-publish').hide();
	});

	$('#btn-clear').click( function() { if (confirm("All changes will be lost!")) { editor.clearAll(); } } );

	$('#btn-test').click( startLevelTest );
	// --------------------------------------------------------------------------

	// Loading ------------------------------------------------------------------
	function loadLocalLevelFile() {
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

	function loadLevel(id) {
		$.get('http://localhost:3000/levels/read/' + id, function(level) {
			editor.loadLevel(level[0].content);
			$('#div-level-select').hide();
		});
	}
	// --------------------------------------------------------------------------

}); // requireJS

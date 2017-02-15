class Editor extends Mode {

	constructor(scene, camera, log_function, assetsManager) {
		super(scene, camera);

		this._log_function = log_function;
		this._assetsManager = assetsManager;

		this._levelWidth = 500;
		this._levelHeight = 20;

		this._keysLeft = [CTRL_LEFT, 65, 37];
		this._keysRight = [CTRL_RIGHT, 68, 39];
		this._keysUp = [CTRL_UP, 87, 38];
		this._keysDown = [CTRL_DOWN, 83, 40];

		this._camera.position.x = 10 * CONS_SCALE;
		this._camera.position.y = 10 * CONS_SCALE;

		this._curMode = CONS_EM_PLATFORM;

		this._guyMarker = false;
		this._finishMarker = false;

		this.initBackground();
	}

	initBackground() {
		var material = new BABYLON.StandardMaterial("Mat", this._scene);

		var textureTask = this._assetsManager.addTextureTask("image task", "textures/block01.png");
		(function(levelWidth, levelHeight, material) {
			textureTask.onSuccess = function(task) {
				material.diffuseTexture = task.texture;
				material.backFaceCulling = true;
				material.diffuseTexture.uScale = (levelWidth + 9 * CONS_SCALE)
				material.diffuseTexture.uOffset = 0.5;
				material.diffuseTexture.vScale = (levelHeight);
			}
		}) (this._levelWidth, this._levelHeight, material);

		// Background marks area of level
		var background = BABYLON.MeshBuilder.CreatePlane("plane", {width: (this._levelWidth + 9 * CONS_SCALE) * CONS_SCALE, height: (this._levelHeight * CONS_SCALE)}, this._scene);
		background.material = material;
		background.position.x = (this._levelWidth * CONS_SCALE) / 2;
		background.position.y = (this._levelHeight * CONS_SCALE) / 2 - 4 * CONS_SCALE;
		background.position.z = CONS_SCALE/2;
		background.receiveShadows = false;

		var light0 = new BABYLON.HemisphericLight("Hemi0", new BABYLON.Vector3(0, 1000, -1000), this._scene);
		light0.diffuse = new BABYLON.Color3(1, 1, 1);
		light0.specular = new BABYLON.Color3(1, 1, 1);
		light0.groundColor = new BABYLON.Color3(0, 0, 0);

		this._scene.editor = this;
		this._scene.onPointerDown = function (evt, pickResult) {
        	if (pickResult.hit) {
				if (pickResult.pickedMesh == background) {
					var posX = Math.floor(pickResult.pickedPoint.x / CONS_SCALE);
					var posY = Math.floor(pickResult.pickedPoint.y / CONS_SCALE);

					var marker = new Marker(posX, posY, this.editor._curMode, this);
					if (this.editor._curMode == CONS_EM_EMITTER) {
						marker.emitter_info = {};
						marker.emitter_info.directions = new Array();
					  	marker.emitter_info.directions.push( new BABYLON.Vector3(0.1, 0.0, 0) );
					  	marker.emitter_info.interval = 2000;
					  	marker.emitter_info.offset = 0;
					} else
					if (this.editor._curMode == CONS_EM_GUY) {
						if (this.editor._guyMarker) {
							this.editor._guyMarker._mesh.dispose();
						}
						this.editor._guyMarker = marker;
					} else
					if (this.editor._curMode == CONS_EM_FINISH) {
						if (this.editor._finishMarker) {
							this.editor._finishMarker._mesh.dispose();
						}
						this.editor._finishMarker = marker;
					}
				} else {
					if (pickResult.pickedMesh.mode == this.editor._curMode) {
						pickResult.pickedMesh.dispose();
						if (this.editor._curMode == CONS_EM_GUY) {
							this.editor._guyMarker = false;
						} else
						if (this.editor._curMode == CONS_EM_FINISH) {
							this.editor._finishMarker = false;
						}
					}
				}
        	}
    	};
	}

	setCurMode(newMode) {
		this._curMode = newMode;
		log("Changed to " + this.modeIDtoName(newMode));
	}

	update() {
	}

	keyDown(ctrlCode) {
		if ( this._keysLeft.indexOf(ctrlCode) != -1 ) {
			this._camera.position.x -= 10;
		}
		if ( this._keysRight.indexOf(ctrlCode) != -1 ) {
			this._camera.position.x += 10;
		}
		if ( this._keysDown.indexOf(ctrlCode) != -1 ) {
			this._camera.position.y -= 10;
		}
		if ( this._keysUp.indexOf(ctrlCode) != -1 ) {
			this._camera.position.y += 10;
		}

		if (ctrlCode == 49) {
			this.setCurMode(CONS_EM_PLATFORM);
		} else
		if (ctrlCode == 50) {
			this.setCurMode(CONS_EM_GUY);
		} else
		if (ctrlCode == 51) {
			this.setCurMode(CONS_EM_MOV_PLAT);
		}
		if (ctrlCode == 52) {
			this.setCurMode(CONS_EM_FINISH);
		}
		if (ctrlCode == 53) {
			this.setCurMode(CONS_EM_BOX);
		}
		if (ctrlCode == 54) {
			this.setCurMode(CONS_EM_EMITTER);
		}
		if (ctrlCode == 9) {
			this.saveLevel();
		}
	}

	keyUp(keyCode) {
	}

	saveLevel() {
		var level = {};

		if (!this._guyMarker) {
			alert("No guy marker!");
			return;
		}
		level.guy = {};
		level.guy._posX = this._guyMarker._posX;
		level.guy._posY = this._guyMarker._posY;

		if (!this._finishMarker) {
			alert("No guy marker!");
			return;
		}
		level.finish = {};
		level.finish._posX = this._finishMarker._posX;
		level.finish._posY = this._finishMarker._posY;
		var target = prompt("Please enter target", "level01");
		level.finish.target = target;

		var pms = new Array(); // platform markers
		var movPms = new Array(); // movable platform markers
		var boxMs = new Array(); // box markers
		var emMs = new Array(); // emitter markers
		var h = 0;
		console.log("Collecting markers ...");
		console.log(this._scene.meshes.length);
		for (var h = 0; h < this._scene.meshes.length; h++) {
			if (this._scene.meshes[h].mode == CONS_EM_PLATFORM) {
				var m = this._scene.meshes[h].marker;
				pms.push( new PlatformMarker(m._posX, m._posY, 1, 1) );
			} else if (this._scene.meshes[h].mode == CONS_EM_MOV_PLAT) {
				var m = this._scene.meshes[h].marker;
				movPms.push( new PlatformMarker(m._posX, m._posY, 1, 1) );
			} else if (this._scene.meshes[h].mode == CONS_EM_BOX) {
				var m = this._scene.meshes[h].marker;
				boxMs.push( new PlatformMarker(m._posX, m._posY, 1, 1) );
			} else if (this._scene.meshes[h].mode == CONS_EM_EMITTER) {
				var m = this._scene.meshes[h].marker;
				var em = new PlatformMarker(m._posX, m._posY, 1, 1);
				em.directions = m.emitter_info.directions;
				em.interval = m.emitter_info.interval;
				em.offset = m.emitter_info.offset;
				emMs.push( em );
			}
		}
		level.emitters = emMs;

		level.platforms = this.mergeMarkers(pms);

		movPms = this.mergeMarkers(movPms);
		if (movPms.length < 1) {
			alert("No movable platform!");
			return;
		}
		if (movPms.length > 1) {
			alert("Multiple movable platforms detected! Only one of them will be saved!");
		}
		level.movPlatform = movPms[0];

		level.boxes = this.mergeMarkers(boxMs);

		var blob = new Blob([JSON.stringify(level)], {type: "text/plain;charset=utf-8"});
		saveAs(blob, "level.txt");
	}

	/**
	* Merge markers to maximal rectangles to create as less platforms as possible.
	**/
	mergeMarkers(platformMarkers) {
		var pms = platformMarkers;

		console.log("Merge platform markers ...");
		var i = 0;
		var j = 0;
		var merged = false;
		do {
			i = 0;
			merged = false;
			while (i < pms.length) {
				j = 0;
				while (j < pms.length) {
					if (pms[i] && i != j) {
						if (pms[i].tryMerge(pms[j])) {
							merged = true;
							pms.splice(j, 1);
						} else {
							j++;
						}
					} else {
						j++;
					}
				}
				i++;
			}
		} while (merged);

		return pms;
	}

	loadLevel(level) {
		var lvl = JSON.parse(level);
		this._guyMarker = new Marker(lvl.guy._posX, lvl.guy._posY, CONS_EM_GUY, this._scene);
		this._finishMarker = new Marker(lvl.finish._posX, lvl.finish._posY, CONS_EM_FINISH, this._scene);

		if (lvl.emitters) {
			var emitters = lvl.emitters;
			for (var i = 0; i < emitters.length; i++) {
				var marker = new Marker(emitters[i]._posX, emitters[i]._posY, CONS_EM_EMITTER, this._scene);
				marker.emitter_info = {};
				marker.emitter_info.directions = emitters[i].directions;
				marker.emitter_info.interval = emitters[i].interval;
				marker.emitter_info.offset = emitters[i].offset;
			}
		}

		var movPlat = lvl.movPlatform;
		for (var x = 0; x < movPlat._width; x++) {
			for (var y = 0; y < movPlat._height; y++) {
				var marker = new Marker(movPlat._posX + x, movPlat._posY + y, CONS_EM_MOV_PLAT, this._scene);
			}
		}

		var platforms = lvl.platforms;
		for (var i = 0; i < platforms.length; i++) {
			var plat = platforms[i];
			for (var x = 0; x < plat._width; x++) {
				for (var y = 0; y < plat._height; y++) {
					var marker = new Marker(plat._posX + x, plat._posY + y, CONS_EM_PLATFORM, this._scene);
				}
			}
		}

		if (lvl.boxes) {
			var boxes = lvl.boxes;
			for (var i = 0; i < boxes.length; i++) {
				var box = boxes[i];
				for (var x = 0; x < box._width; x++) {
					for (var y = 0; y < box._height; y++) {
						var marker = new Marker(box._posX + x, box._posY + y, CONS_EM_BOX, this._scene);
					}
				}
			}
		}
	}

	modeIDtoName(modeID) {
		var name = "Unkown";
		switch (modeID) {
			case CONS_EM_PLATFORM:
				name = "Platform mode";
				break;
			case CONS_EM_GUY:
				name = "Guy spawn mode";
				break;
			case CONS_EM_MOV_PLAT:
				name = "Movable platform mode";
				break;
			case CONS_EM_FINISH:
				name = "Finish mode";
				break;
			case CONS_EM_BOX:
				name = "Box mode";
				break;
			case CONS_EM_EMITTER:
				name = "Emitter mode";
				break;
		}
		return name;
	}

}

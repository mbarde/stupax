class Editor extends Mode {

	constructor(scene, camera) {
		super(scene, camera);

		this._keysLeft = [65, 37];
		this._keysRight = [68, 39];
		this._keysUp = [87, 38];
		this._keysDown = [83, 40];

		this._levelWidth = 500;
		this._levelHeight = 20;

		this._camera.position.x = 10 * CONS_SCALE;
		this._camera.position.y = 10 * CONS_SCALE;

		this._curMode = CONS_EM_PLATFORM;

		this._guyMarker = false;

		this.initBackground();
	}

	initBackground() {
		var material = new BABYLON.StandardMaterial("Mat", this._scene);
		material.diffuseTexture = new BABYLON.Texture("textures/cartoon_wooden_crate.jpg", this._scene);
		material.backFaceCulling = false;
		material.diffuseTexture.uScale = (this._levelWidth)
		material.diffuseTexture.vScale = (this._levelHeight)

		// Background marks area of level
		var background = BABYLON.MeshBuilder.CreatePlane("plane", {width: (this._levelWidth * CONS_SCALE), height: (this._levelHeight * CONS_SCALE)}, this._scene);
		background.material = material;
		background.position.x = (this._levelWidth * CONS_SCALE) / 2;
		background.position.y = (this._levelHeight * CONS_SCALE) / 2;
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
					if (this.editor._curMode == CONS_EM_GUY) {
						if (this.editor._guyMarker) {
							this.editor._guyMarker._mesh.dispose();
						}
						this.editor._guyMarker = marker;
					}
				} else {
					if (pickResult.pickedMesh.mode == this.editor._curMode) {
						pickResult.pickedMesh.dispose();
						if (this.editor._curMode == CONS_EM_GUY) {
							this.editor._guyMarker = false;
						}
					}
				}
        	}
    	};
	}

	setCurMode(newMode) {
		this._curMode = newMode;
		console.log("Current mode is now: " + newMode);
	}

	update() {
	}

	keyDown(keyCode) {
		if ( this._keysLeft.indexOf(keyCode) != -1 ) {
			this._camera.position.x -= 10;
		}
		if ( this._keysRight.indexOf(keyCode) != -1 ) {
			this._camera.position.x += 10;
		}
		if ( this._keysDown.indexOf(keyCode) != -1 ) {
			this._camera.position.y -= 10;
		}
		if ( this._keysUp.indexOf(keyCode) != -1 ) {
			this._camera.position.y += 10;
		}

		if (keyCode == 49) {
			this.setCurMode(CONS_EM_PLATFORM);
		} else
		if (keyCode == 50) {
			this.setCurMode(CONS_EM_GUY);
		} else
		if (keyCode == 51) {
			this.setCurMode(CONS_EM_MOV_PLAT);
		}
	}

	keyUp(keyCode) {
	}

}
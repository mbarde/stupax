class Editor extends Mode {

	constructor(scene, camera) {
		super(scene, camera);

		this.initBackground();

		this._keysLeft = [65, 37];
		this._keysRight = [68, 39];
		this._keysUp = [87, 38];
		this._keysDown = [83, 40];
	}

	initBackground() {
		var material = new BABYLON.StandardMaterial("Mat", this._scene);
		material.diffuseTexture = new BABYLON.Texture("textures/cartoon_wooden_crate.jpg", this._scene);
		material.backFaceCulling = false;
		material.diffuseTexture.uScale = 30.0;
		material.diffuseTexture.vScale = 30.0;

		var background = BABYLON.MeshBuilder.CreatePlane("plane", {width: 500.0, height: 500.0}, this._scene);
		background.material = material;
		background.position.z = CONS_SCALE/2;
		background.receiveShadows = true;

		var light0 = new BABYLON.DirectionalLight("Dir0", new BABYLON.Vector3(0, 0, 1), this._scene);
		light0.diffuse = new BABYLON.Color3(1, 1, 1);
		light0.specular = new BABYLON.Color3(1, 1, 1);
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
	}

	keyUp(keyCode) {
	}

}

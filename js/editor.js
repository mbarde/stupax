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
		background.receiveShadows = false;

		var light0 = new BABYLON.HemisphericLight("Hemi0", new BABYLON.Vector3(0, 1000, -1000), this._scene);
		light0.diffuse = new BABYLON.Color3(1, 1, 1);
		light0.specular = new BABYLON.Color3(1, 1, 1);
		light0.groundColor = new BABYLON.Color3(0, 0, 0);

		//When pointer down event is raised
		this._scene.onPointerDown = function (evt, pickResult) {
      	// if the click hits the ground object, we change the impact position
			console.log(pickResult.hit && pickResult.pickedMesh == background);
        	if (pickResult.hit) {
         	console.log(pickResult.pickedPoint.x + " | " + pickResult.pickedPoint.y);
				var clr = {r: 1.0, g: 0.0, b: 0.0};
				var marker = new Marker(pickResult.pickedPoint.x, pickResult.pickedPoint.y, clr, this);
        	}
    	};
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

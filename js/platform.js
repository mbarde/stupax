class Platform extends Entity {

	constructor(width, height, posX, posY, guy, scene) {
		super(width, height, 1, scene);

		this.initGeometry(posX, posY);
		this.initPhysics(guy);
	}

	initGeometry(posX, posY) {
		this._mesh = BABYLON.MeshBuilder.CreateBox("platform", {height: this._height * CONS_SCALE, width: this._width * CONS_SCALE, depth: CONS_SCALE}, this._scene);
		/**var material = new BABYLON.StandardMaterial("ground", this._scene);
		material.diffuseColor = new BABYLON.Color3(this._color.r, this._color.g, this._color.b);
		material.specularColor = new BABYLON.Color3(this._color.r, this._color.g, this._color.b);
		material.emissiveColor = new BABYLON.Color3(this._color.r, this._color.g, this._color.b);**/

		var material = new BABYLON.StandardMaterial("Mat", this._scene);
		var texture = ""; // = new BABYLON.Texture("textures/cartoon_wooden_crate_03.jpg", this._scene);
		if (this.constructor.name == "MovablePlatform") {
			texture = "textures/cartoon_wooden_crate_03.jpg";
			//material.alpha = 0.8;
		} else {
			texture = "textures/cartoon_wooden_crate_02.jpg";
		}

		// MATERIAL -----------------------------------------------------------
		//Define a material
		var FrontMaterial = new BABYLON.StandardMaterial("cubeFront", this._scene);
		FrontMaterial.diffuseTexture = new BABYLON.Texture(texture, this._scene);
		FrontMaterial.diffuseTexture.uScale = this._width;
		FrontMaterial.diffuseTexture.vScale = this._height;

		var BackMaterial = new BABYLON.StandardMaterial("cubeBack", this._scene);
		BackMaterial.diffuseTexture = new BABYLON.Texture(texture, this._scene);
		BackMaterial.diffuseTexture.uScale = this._width;
		BackMaterial.diffuseTexture.vScale = this._height;

		var LeftMaterial = new BABYLON.StandardMaterial("cubeLeft", this._scene);
		LeftMaterial.diffuseTexture = new BABYLON.Texture(texture, this._scene);
		LeftMaterial.diffuseTexture.uScale = this._height;
		LeftMaterial.diffuseTexture.vScale = this._depth;

		var RightMaterial = new BABYLON.StandardMaterial("cubeRight", this._scene);
		RightMaterial.diffuseTexture = new BABYLON.Texture(texture, this._scene);
		RightMaterial.diffuseTexture.uScale = this._height;
		RightMaterial.diffuseTexture.vScale = this._depth;

		var TopMaterial = new BABYLON.StandardMaterial("cubeTop", this._scene);
		TopMaterial.diffuseTexture = new BABYLON.Texture(texture, this._scene);
		TopMaterial.diffuseTexture.uScale = this._depth;
		TopMaterial.diffuseTexture.vScale = this._width;

		var BottomMaterial = new BABYLON.StandardMaterial("cubeBottom", this._scene);
		BottomMaterial.diffuseTexture = new BABYLON.Texture(texture, this._scene);
		BottomMaterial.diffuseTexture.uScale = this._depth;
		BottomMaterial.diffuseTexture.vScale = this._width;

		var cubeMultiMat = new BABYLON.MultiMaterial("cubeMulti", this._scene);
		cubeMultiMat.subMaterials.push(BackMaterial);
		cubeMultiMat.subMaterials.push(FrontMaterial);
		cubeMultiMat.subMaterials.push(RightMaterial);
		cubeMultiMat.subMaterials.push(LeftMaterial);
		cubeMultiMat.subMaterials.push(TopMaterial);
		cubeMultiMat.subMaterials.push(BottomMaterial);

		this._mesh.subMeshes = [];
		this._mesh.subMeshes.push(new BABYLON.SubMesh(0, 0,  4,  0, 6, this._mesh));
		this._mesh.subMeshes.push(new BABYLON.SubMesh(1, 4,  4,  6, 6, this._mesh));
		this._mesh.subMeshes.push(new BABYLON.SubMesh(2, 8,  4, 12, 6, this._mesh));
		this._mesh.subMeshes.push(new BABYLON.SubMesh(3, 12, 4, 18, 6, this._mesh));
		this._mesh.subMeshes.push(new BABYLON.SubMesh(4, 16, 4, 24, 6, this._mesh));
		this._mesh.subMeshes.push(new BABYLON.SubMesh(5, 20, 4, 30, 6, this._mesh));

		this._mesh.material = cubeMultiMat;
		// --------------------------------------------------------------------

		this._mesh.position.x = (posX + this._width/2) * CONS_SCALE;
		this._mesh.position.y = (posY + this._height/2) * CONS_SCALE;
		this._mesh.position.z = 0;
	}

	initPhysics(guy) {
		var platform = this._mesh;
		platform.setPhysicsState(BABYLON.PhysicsEngine.BoxImpostor, { mass: 0, restitution: 0.001, move: this.constructor.name == "MovablePlatform" });
		var impostor = platform.getPhysicsImpostor();

		// What happens we the guy hits this platform?
		// If he hits a "wall" he changes direction.
		impostor.registerOnPhysicsCollide(guy._mesh.getPhysicsImpostor(), function(main, collided) {
			 var ray = new BABYLON.Ray(guy._mesh.position, platform.position.subtract(guy._mesh.position));
          var pickInfo = scene.pickWithRay(ray, function (item) { return item == platform });

			 var hit = false;
          if (pickInfo.hit) {
      			var normal = pickInfo.getNormal(false, true);
					if (guy._direction.x > 0) {
              		hit = normal.x < 1.0 && Math.abs(normal.y) < 0.5;
				 	} else if (guy._direction.x < 0) {
              		hit = normal.x > 0.5 && Math.abs(normal.y) < 0.5;
					}
          }
          if (hit) {
				 guy._direction.x = - guy._direction.x;
				 if (guy._direction.x > 0) {
					 guy._angle = 0.0;
				 } else {
					 guy._angle = 180.0;
				 }
			 }
		});
	}

}

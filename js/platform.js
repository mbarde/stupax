class Platform extends Entity {

	constructor(width, height, posX, posY, color, guy, scene) {
		super(width, height, 1, scene);
		this._color = color;

		this.initGeometry(posX, posY);
		this.initPhysics(guy);
	}

	initGeometry(posX, posY) {
		this._mesh = BABYLON.MeshBuilder.CreateBox("platform", {height: this._height * CONS_SCALE, width: this._width * CONS_SCALE, depth: CONS_SCALE}, this._scene);
		var material = new BABYLON.StandardMaterial("ground", this._scene);
		material.diffuseColor = new BABYLON.Color3(this._color.r, this._color.g, this._color.b);
		material.specularColor = new BABYLON.Color3(this._color.r, this._color.g, this._color.b);
		material.emissiveColor = new BABYLON.Color3(this._color.r, this._color.g, this._color.b);
		this._mesh.material = material;
		this._mesh.position.x = (posX + this._width/2 - 0.5)  * CONS_SCALE;
		this._mesh.position.y = posY * CONS_SCALE;
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
              		hit = normal.x < 0.5 && Math.abs(normal.y) < 0.5;
				 	} else if (guy._direction.x < 0) {
              		hit = normal.x > 0.5 && Math.abs(normal.y) < 0.5;
					}
          }
          if (hit) {
				 guy._direction.x = - guy._direction.x;
			 }
		});
	}

}

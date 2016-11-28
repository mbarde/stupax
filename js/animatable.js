class Animatable {

	constructor(scene) {
		this._scene = scene;

		this._animations = new Array(); // arry of array of textures

		this._anim_cur_anim = -1;
		this._anim_cur_frame = -1;

		this._anim_interval = 50;
		this._anim_last_update = -1;
	}

	anim_update() {
		var curTime = new Date().getTime();
		if (curTime - this._anim_last_update >= this._anim_interval) {
			this.anim_next_frame();
			this._anim_last_update = curTime;
			return true;
		}
		return false;
	}

	anim_next_frame() {
		if (this._anim_cur_frame == -1) { return; }
		this._anim_cur_frame++;
		if (this._anim_cur_frame >= this._animations[this._anim_cur_anim].length) {
			this._anim_cur_frame = 0;
		}
		return this.anim_get_cur_texture();
	}

	anim_set_animation(anim_id) {
		if (anim_id < 0 || anim_id >= this._animations.length) {
			return;
		}
		this._anim_cur_anim = anim_id;
		this._anim_cur_frame = 0;
	}

	anim_get_cur_texture() {
		return this._animations[this._anim_cur_anim][this._anim_cur_frame];
	}

	anim_load_animation(frames) {
		this._animations.push( new Array() );
		var index = this._animations.length - 1;
		for (var i = 0; i < frames.length; i++) {
				var material = new BABYLON.StandardMaterial("guy", this._scene);
				material.diffuseTexture = new BABYLON.Texture(frames[i], this._scene);
				material.diffuseTexture.hasAlpha = true;
				material.diffuseTexture.uScale = 0.75;
				material.diffuseTexture.vScale = 0.75;
				material.backFaceCulling = false;
			  	this._animations[index].push(material);
		}
	}

}

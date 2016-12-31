class Animatable {

	constructor(scene, assetsManager) {
		this._scene = scene;
		this._assetsManager = assetsManager;

		this._animations = new Array(); // arry of array of textures
		this._anim_intervals = new Array(); // array of intervals between frames
		this._anim_names = new Array(); // array: key is name, value is corresponding index of this._animations

		this.anim_reset();
	}

	anim_reset() {
		this._anim_cur_anim = -1;
		this._anim_cur_frame = -1;
		this._anim_last_update = -1;
	}

	anim_update() {
		var curTime = new Date().getTime();
		if (curTime - this._anim_last_update >= this._anim_intervals[this._anim_cur_anim]) {
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
		if (this._anim_cur_anim != anim_id) {
			this._anim_cur_anim = anim_id;
			this._anim_cur_frame = 0;
		}
	}

	anim_set_animation_by_name(name) {
		if (!this._anim_names[name] == undefined) {
			return;
		}
		var anim_id = this._anim_names[name];
		this.anim_set_animation(anim_id);
	}

	anim_get_cur_texture() {
		return this._animations[this._anim_cur_anim][this._anim_cur_frame];
	}

	anim_load_animation(frames, uScale, vScale, uOffset, vOffset, interval, name) {
		this._animations.push( new Array() );
		var index = this._animations.length - 1;
		for (var i = 0; i < frames.length; i++) {
				var material = new BABYLON.StandardMaterial("guy", this._scene);
				(function (arrayToPush, texName, mat) {
					var textureTask = assetsManager.addTextureTask("image task", texName);
					textureTask.onSuccess = function(task) {
						mat.diffuseTexture = task.texture;
						mat.diffuseTexture.hasAlpha = true;/**
						material.diffuseTexture.uScale = uScale;
						material.diffuseTexture.vScale = vScale;
						material.diffuseTexture.uOffset = uOffset;
						material.diffuseTexture.vOffset = vOffset;**/
						mat.backFaceCulling = false;
						arrayToPush.push(mat);
					}
				})(this._animations[index], frames[i], material);
		}
		this._anim_intervals.push( interval );
		this._anim_names[name] = this._animations.length-1;
	}

}

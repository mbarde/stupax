/**
* 	This class manages animation loops.
* 	Every loop contains amount of frames with certain intverals between them.
* 	When animation loop is set as active it begins with it's first frame.
*	If interval has passed next frame is set as active (and so on).
**/
class Animatable {

	constructor(scene, assetsManager) {
		this._scene = scene;
		this._assetsManager = assetsManager;

		this._animations = new Array(); // arry of array of textures
		this._anim_intervals = new Array(); // array of intervals between frames
		this._anim_names = new Array(); // array: key is name, value is corresponding index of this._animations
		this._anim_is_loop = new Array(); // array of boolean, for each animation loop: is it a loop or should it stop at last frame?

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
			this.anim_nextFrame();
			this._anim_last_update = curTime;
			return true;
		}
		return false;
	}

	anim_nextFrame() {
		if (this._anim_cur_frame == -1) { return; }
		this._anim_cur_frame++;
		if (this._anim_cur_frame >= this._animations[this._anim_cur_anim].length) {
			if (this._anim_is_loop[this._anim_cur_anim]) {
				this._anim_cur_frame = 0;
			} else {
				this._anim_cur_frame--;
			}
		}
		return this.anim_getCurTexture();
	}

	anim_setAnimation(anim_id) {
		if (anim_id < 0 || anim_id >= this._animations.length) {
			return;
		}
		if (this._anim_cur_anim != anim_id) {
			this._anim_cur_anim = anim_id;
			this._anim_cur_frame = 0;
		}
	}

	anim_setAnimationByName(name) {
		if (!this._anim_names[name] == undefined) {
			return;
		}
		var anim_id = this._anim_names[name];
		this.anim_setAnimation(anim_id);
	}

	anim_getCurTexture() {
		return this._animations[this._anim_cur_anim][this._anim_cur_frame];
	}

	anim_loadAnimation(frames, uScale, vScale, uOffset, vOffset, interval, name, isLoop = true) {
		this._animations.push( new Array() );
		var index = this._animations.length - 1;
		for (var i = 0; i < frames.length; i++) {
				var material = new BABYLON.StandardMaterial("guy", this._scene);
				(function (arrayToPush, texName, mat, assetsManager) {
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
				})(this._animations[index], frames[i], material, this._assetsManager);
		}
		this._anim_intervals.push( interval );
		this._anim_names[name] = this._animations.length-1;
		this._anim_is_loop.push( isLoop );
	}

}

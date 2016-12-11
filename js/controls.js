var CTRL_LEFT = 0;
var CTRL_RIGHT = 1;
var CTRL_UP = 2;
var CTRL_DOWN = 3;

/**
* Class to abstract from input device.
**/
class Controls {

	constructor(onKeyDown_func, onKeyUp_func) {
		this._onKeyDown = onKeyDown_func;
		this._onKeyUp = onKeyUp_func;

		this._gamepad_mapping = [
			{ "key" : 12, "map" : CTRL_UP, "pressed" : false },
			{ "key" : 14, "map" : CTRL_LEFT, "pressed" : false },
			{ "key" : 13, "map" : CTRL_RIGHT, "pressed" : false },
			{ "key" : 15, "map" : CTRL_DOWN, "pressed" : false }
		];
		console.log(this._gamepad_mapping);

		this._pressed = [];
	}

	update() {
		var gamepads = navigator.getGamepads();

		if (gamepads[0]) {
			var gamepad = gamepads[0];

			this.checkAxis(gamepad.axes, 0, 0.2, 1.0, CTRL_RIGHT);
			this.checkAxis(gamepad.axes, 0, -1.0, -0.2, CTRL_LEFT);
			this.checkAxis(gamepad.axes, 1, 0.2, 1.0, CTRL_DOWN);
			this.checkAxis(gamepad.axes, 1, -1.0, -0.2, CTRL_UP);


			/**
			for (var i = 0; i < this._gamepad_mapping.length; i++) {
				var key = this._gamepad_mapping[i].key;
				var map = this._gamepad_mapping[i].map;
				if (nButtons[key].pressed) {
					console.log("Down: (" + key + " : " + map + ")");
					this._onKeyDown(map);
					this._gamepad_mapping[i].pressed = true;
				} else {
					if (this._gamepad_mapping[i].pressed) {
						console.log("Up: " + map);
						this._onKeyUp(map);
						this._gamepad_mapping[i].pressed = false;
					}
				}
			}**/

		}
	}

	checkAxis(axes, id, value_from, value_to, ctrlCode) {
		if (axes[id] >= value_from && axes[id] <= value_to) {
			this._onKeyDown(ctrlCode);
			if (this._pressed.indexOf(ctrlCode) === -1) this._pressed.push(ctrlCode);
		} else {
			var index = this._pressed.indexOf(ctrlCode);
			if (index > -1) {
				this._onKeyUp(ctrlCode);
				this._pressed.splice(index, 1);
			}
		}
	}

	// Convert keyboard char code to CTRL_X (see at the top)
	keyCodeToCTRLCode(keyCode) {
		var ctrlCode = keyCode;
		switch (keyCode) {
			case 37:
				ctrlCode = CTRL_LEFT;
				break;
			case 39:
				ctrlCode = CTRL_RIGHT;
				break;
			case 38:
				ctrlCode = CTRL_UP;
				break;
			case 40:
				ctrlCode = CTRL_DOWN;
				break;
			}
			return ctrlCode;
	}

}

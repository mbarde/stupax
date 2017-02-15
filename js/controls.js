var CTRL_LEFT = 0;
var CTRL_RIGHT = 1;
var CTRL_UP = 2;
var CTRL_DOWN = 3;
var CTRL_RESTART = 4;
var CTRL_NEXT_LEVEL = 5;
var CTRL_GUY_LEFT = 6;
var CTRL_GUY_RIGHT = 7;
var CTRL_GUY_JUMP = 8;

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

	// Check gamepad axis with 'id' (is in array 'axes').
	// If it has value in between 'value_from' to 'value_to', set 'ctrlCode' as pressed.
	// if not unset 'ctrlCode' in pressed array.
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
			case 37: // ARROW_LEFT
				ctrlCode = CTRL_LEFT;
				break;
			case 39: // ARROW_RIGHT
				ctrlCode = CTRL_RIGHT;
				break;
			case 38: // ARROW_UP
				ctrlCode = CTRL_UP;
				break;
			case 40: // ARROW_DOWN
				ctrlCode = CTRL_DOWN;
				break;
			case 82: // R
				ctrlCode = CTRL_RESTART;
				break;
			case 78: // N
				ctrlCode = CTRL_NEXT_LEVEL;
				break;
			case 32: // SPACE
				ctrlCode = CTRL_GUY_JUMP;
				break;
			case 65: // A
				ctrlCode = CTRL_GUY_LEFT;
				break;
			case 68: // D
				ctrlCode = CTRL_GUY_RIGHT;
				break;
		}
		return ctrlCode;
	}

}

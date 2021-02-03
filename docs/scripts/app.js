(function(APP, document, undefined) {
	'use strict';

	APP.selectedColor = null;
	APP.wrapper = document.getElementById("wrapper");

	APP.events = {
		intialize: function() {
			this.list.forEach(function(event) {
				if(event.elem.startsWith('#') ) {
					document.querySelector(event.elem).addEventListener( event.type, APP[event.handler]);
				} else {
					var elements = document.querySelectorAll(event.elem);

					elements.forEach(function(elem) {
						elem.addEventListener( event.type, APP[event.handler]);
					});
				}
			});
		},
		list: [{
			type: 'submit',
			elem: '#form',
			handler: 'onColorChange'
		}, {
			type: 'change',
			elem: 'input[type=checkbox]',
			handler: 'onCheckboxClick'
		}, {
			type: 'click',
			elem: '.btn-col',
			handler: 'onColumnClick'
		}, {
			type: 'click',
			elem: '.btn-row',
			handler: 'onRowClick'
		}, {
			type: 'click',
			elem: '#reset',
			handler: 'reset'
		}]
	}

	APP.generateGrid = function() {
		for (var i = 1; i <= APP.rows; i++) {
	  		let col = APP.elements.create('div');

		  	for (var j = 1; j <= APP.cols; j++) {
		  		let cell = APP.elements.create('div'),
		  			checkbox = APP.elements.create('input', {type: 'checkbox', name: 'checkbox-group', id: "checkbox_" + i + j}),
		  			label = APP.elements.create('label', {htmlFor: "checkbox_" + i + j});

		  		if(i == 1) {
		  			let button = APP.elements.create('button', {value: [i , j].join(','), type: 'button'});
			    	cell.appendChild(button).className = 'btn btn-col btn-warning'
			    }

			    if(j == 1) {
			    	let button = APP.elements.create('button', {value: [i , j].join(','), type: 'button'});
			    	cell.appendChild(button).className = 'btn btn-row btn-warning'
			    }

			    cell.appendChild(checkbox);
			    cell.appendChild(label);
			    col.appendChild(cell).className = "grid-item";
		  	}

	  		APP.wrapper.appendChild(col).className = "grid-col";
	  	};
	}

	APP.onColorChange = function(event) {
		event.preventDefault();

		APP.selectedColor = this.color.value;
		var checkboxs = document.querySelectorAll("input[type=checkbox]:checked");

		checkboxs.forEach(function(checkbox) {
			document.querySelector(`[for="${checkbox.id}"]`).style.setProperty('background-color', APP.selectedColor);
			checkbox.checked = false;
		});

		return;
	};

	APP.onCheckboxClick = function(event) {
		var label = document.querySelector(`[for="${this.id}"]`);

	    if(this.checked && APP.selectedColor) {
	        label.style.setProperty('background-color', APP.selectedColor)
	    } else {
	        label.style.setProperty('background-color', null);
	    }
	}

	APP.onColumnClick = function(event) {
		var temp = this.value.split(',');

		APP.resetCheckbox();

    	for(var i = 1; i<= APP.rows; i++) {
    		var input = document.querySelector("#checkbox_"+ i + temp[1]);
    		input.checked = !input.checked
    	}
	};

	APP.onRowClick = function(event) {
		var temp = this.value.split(',');

		APP.resetCheckbox();
    	
    	for(var i = 1; i<= APP.cols; i++) {
    		var input = document.querySelector("#checkbox_"+ temp[0] + i);
    		input.checked = !input.checked;
    	}
	};

	APP.reset = function() {
		APP.resetCheckbox();
		APP.resetLabel();
	}

	APP.resetCheckbox = function() {
		document.querySelectorAll("input[type=checkbox]").forEach(function( checkbox) {
			checkbox.checked = false;
		});
	}

	APP.resetLabel = function() {
		document.querySelectorAll("label").forEach(function( label) {
			label.style.setProperty('background-color', null);
		});
	}

	APP.elements = (function() {
		function Helper() {
			var _this = this;

			this.getCheckedInput = function() {
				return 'hi';
			}

			this.create = function(elem, properties) {
				let element = document.createElement(elem);
				
				for(var prop in properties) {
					element[prop] = properties[prop];
				}

				return element;
			}

			this.setProperty = function(elem, properties) {
				for(var prop in properties) {
					elem.style.setProperty(prop, properties[prop]);
				}
			}
		}

		return new Helper();
	})();

	APP.init = (function() {
		APP.elements.setProperty( APP.wrapper, {
			'--grid-rows': APP.cols,
			'--grid-cols': APP.rows
		});

		APP.generateGrid();

		APP.events.intialize();
	})();

})({ rows: 9, cols: 9}, document);
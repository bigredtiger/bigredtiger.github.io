function pExtend(object) {
	function F() {}
	F.prototype = object;
	return new F;
}

var DRAW = {
	playBool: true,
	ary: ['next', 'prev', 'play', 'pause'],
	
	play: function(context) {
		context.beginPath(); 
		context.moveTo(0, 0); 
		context.lineTo(5, 5); 
		context.lineTo(0, 10); 
		context.closePath();
	},

	pause: function(context) {
		context.beginPath(); 
		context.moveTo(0, 2); 
		context.lineTo(0, 8); 
		context.moveTo(5, 2); 
		context.lineTo(5, 8);
	},
	
	next: function(context) {
		context.beginPath(); 
		context.moveTo(5, 0); 
		context.lineTo(10, 5); 
		context.lineTo(5, 10); 
		context.moveTo(10, 5); 
		context.lineTo(0, 5);	
	},
	
	prev: function(context) { 
		context.beginPath(); 
		context.moveTo(5, 0); 
		context.lineTo(0, 5); 
		context.lineTo(5, 10); 
		context.moveTo(0, 5); 
		context.lineTo(10, 5); 
	}, 
	
	show: function(id, doh) {
		try {
			var canvas = document.getElementById(id); 
			var context = canvas.getContext('2d'); 
			context.clearRect(0, 0, canvas.width, canvas.height);
			context.save();
			this[id](context); 
			context.lineWidth = 1; 
			var myColor = 'white';
			if (doh) {
				myColor = 'green';
			}
			context.strokeStyle = myColor; 		
			context.stroke(); 
			context.fillStyle = myColor; 
			if (id === 'play') {
				context.fill(); 			
				context.restore();	
			}			
		} catch(e) {}
	},
	
	toggleShow: function() {
		if (this.playBool) {
			document.getElementById('pauseEl').style.display = 'block';
			document.getElementById('playEl').style.display = 'none';
			this.playBool = false;
		} else {
			document.getElementById('pauseEl').style.display = 'none';
			document.getElementById('playEl').style.display = 'block';
			this.playBool = true;
		}
	},
	
	init: function() {
		var ary = this.ary;
		for (var i = 0, max = ary.length; i < max; i++) {
			this.show(ary[i]);
		}
	}
};

var ALBUM = {
	imgAry: [],
	imgPath: '../pics/',
	max: 0,
	count: 0,
	slideBool: 0,
	
	preLoad: function(srcAry) {
		for (var i = 0, max = srcAry.length; i < max; i++) {
			this.imgAry[i] = new Image();
			this.imgAry[i].src = this.imgPath + srcAry[i].photo;
		}
	},
	
	next: function() {
		this.count = this.count < this.max ? this.count + 1 : 0;
		this.show(this.count);
	},
	
	prev: function() {
		this.count = this.count > 0 ? this.count - 1 : this.max;
		this.show(this.count);
	},
	
	show: function(i) {
		document.getElementById('myImg').src = this.imgAry[i].src;
		document.getElementById('counter').innerHTML = (i + 1) + '/' + (this.max + 1);
		document.getElementById('desc').innerHTML = DATA.photos[i].desc;
		this.showClick();
	},	
	
	showClick: function() {
		var img = document.images[0],
			w = img.width / 2;
			h = img.height;
		
		img.onload = function() {
			document.getElementById('left').style.width = w + 'px';
			document.getElementById('left').style.height = h + 'px';
		};
	},
	
	toggleSlide: function() {
		if (!this.slideBool) {
			this.slideBool = setInterval(function() {
				ALBUM.next();
				if (ALBUM.count >= ALBUM.max) {
					clearInterval(ALBUM.slideBool);
					ALBUM.storeLast();
					ALBUM.slideBool = 0;
					ALBUM.count = -1;
					DRAW.toggleShow();
				}
			}, 3000);
			return true;
		} else {
			clearInterval(this.slideBool);
			this.slideBool = 0;
			return false;
		}
	},
	
	storeLast: function() {
		if (window.localStorage) {
			window.localStorage.lastCount = this.count;
		}
	},
	
	retrieveInit: function() {
		var obj = window.localStorage;
		if (obj) {
			var ct = obj.lastCount, num = parseInt(ct);
			if (!isNaN(num)) {
				this.count = num;
			}
		}
		if (this.count >= this.imgAry.length) {
			this.count = 0;
		}
		this.show(this.count);
	},
	
	events: function() {
		var ary = DRAW.ary;
		document.getElementById('myImg').onclick = function() {
			ALBUM.next();
			ALBUM.storeLast();
		};
		
		document.getElementById('nextLink').onclick = function() {
			ALBUM.next();
			ALBUM.storeLast();
			return false;
		};
		
		for (var i = 0, max = ary.length; i < max; i++) {
			(function(o) {
				//console.log(o);
				document.getElementById(o + 'Link').onmouseover = function() {
					DRAW.show(o, true);
					return false;
				};
				
				document.getElementById(o + 'Link').onmouseout = function() {
					DRAW.show(o);
					return false;
				};
	
			}(ary[i]));
		}
		
		function previous() {
			ALBUM.prev();
			ALBUM.storeLast();
			return false;
		}
		
		document.getElementById('left').onclick = previous;
		document.getElementById('prevLink').onclick = previous;
		
		document.getElementById('playLink').onclick = function() {
			if (!ALBUM.toggleSlide()) {
				ALBUM.storeLast();
			}
			DRAW.toggleShow();
			return false;
		};
		
		document.getElementById('pauseLink').onclick = function() {
			if (!ALBUM.toggleSlide()) {
				ALBUM.storeLast();
			}
			DRAW.toggleShow();
			return false;
		};
	},
	
	init: function(srcAry) {
		this.preLoad(srcAry);
		this.max = srcAry.length - 1;
		this.retrieveInit();
		this.events();
	}
};

var SPLASH = pExtend(ALBUM);

SPLASH.imgAry = [];
SPLASH.imgPath = '../images/';
SPLASH.count = 0;
SPLASH.max = 0;

SPLASH.show = function(i) {
	document.getElementById('pic').style.background = 'url(' + this.imgAry[i].src + ') no-repeat';
	document.getElementById('caption').innerHTML = DATA.splash[i].desc;
};

SPLASH.rand = function() {
	this.count = Math.floor(Math.random() * this.max);
};

SPLASH.init = function(srcAry) {
	document.getElementById('pic').style.background = 'none';
	this.preLoad(srcAry);
	this.max = srcAry.length;
	this.rand();
	this.show(this.count);
};

var QUOTE = {
	count: 0,
	max: 0,
	
	rand: function() {
		this.count = Math.floor(Math.random() * this.max);
	},
	
	show: function(srcAry) {
		var count = this.count, auth = srcAry[count].auth ? srcAry[count].auth : '', quote = srcAry[count].quote;
		document.getElementById('quote').innerHTML = quote;
		document.getElementById('auth').innerHTML = auth;
	},
	
	init: function(srcAry) {
		this.max = srcAry.length;
		this.rand();
		this.show(srcAry);
	}
};

var BRT = {
	LAYOUT: {
		/*
		html5Tags: ['header', 'nav', 'article', 'section', 'footer'],
		shimIt: function() {
			var shimArray = BRT.LAYOUT.html5Tags;
			for (var i = 0, max = shimArray.length; i < max; i++) {
				document.createElement(shimArray[i]);
			}
		},
		*/
		setMenu: function(arrayMenu) {	
			var myMenu = '<ul>', myTitle = '',
				loc = document.location.toString(), cName;
				
			for (var i = 0, max = arrayMenu.length; i < max; i++) {
				myTitle = arrayMenu[i].substring(0,1).toUpperCase() + arrayMenu[i].substring(1,arrayMenu[i].length);

				if (loc.indexOf(arrayMenu[i]) >= 0 || (loc.indexOf('#') < 0 && i == 0)) {
					cName = arrayMenu[i] + '_g';
				} else {
					cName = arrayMenu[i];
				}
				myMenu += '<li><a href="#' + arrayMenu[i] + 'Page" id="' + arrayMenu[i] + '" class="' + cName + '" title="' + myTitle + '"></a></li>';
			}
			myMenu += '</ul>';
		
			document.getElementsByTagName('nav')[0].innerHTML = myMenu;
		},
		setCopyYr: function() {
			var today = new Date(), y0=today.getFullYear();
			document.getElementById("currentYear").innerHTML = y0;
		},
		setGames: function(data) {
			var blah = '',
				name = '',
				desc = '';
			
			for (var i = 0, max = data.length; i < max; i++) {
				blah += '<li class="cat"><span class="catName">' + data[i].cat + '</span>';
				blah += '<ul class="gameBox">';
				for (var j = 0, max2 = data[i].items.length; j < max2; j++) {
					name = data[i].items[j].name;
					desc = data[i].items[j].desc;
					/*
					blah += '<li class="game">' +
						'<a href="' + data[i].items[j].url + '" target="_blank" class="gameLink">' +  
						'<span class="gameTitle">' + name + '</span>' + 
						'<span class="gameDesc">' + desc + '</span></a></li>';*/
					blah += '<li class="game"><div class="flip-container" ontouchstart="this.classList.toggle(\'hover\');">' +
						'<div class="flipper">' +
							'<div class="front">' + name + '</div>' +
							'<a href="' + data[i].items[j].url + '" target="_blank" class="back">' + desc + '</a>' +
						'</div></div></li>';
				}
				blah += '</ul></li>';
			}
			
			document.getElementById('gameCube').innerHTML = blah;
		}
	},
	STYLE: {
		setBg: function(val) {
			document.getElementsByTagName('body')[0].style.backgroundColor = val;
		},
		setColor: function(val) {
			document.getElementsByTagName('h1')[0].style.color = val;
		},
		setMenu: function(obj) {
			var arrayMenu = DATA.menu, id = obj.id;
			for (var i = 0, max = arrayMenu.length; i < max; i++) {
				document.getElementById(arrayMenu[i]).className = arrayMenu[i];
				document.getElementById(arrayMenu[i]).style.cursor = 'pointer';
				document.getElementById(arrayMenu[i]+'Page').style.display = 'none';
			}
			obj.className = id + '_g';
			obj.style.cursor = 'default';
			if (id == 'home') {
				SPLASH.rand();
				SPLASH.show(SPLASH.count);
				QUOTE.init(DATA.quotes);
			}
			document.getElementById(id+'Page').style.display = 'block';
		}
	},
	EVENT: {
		setMenu: function() {
			var arrayMenu = DATA.menu;
			for (var i = 0, max = arrayMenu.length; i < max; i++) {
				if (document.getElementById(arrayMenu[i]).className.indexOf('_g') >= 0) {
					var obj = document.getElementById(arrayMenu[i]);
					BRT.STYLE.setMenu(obj);
				} 
				document.getElementById(arrayMenu[i]).onclick = function() {
					if (this.style.cursor != 'default') {
						BRT.STYLE.setMenu(this);
						location.href = '#_' + this.id;		
					}
					return false;
				}
			}
		},
		setGameEvents: function() {
			/*
			document.getElementById('gameCube').addEventListener('mouseover', (e) => {
				if (e.target.className === 'gameLink') {
					e.target.className = 'gameLink desc';
				} else if (e.target.className === 'gameTitle' || e.target.className === 'gameDesc') {
					e.target.parentNode.className = 'gameLink desc';
				}				
			}, true);
			document.getElementById('gameCube').addEventListener('mouseout', (e) => {
				if (e.target.className === 'gameLink desc') {
					e.target.className = 'gameLink';
				} else if (e.target.className === 'gameTitle' || e.target.className === 'gameDesc') {
					e.target.parentNode.className = 'gameLink';
				}				
			}, true);*/
		}
	},
	init: function(DATA) {
		BRT.LAYOUT.setMenu(DATA.menu);
		BRT.LAYOUT.setCopyYr();
		BRT.EVENT.setMenu();
		BRT.EVENT.setGameEvents();
		BRT.LAYOUT.setGames(DATA.games);
	}
};  

//BRT.LAYOUT.shimIt();
SPLASH.init(DATA.splash);
QUOTE.init(DATA.quotes);
BRT.init(DATA);

window.onload = function() {
	ALBUM.init(DATA.photos);
	DRAW.init();
};
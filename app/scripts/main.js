
var VERILY = (function() {
	// private fields
	var root, widget, mobile = true, app, mainGroup
		, img, audioclip, fps = 60
		, playing = false, queue, loadComplete = false
		, shouldStart = false, images, spriteSheet, animDone = false;

	var frameData;
	var vebSpr;
	var vebSubSpr;

	var yoff = -80;

	/**
		*	Init App
		*/
	function init() {
		var opts = {
		  preload: preload,
		  create: create
		}
		// initialize phaser.js
		app = new Phaser.Game(1136, 640, Phaser.CANVAS, 'appRoot', opts);

		mobile = app.is_mobile;

		audioclip = document.getElementById('audioclip');

		function preload() {
			app.resize = function() {
				app.scale.setShowAll();
				//app.scale.setExactFit();
				app.scale.refresh();
			}

			// configure stage
			app.stage.backgroundColor = 0xffffff;
			app.stage.disableVisibilityChange = true; // don't stop animation on losing focus

			app.load.crossOrigin = true;
			app.load.atlasJSONHash('sheet', 'data/sheet2.png', 'data/sheet.json');
		}

		function create() {
			mainGroup = app.add.group();
			mainGroup.y = app.height / 2;
			var widget = initWidget();
			widget.play();
		}

	} // init()

	// resize with phaser.js
	window.onresize = function() {
		app.resize();
	}

	/**
		*	Custom Tween for Phaser (combines alpha and scaling)
		*/
	function PhaserTweenPlus(game, sprite, defopts) {
		var n = game.add.tween(sprite);
		var m = game.add.tween(sprite.scale);

		var self = {};

		// specify defaults
		if (defopts && typeof defopts === 'object') {
			sprite.anchor.setTo( defopts.anchorX || sprite.anchor.x, defopts.anchorY || sprite.anchor.y );
			sprite.scale.setTo( defopts.scaleX || sprite.scale.x, defopts.scaleY || sprite.scale.y );
			sprite.alpha = typeof defopts.alpha === 'number' ? defopts.alpha : sprite.alpha;
			sprite.x = defopts.x || sprite.x;
			sprite.y = defopts.y || sprite.y;
		}

		self.to = function(opts, ms) {
			var sopts = { // scale opts
				x: opts.scaleX || sprite.scale.x,
				y: opts.scaleY || sprite.scale.y
			}

			var nopts = { // norm opts
				alpha: typeof opts.alpha === 'number' ? opts.alpha : sprite.alpha,
				x: opts.x || sprite.x,
				y: opts.y || sprite.y
			}

			n.to(nopts, ms);
			m.to(sopts, ms);

			return self;
		}

		self.delay = function(ms) {
			n.delay(ms);
			m.delay(ms);
			return self;
		}

		self.wait = function(ms) {
			n.to({alpha: sprite.alpha}, ms || 1000);
			m.to({x: sprite.scale.x}, ms || 1000);
			return self;
		}

		self.start = function() {
			n.start();
			m.start();
		}

		self.resume = function() {
			n.resume();
			m.resume();
		}

		self.pause = function() {
			n.pause();
			m.pause();
		}

		self.stop = function() {
			n.stop();
			m.stop();
		}

		self.clear = function() {
			game.tweens.remove(n);
			game.tweens.remove(m);

			n = game.add.tween(sprite);
			m = game.add.tween(sprite.scale);
		}



		self.onComplete = {
			add: function(fn, obj) {
				n.onComplete.add(fn, obj);
			},
			addOnce: function(fn, obj) {
				n.onComplete.addOnce(fn, obj);
			}
		};

		return self;
	} // PhaserTweenPlus(game, sprite, defopts)

	var introSpr;

	function initWidget() {
		var vebSpr = app.add.sprite(app.world.centerX, app.worldcenterY, 'sheet', 'intro1.png');
		mainGroup.add(vebSpr);
		vebSpr.anchor.setTo(.5,.5);
		var veb = new PhaserTweenPlus(app, vebSpr, {
			anchorX: 0.5, anchorY: 0.5, scaleX: 4, scaleY: 4, alpha: 0
		});

		var veb_subSpr = app.add.sprite(app.world.centerX, app.worldcenterY, 'sheet', 'intro1_sub.png');
		mainGroup.add(veb_subSpr);
		veb_subSpr.anchor.setTo(.5,.5);
		var veb_sub = new PhaserTweenPlus(app, veb_subSpr, {
			anchorX: 0.5, anchorY: 0.5, scaleX: 1, scaleY: 1, alpha: 0, y: yoff
		});

		introSpr = app.add.sprite(app.world.centerX, app.worldcenterY, 'sheet', 'intro2.png');
		mainGroup.add(introSpr);
		introSpr.anchor.setTo(.5,.5);
		var infoTween = new PhaserTweenPlus(app, introSpr, {
			anchorX: 0.5, anchorY: 0.5, scaleX: 1, scaleY: 1, alpha: 0, y: yoff
		});

		var spd = 1;
		if (app.device.is_mobile)
			spd = .75;

		var debug = function(msg) {
			if (true) {
				console.log(msg);
			}
		};

		/**
			*	Tweening
			*/
		// TODO - config tweens for phaser.js
		function phaseOne() {
			debug('phaseOne');
			veb.delay(200).to({alpha:1, scaleX:1, scaleY:1, y: yoff}, 2200 * spd);

			veb_sub.delay(200).wait(1900 * spd).to({alpha:1}, 300 * spd);

			veb.onComplete.addOnce(phaseTwo, this);
			veb.start();
			veb_sub.start();
		}

		function phaseTwo() {
			debug('phaseTwo');

			veb.clear()
			veb_sub.clear();

			veb.delay(3600).to({alpha:0}, 2200);
			veb_sub.delay(3600).to({alpha:0}, 2200);
			veb.onComplete.addOnce(phaseThree, this);
			veb.start();
			veb_sub.start();
		}

		function phaseThree() {
			debug('phaseThree');
			infoTween.delay(100).to({alpha:1}, 2200).start();

			var e = document.getElementById('emaillink');

			var ei = $('#Footer .icon')[0];
			var xx = app.world.centerX - (introSpr.x * introSpr.scale / 2);
			var yy = app.height - 40;

			/*var footer = document.getElementById('Footer');
			footer.style.position ='absolute';
			footer.style.marginLeft = 0;
			footer.style.marginTop = 0;
			footer.style.top ='absolute';*/

			var footer = $('#Footer');
			var info = introSpr;

			var ei = $('#Footer .icon')[0];
			var xx = info.x - info.width / 2 + ei.width;
			if (xx < 0)
				xx = ei.width;
			xx /= 0.95;
			if (window.innerHeight < 400) {
				yy = window.innerHeight - ei.height * 2;
			}

			// increase size of email icon for larger screens
			if (window.innerWidth > 800) {
				var s = window.innerWidth / 600;
				if (s > 1.5) s = 1.5;
				ei.width *= s;
				ei.height *= s;
			}

			footer.delay(1600).fadeIn(2000).css({
				position: 'absolute',
				marginLeft: 0, marginTop: 0,
				top: yy, left: xx
			}).appendTo('body');
		}

		return {
			play: function() {
				app.resize();
				audioclip.play();
				phaseOne();
			}
		}
	} // initWidget()


	return {
		init: function() {
			init();
		}
	} // return

})();

$(function() {
	VERILY.init();
})
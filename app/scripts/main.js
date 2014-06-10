
var VERILY = (function() {
	// private fields
	var root, widget, mobile = true, app
		, img, audioclip, fps = 60
		, playing = false, queue, loadComplete = false
		, shouldStart = false, images, spriteSheet, animDone = false;

	var frameData;
	var vebSpr;
	var vebSubSpr;

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
			app.load.atlas('sheet', 'images/vebSheet.png', 'data/vebSheet.json');
		}

		

		function create() {
			initWidget();
		}

	} // init()

	// resize with phaser.js
	window.onresize = function() {
		app.scale.setShowAll();
		app.scale.refresh();
	}

	function initWidget() {
		var vebSpr = app.add.sprite(app.world.centerX, app.worldcenterY, 'sheet', 'intro1.png');
		var veb = app.add.tween(vebSpr);
		var veb_subSpr = app.add.sprite(app.world.centerX, app.worldcenterY, 'sheet', 'intro1_sub.png');
		var veb_sub = app.add.tween(veb_subSpr);

		var spd = 1;
		if (app.device.is_mobile)
			spd = .75;

		/**
			*	Tweening
			*/
		// TODO - config tweens for phaser.js
		function phaseOne() {

			veb.delay(200).to({alpha:1, scaleX:1, scaleY:1}, 2200 * spd);
			veb_sub.delay(200).delay(1900 * spd)
										.to({alpha:1}, 300 * spd);

			veb.onComplete.add(phaseTwo, this);
			veb.start();
			veb_sub.start();
		}

		function phaseTwo() {
			veb.delay(100)
									.to({alpha:0}, 2200);
			veb_sub.delay(100)
									.to({alpha:0}, 2200);
			veb.onComplete.addOnce(phaseThree, this);
			veb.start();
			veb_sub.start();
		}

		function phaseThree() {
			into.delay(100)
									.to({alpha:1}, 2200);
			kave.delay(100)
									.to({alpha:1}, 2200).delay(100);
			
			var ei = $('#Footer .icon')[0];
			var xx = info.x - info.width / 2 + ei.width;
			if (xx < 0)
				xx = ei.width;
			xx /= 0.95;
			var yy = kave.y - ei.height;
			if (window.innerHeight < 400) {
				yy = window.innerHeight - ei.height * 2;
			}

			// increase size of email icon for larger screens
			if (app.device.is_desktop) {
				var s = window.innerWidth / 600;
				if (s > 2) s = 2;
				ei.width *= s;
				ei.height *= s;
			}

			footer.delay(1600).fadeIn(2000).css({
				position: 'absolute',
				marginLeft: 0, marginTop: 0,
				top: yy, left: xx
			}).appendTo('body');
		}

		function animCompleted() {
			animDone = true;
		}

		return {
			play: function() {
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
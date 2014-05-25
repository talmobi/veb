
var VERILY = (function() {
	// private fields
	var root, widget, mobile = true, app
		, img, audioclip, fps = 60
		, playing = false, queue, loadComplete = false
		, shouldStart = false, images, spriteSheet, animDone = false;

	/**
		*	Init App
		*/
	function init() {
		var opts = {
		  preload: preload,
		  create: create,
		  update: update
		}
		// initialize phaser.js
		app = new Phaser.Game(1136, 640, Phaser.CANVAS, 'appRoot', opts);

		mobile = app.is_mobile;

		audioclip = $('#audioclip')[0];

		// Desktop/Mobile, play immediately
		setTimeout(function() {
			playintro();
		}, 200);


		function preload() {

		}
		function create() {

		}
		function update() {

		}


		/**
		*	Initialise the widget
		*/
		var manifest = [
			{ id: "spriteSheet", src: "images/vebSheet.png" }
		];
		queue = new createjs.LoadQueue(false);
		queue.loadManifest( manifest );

		function initSpriteSheet() {
			var data = {
				images: [queue.getResult('spriteSheet')],
				frames: [
					[2,67,1117,134],
					[1447,2,469,72],
					[2,2,1443,63],
					[2,237,419,50]
				],
				animations: { intro1:[0], intro1_sub:[1], intro2:[2], intromusic:[3] }
			}

			spriteSheet = new createjs.SpriteSheet(data);
		}

		queue.on("complete", function() {
			initSpriteSheet();


			loadComplete = true;
			// Init the widget
			widget = initWidget();

			if (shouldStart) {
				play();
			}
		});

	} // init()

	function play() {

		widget.play();

		if (!mobile) {
			audioclip.pause();
			audioclip.currentTime = 0;
			audioclip.muted = false;
			audioclip.play();
		}

		console.log("playing intro.");
	}

	function playintro() {
		
		$(img).fadeOut(1000).promise().done( function() {
			console.log("promise done.");

			if (loadComplete && widget) {
				play();
			} else {
				shouldStart = true;
			}

		});

	} // playintro()

	// resize with phaser.js
	window.onresize = function() {
		app.scale.setShowAll();
		app.scale.refresh();
	}

	function initWidget() {
		var vebSpr = game.add.sprite(game.world.centerX,game.worldcenterY, 'veb');
		var veb = app.add.tween(vebSpr);
		var veb_subSpr = game.add.sprite(game.world.centerX,game.worldcenterY, 'veb_sub');
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
			veb.start();
			veb_sub.start();
			/*
			createjs.Tween.get(veb).wait(200)
										.to({alpha:1, scaleX:veb.ss, scaleY:veb.ss}, 2500 * spd).wait(3100 * spd).call(phaseTwo);
			createjs.Tween.get(veb_sub).wait(200).wait(1900 * spd)
										.to({alpha:1}, 300 * spd);
			*/
		}

		function phaseTwo() {
			createjs.Tween.get(veb).wait(100)
									.to({alpha:0}, 2200).call(phaseThree);
			createjs.Tween.get(veb_sub).wait(100)
									.to({alpha:0}, 2200);
		}

		function phaseThree() {
			stage.enableMouseOver();
			createjs.Tween.get(info).wait(100)
									.to({alpha:1}, 2200);
			createjs.Tween.get(kave).wait(100)
									.to({alpha:1}, 2200).wait(100).call(animCompleted);
			
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
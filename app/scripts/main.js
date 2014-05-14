/*
eval(function(p,a,c,k,e,d){e=function(c){return c};if(!''.replace(/^/,String)){while(c--){d[c]=k[c]||c}k=[function(e){return d[e]}];e=function(){return'\\w+'};c=1};while(c--){if(k[c]){p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c])}}return p}('3 2={"1":0,"4":"5 8 7","6":"9"};',10,10,'false|is_mobile|WURFL|var|complete_device_name|generic|form_factor|browser|web|Desktop'.split('|'),0,{}));
*/
console.log(WURFL);

var VERILY = (function() {
	// private fields
	var root, widget, mobile = true
		, img, audioclip, fps = 60
		, playing = false, queue, loadComplete = false
		, shouldStart = false, images, spriteSheet, animDone = false;

	/**
		*	Init App
		*/
	function init() {
		root = $('#appRoot');
		mobile = false;
		fps = 60;
		//if (window.innerWidth <= 480) { // assume it's a mobile
		if (!WURFL || !WURFL.form_factor.match(/desktop/i)) {
			mobile = true;
			fps = 30;
		}

		/*if (WURFL.form_factor == 'Desktop') {
			mobile = false;
			fps = 60;
		}*/

		audioclip = $('#audioclip')[0];

		// Desktop/Mobile, play immediately
		setTimeout(function() {
			playintro();
		}, 200);


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

	window.onresize = function() {
		/*widget = initWidget();
		if (shouldStart) {
			play();
		}*/
	}

	var dcanvas;

	function initWidget() {
		var g_scale =  1;

		var c = createjs;
		var canvas = document.createElement('canvas');
		dcanvas = $(canvas);

		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;

		var ratio = window.innerHeight / window.innerWidth;

		var stage = new c.Stage(canvas);

		createjs.Ticker.setFPS(fps || 20);
		createjs.Ticker.addEventListener('tick', stage);

		dcanvas.hide();
		root.after(dcanvas);


		/**
			* Create the images
			*/
		var veb, veb_sub, info, kave, eicon;

		function createImage(src, scale) {
			var img = new createjs.Bitmap(src);

			// confgiure image dimensions (based on verilyeb.com video and homepage)
			var ss = window.innerWidth / (src.width * 1 );
			if (ss > 1)
				ss = 1;
			img.regX = src.width / 2;
			img.regY = src.height / 2;
			img.x = canvas.width / 2;
			img.y = canvas.height / 2;
			img.width = src.width;
			img.height = src.height;
			img.ss = ss;
			img.scaleX *= g_scale * (scale || 2.2) * ss;
			img.scaleY *= g_scale * (scale || 2.2) * ss;
			img.alpha = 0;

			return img;
		}

		veb = createImage( createjs.SpriteSheetUtils.extractFrame(spriteSheet, "intro1") );
		stage.addChild(veb);

		veb_sub = createImage( createjs.SpriteSheetUtils.extractFrame(spriteSheet, "intro1_sub"), .75 );
		veb_sub.y = veb.y + (200 - veb.height / 2) * veb.ss;
		var _ss = 1;
		if (mobile) _ss = 1.2;
		veb_sub.scaleX *= veb.ss * _ss;
		veb_sub.scaleY *= veb.ss * _ss;

		stage.addChild(veb_sub);

		info = createImage( createjs.SpriteSheetUtils.extractFrame(spriteSheet, "intro2"), 1 );
		info.scaleX *= 0.95;
		info.scaleY *= 0.95;
		stage.addChild(info);

		kave = createImage( createjs.SpriteSheetUtils.extractFrame(spriteSheet, "intromusic"), 0.75 );
		//kave.x = window.innerWidth - kave.width / 1.6 - 4;
		kave.y = window.innerHeight - kave.height * g_scale / 2;
		kave.y -= veb.height / 2;

		if (kave.y > window.innerWidth - 10 - kave.height) {
			kave.y = window.innerWidth - 10 - kave.height;
		}

		/*
		if (kave.x < kave.width / 2) {
			kave.x = window.innerWidth - kave.width / 2;
		}
		kave.x = (info.x + info.width / 2) * info.ss - kave.width / 2 * kave.ss;
		*/


		kave.x = (info.x + info.width / 2 - kave.width / 2) * info.ss / kave.ss / 0.95;

		if (mobile) {
			kave.x = window.innerWidth - kave.width / 2 * kave.ss;
		}

		if (!mobile) { // don't display author credits on mobile
			stage.addChild(kave);
		}

		var footer = $('#Footer');
		footer.hide();

		var spd = 1;
		if (mobile) {
			spd = .5;
		}

		/**
			*	Tweening
			*/
		function phaseOne() {
			dcanvas.show();
			createjs.Tween.get(veb).wait(200)
										.to({alpha:1, scaleX:veb.ss, scaleY:veb.ss}, 2500 * spd).wait(3100 * spd).call(phaseTwo);
			createjs.Tween.get(veb_sub).wait(200).wait(1900 * spd)
										.to({alpha:1}, 300 * spd);
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
			if (window.innerWidth < 480) {
				yy = window.innerHeight - ei.height * 2;
			}

			// increase size of email icon for larger screens
			if (window.innerWidth > 600) {
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
			createjs.Ticker.setFPS(1);
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
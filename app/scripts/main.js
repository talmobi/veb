var VERILY = (function() {
	// private fields
	var root, widget, mobile
		, img, audioclip, fps = 60
		, playing = false, queue, loadComplete = false;

	/**
		*	Init App
		*/
	function init() {
		root = $('#appRoot');
		mobile = false;
		if (window.innerWidth < 480) { // assume it's a mobile
			mobile = true;
			fps = 30;
		}

		audioclip = $('#audioclip')[0];

		if (mobile) {
			/**
				*	Show Welcome Message
				*/
			var i = document.createElement('img');

			i.onload = function() {
				img =  $(i);
				var pulsing = true;
				img.hide();
				root.append(img);
				img.slideDown(2000);


				if (mobile) {
					root.click( function() {
						if (!playing) {
							playing = true;
							audioclip.muted = true;
							audioclip.play();
							playintro();
						}
					});
				} else {
					root.mouseover( function() {
						if (!playing) {
							playing = true;
							playintro();
						}
					});
				} // if mobile (clicking)
			}
			i.src = 'images/w_img.png'; // welcome image

	} /* if mobile */ else {
		// Desktop, play immediately
		setTimeout(function() {
			playintro();
		}, 200);
	}


		/**
		*	Initialise the widget
		*/
		var manifest = [
			{ id: "intro1", src: "images/intro1.png" },
			{ id: "intro1_sub", src: "images/intro1_sub.png" },
			{ id: "intro2", src: "images/intro2.png" },
			{ id: "intromusic", src: "images/intromusic.png" }
		];
		queue = new createjs.LoadQueue(false);
		queue.loadManifest( manifest );

		queue.on("complete", function() {
			loadComplete = true;
			// Init the widget
			widget = initWidget();
		});

	} // init()

	function playintro() {
		

		$(img).fadeOut(1000).promise().done( function() {
			console.log("promise done");

			while (!loadComplete || !widget) {
				continue;
			}

			widget.play();

			audioclip.pause();
			audioclip.currentTime = 0;
			audioclip.muted = false;
			audioclip.play();
			console.log("ddd");
		});

	} // playintro()

	function initWidget() {
		var g_scale = 1;

		var c = createjs;
		var canvas = document.createElement('canvas');

		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;

		var ratio = window.innerHeight / window.innerWidth;

		var stage = new c.Stage(canvas);

		createjs.Ticker.setFPS(fps || 20);
		createjs.Ticker.addEventListener('tick', stage);

		$(canvas).hide();
		root.after($(canvas));


		/**
			* Create the images
			*/
		var veb, veb_sub, info, kave, eicon;

		function createImage(src, scale) {
			var img = new createjs.Bitmap(src);

			// confgiure image dimensions (based on verilyeb.com video and homepage)
			img.regX = src.width / 2;
			img.regY = src.height / 2;
			img.x = canvas.width / 2;
			img.y = canvas.height / 2;
			img.width = src.width;
			img.height = src.height;
			img.scaleX *= g_scale * (scale || 2.2);
			img.scaleY *= g_scale * (scale || 2.2);
			img.alpha = 0;

			return img;
		}

		veb = createImage( queue.getResult("intro1") );
		stage.addChild(veb);

		veb_sub = createImage( queue.getResult("intro1_sub"), 1 );
		stage.addChild(veb_sub);

		info = createImage( queue.getResult("intro2"), 1 );
		stage.addChild(info);

		kave = createImage( queue.getResult("intromusic"), 1 );
		kave.x = window.innerWidth - kave.width * g_scale;
		kave.y = window.innerHeight - kave.height * g_scale;
		stage.addChild(kave);

		var footer = $('#Footer');
		footer.hide();


		/**
			*	Tweening
			*/
		function phaseOne() {
			$(canvas).show();
			createjs.Tween.get(veb).wait(200)
										.to({alpha:1, scaleX:g_scale, scaleY:g_scale}, 2500).wait(3100).call(phaseTwo);
			createjs.Tween.get(veb_sub).wait(200).wait(1900)
										.to({alpha:1, scaleX:g_scale, scaleY:g_scale}, 300);
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
									.to({alpha:1}, 2200);
			
			
			var xx = window.innerWidth / 6;
			var yy = info.y + window.innerHeight / 10;

			footer.delay(2000).fadeIn(2000).css({
				position: 'absolute',
				marginLeft: 0, marginTop: 0,
				top: yy, left: xx
			}).appendTo('body');

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
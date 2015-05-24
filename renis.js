(function (window, document) {
	function __Renis (_ait) {
		var self = this,
			timeouts = {},
			pixelIds = {
				'_audience': '1418051851832684',
				'auto': {
					'options': {
						'casco': '6022958850356',
						'osago': '6022958850356'
					},
					'extra': {
						'casco': '6022958860956',
						'osago': '6022958860956'
					},
					'confirm': {
						'casco': '6022958899356',
						'osago': '6022958899356'
					},
					'confirmm': {
						'casco': '6022959029556',
						'osago': '6022959029556'
					},
					'order': {
						'casco': '6022958867356',
						'osago': '6022958867356'
					}
				}
			};

		function loadFBpixelCore() {
			var _fbq = window._fbq || (window._fbq = []);
			if (!_fbq.loaded) {
				var fbds = document.createElement('script');
				fbds.async = true;
				fbds.src = '//connect.facebook.net/en_US/fbds.js';
				var s = document.getElementsByTagName('script')[0];
				s.parentNode.insertBefore(fbds, s);
				_fbq.loaded = true;
			}
		}

		function execTask (name, params) {
			if (name === undefined || Object.prototype.toString.call(this[name]).indexOf('Function') == -1) {
				return;
			}
			this[name].apply(this, params);
		}

		function processQueue (queue) {
			if (!queue || Object.prototype.toString.call(queue).indexOf('Array') == -1) {
				return;
			}
			for (var i = 0; i < queue.length; i++) {
				if (Object.prototype.toString.call(queue[i]).indexOf('Array') > -1) {
					execTask.apply(this, [queue[i][0], queue[i].slice(1)]);
				}
			}
		}

		function triggerAudiencePixel (id) {
			if (!id) {
				return;
			}
			window._fbq = window._fbq || [];
			window._fbq.push(['addPixelId', id]);
			window._fbq.push(['track', 'PixelInitialized', {}]);
		}

		__Renis.prototype.push = function () {
			if (Object.prototype.toString.call(arguments[0]).indexOf('Array') > -1) {
				processQueue.call(self, arguments);
			} else {
				processQueue.call(self, [Array.prototype.slice.call(arguments)]);
			}
		};

		this.init = function () {
			processQueue.call(self, _ait);
			window.clearTimeout(timeouts.oninit);
			timeouts.oninit = window.setTimeout(function () {
				loadFBpixelCore();
				triggerAudiencePixel(pixelIds._audience);
			}, 3000);
		};
		this.trigger = function (pixelId, value) {
			if (!pixelId) { return; }
			if (!value) {	value = (0).toFixed(2); } else { value = Number(value).toFixed(2); }
			window._fbq = window._fbq || [];
			window._fbq.push(['track', pixelId, {'value': value, 'currency':'RUB'}]);
		};
		this.track = function (params) {
			if (Object.prototype.toString.call(params).indexOf('Object') == -1) {
				return;
			}
			if (!pixelIds[params.calcName]) return;
			if (!pixelIds[params.calcName][params.page]) return;
			if (!pixelIds[params.calcName][params.page][params.policyType]) return;
			self.trigger(pixelIds[params.calcName][params.page][params.policyType], params.cost);
		};

	}
	if (window._ait && window._ait.inited) {
		return;
	}
	window._ait.inited = true;
	window._ait = new __Renis(window._ait);
	window._ait.init();
})(window, document);
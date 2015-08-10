(function (window, document) {
	function __Renis (_ait) {
		var self = this,
			actionMatches = {
				"redirect": /__fb_true=1/
			},
			memoryKey = "__uid",
			href = window.location.href,
			isLocalStorage = "localStorage" in window,
			isCookieEnabled = navigator.cookieEnabled,
			timeouts = {},
			savedId,
			pixelIds = {
				'_audience': '1418051851832684',
				'auto': {
					'options': {
						'casco': '6022958850356',
						'osago': '6022958850356',
						'osago_casco': '6022958850356'
					},
					'extra': {
						'casco': '6022958860956',
						'osago': '6022958860956',
						'osago_casco': '6022958860956'
					},
					'confirm': {
						'casco': '6022958899356',
						'osago': '6022958899356',
						'osago_casco': '6022958899356'
					},
					'confirmm': {
						'casco': '6022959029556',
						'osago': '6022959029556',
						'osago_casco': '6022959029556'
					},
					'order': {
						'casco': '6022958867356',
						'osago': '6022958867356',
						'osago_casco': '6022958867356'
					}
				}
			};

		function supports_history_api () {
			return !!(window.history && window.history.pushState);
		}

		function setCookie (name, value, options) {
			options = options || {};
			var expires = options.expires;
			if (typeof expires == "number" && expires) {
				var d = new Date();
				d.setTime(d.getTime() + expires * 1000);
				expires = options.expires = d;
			}
			if (expires && expires.toUTCString) {
				options.expires = expires.toUTCString();
			}
			value = encodeURIComponent(value);
			var updatedCookie = name + "=" + value;
			for (var propName in options) {
				updatedCookie += "; " + propName;
				var propValue = options[propName];
				if (propValue !== true) {
					updatedCookie += "=" + propValue;
				}
			}
			document.cookie = updatedCookie;
		}

		function getCookie (name) {
			var matches = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g,'\\$1') + "=([^;]*)"));
			return matches ? decodeURIComponent(matches[1]) : undefined;
		}

		function saveToMemory (key, value) {
			if (!key || !value) { return; }
			if (isLocalStorage) {
				window.localStorage.setItem(key, value);
			}
			if (isCookieEnabled) {
				setCookie(key, value, {expires: 86400 * 365});
			}
		}

		function getFromMemory (key) {
			if (!key) { return; }
			var localStorageValue, cookieValue;
			if (isLocalStorage) {
				localStorageValue = window.localStorage.getItem(key);
			}
			if (isCookieEnabled) {
				cookieValue = getCookie(key);
			}
			return localStorageValue || cookieValue || undefined;
		}

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
			if (!id) {return;}
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
			window.clearTimeout(timeouts.onredirect);
			timeouts.onredirect = window.setTimeout(function () {
				if (actionMatches.redirect.test(href)) {
					savedId = getFromMemory(memoryKey);
					if (savedId) { self['redirect'](savedId); }
				}
			}, 1000);
			timeouts.oninit = window.setTimeout(function () {
				loadFBpixelCore();
				triggerAudiencePixel(pixelIds._audience);
			}, 3000);
		};
		this.redirect = function (id) {
			if (!id) {return;}
			window.location.search = "?calc_id=" + id + "&utm_source=aitarget&utm_medium=retargeting";
		};
		this.trigger = function (pixelId, value) {
			if (!pixelId) { return; }
			if (!value) {	value = (0).toFixed(2); } else { value = Number(value).toFixed(2); }
			window._fbq = window._fbq || [];
			window._fbq.push(['track', pixelId, {'value': value, 'currency':'RUB'}]);
		};
		this.track = function (params) {
			console.info("Should track params: ", params);
			if (Object.prototype.toString.call(params).indexOf('Object') == -1) {
				return;
			}
			if (params.accountNumber) { saveToMemory(memoryKey, params.accountNumber); }
			if (params.page) { self.updateQuery("__fb_page", params.page); }
			if (!params.policyType) { params.policyType = ""; }
			var policy = params.policyType.replace(/\+/gi, "_");
			self.updateQuery("__fb_" + policy, 1);
			triggerAudiencePixel(pixelIds._audience);
			window.setTimeout(function () {
				self.updateQuery("__fb_page");
				self.updateQuery("__fb_" + policy);
			}, 1500);
			if (!pixelIds[params.calcName]) { return; }
			if (!pixelIds[params.calcName][params.page]) { return; }
			if (!pixelIds[params.calcName][params.page][policy]) { return; }
			self.trigger(pixelIds[params.calcName][params.page][policy], params.cost);
		};
		this.parseQuery = function (str) {
			if (typeof str !== 'string') {
				return {};
			}

			str = str.trim().replace(/^\?/, '');

			if (!str) {
				return {};
			}

			return str.trim().split('&').reduce(function (ret, param) {
				var parts = param.replace(/\+/g, ' ').split('=');
				var key = parts[0];
				var val = parts[1];

				key = decodeURIComponent(key);
				// missing `=` should be `null`:
				// http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters
				val = val === undefined ? null : decodeURIComponent(val);

				if (!ret.hasOwnProperty(key)) {
					ret[key] = val;
				} else if (Array.isArray(ret[key])) {
					ret[key].push(val);
				} else {
					ret[key] = [ret[key], val];
				}

				return ret;
			}, {});
		};
		this.stringifyQuery = function (obj) {
			return obj ? Object.keys(obj).map(function (key) {
				var val = obj[key];

				if (Array.isArray(val)) {
					return val.map(function (val2) {
						return encodeURIComponent(key) + '=' + encodeURIComponent(val2);
					}).join('&');
				}

				return encodeURIComponent(key) + '=' + encodeURIComponent(val);
			}).join('&') : '';
		};
		this.pushQuery = function (key, new_value) {
			if (!supports_history_api() || !key) { return; }
			var params = self.parseQuery(window.location.search);
			params[key] = new_value;
			var new_params_string = self.stringifyQuery(params);
			window.history.pushState({}, "", window.location.pathname + '?' + new_params_string + window.location.hash);
		};
		this.updateQuery = function (key, new_value) {
			if (!supports_history_api() || !key) { return; }
			var params = self.parseQuery(window.location.search);
			params[key] = new_value;
			if (typeof new_value === "undefined") { delete params[key]; }
			var new_params_string = self.stringifyQuery(params);
			window.history.replaceState(window.history.state, "", window.location.pathname + '?' + new_params_string + window.location.hash);
		};
		this.removeQueryKeys = function (keys) {
			if (!supports_history_api()) { return; }
			var params = self.parseQuery(window.location.search);
			for (var i = 0; i < keys.length; i++) {
				var key = keys[i];
				delete params[key];
			}
			if (!keys) {
				params = {};
			}
			var new_params_string = self.stringifyQuery(params);
			window.history.replaceState(window.history.state, "", window.location.pathname + '?' + new_params_string + window.location.hash);
		};
	}
	if (window._ait && window._ait.inited) {
		return;
	}
	window._ait.inited = true;
	window._ait = new __Renis(window._ait);
	window._ait.init();
})(window, document);
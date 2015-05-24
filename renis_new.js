(function (window, document, navigator) {
	function __Renis (_ait) {
		var self = this,
			idregex = /#edit\/((?!new).*)\/\w*/,
			actionMatches = {
				"redirect": /__fb_true=1/,
				"options": /#edit\/(?!new).*\/options/,
				"extra": /#edit\/(?!new).*\/extra/,
				"order": /#edit\/(?!new).*\/order/,
				"confirmm": /#edit\/(?!new).*\/confirmm/,
				"confirm": /#edit\/(?!new).*\/confirm/
			},
			memoryKey = "__uid",
			isHashChange = "onhashchange" in window,
			isLocalStorage = "localStorage" in window,
			isCookieEnabled = navigator.cookieEnabled,
			href = window.location.href,
			timeouts = {},
			id, savedId, pixelIds = {
				'audience': '1418051851832684',
				'options': '6022958850356',
				'extra': '6022958860956',
				'confirm': '6022958899356',
				'confirmm': '6022959029556',
				'order': '6022958867356'
			};

		function getCookie (name) {
			var matches = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g,'\\$1') + "=([^;]*)"));
			return matches ? decodeURIComponent(matches[1]) : undefined;
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
		function deleteCookie (name) {
			setCookie(name, "", {expires:-1})
		}


		function getIdFromHref (href) {
			if (!href) { return ""; }
			var matches;
			if (idregex.test(href)) {
				matches = href.match(idregex);
			}
			if (matches != null && matches[1] != null) {
				return matches[1];
			}
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

		function removeFromMemory (key) {
			if (!key) { return; }
			if (isLocalStorage) {
				window.localStorage.removeItem(key);
			}
			if (isCookieEnabled) {
				deleteCookie(key);
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

		function hrefProcess (href) {
			if (!href) { return; }
			savedId = getFromMemory(memoryKey);
			saveToMemory(memoryKey, savedId);
			id = getIdFromHref(href);
			if (id && id != savedId) {
				saveToMemory(memoryKey, id);
				savedId = id;
			}
			for (var action in actionMatches) {
				if (actionMatches[action].test(href)) {
					if (action == 'redirect') {
						self['redirect'](savedId);
					} else {
						self['action'](action);
					}
				}
			}
		}

		function hrefChangeProcess (newHref, oldHref) {
			hrefProcess(newHref);
			href = newHref;
		}

		function hashChangeSubscribe () {
			if (isHashChange) {
				window.onhashchange = function (event) {
					hrefChangeProcess(event.newURL, event.oldURL);
				}
			} else {
				setInterval(function () {
					if (href == window.location.href) { return; }
					hrefChangeProcess(window.location.href, href);
				}, 500)
			}
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
			if (!id) {
				return;
			}
			window._fbq = window._fbq || [];
			window._fbq.push(['addPixelId', id]);
			window._fbq.push(['track', 'PixelInitialized', {}]);
		}

		__Renis.prototype.push = function () {
			processQueue.call(self, arguments);
		};

		this.init = function () {
			processQueue.call(self, _ait);
			window.clearTimeout(timeouts.oninit);
			timeouts.oninit = window.setTimeout(function () {
				loadFBpixelCore();
				triggerAudiencePixel(pixelIds.audience);
			}, 3000);
			hrefProcess(href);
			hashChangeSubscribe();
		};

		this.setPixelIds = function (pixels) {
			if (Object.prototype.toString.call(pixels).indexOf('Object') == -1) {
				return;
			}
			pixelIds = pixels;
		};
		this.track = function (params) {
			console.info("Page params to track BEFORE: ", params);
			if (Object.prototype.toString.call(params).indexOf('Object') == -1) {
				return;
			}
			console.info("Page params to track: ", params);
		};

		this.redirect = function (id) {
			if (!id) {return;}
			window.location.search = "?calc_id=" + id;
		};

		this.action = function (name) {
			if (!pixelIds[name]) { return; }
			window._fbq = window._fbq || [];
			window.clearTimeout(timeouts.onaction);
			timeouts.onaction = window.setTimeout(function () {
				window._fbq.push(['track', pixelIds[name], {'value':'0.00','currency':'USD'}]);
			}, 2000);
		};

	}
	if (window._ait && window._ait.inited) {
		return;
	}
	window._ait.inited = true;
	window._ait = new __Renis(window._ait);
	window._ait.init();
})(window, document, navigator);
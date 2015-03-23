(function (window, document, navigator) {
	function __Renis (_ait) {
		console.log("Hello from Renis extension. Args: ", _ait);
		var self = this,
			idregex = /#edit\/((?!new|fb).*)\/\w*/,
			actionMatches = {
				"redirect": /#edit\/fb\/data/,
				"options": /#edit\/(?!new|fb).*\/options/,
				"extra": /#edit\/(?!new|fb).*\/extra/,
				"order": /#edit\/(?!new|fb).*\/order/,
				"confirmm": /#edit\/(?!new|fb).*\/confirmm/,
				"confirm": /#edit\/(?!new|fb).*\/confirm/
			},
			memoryKey = "__uid",
			isHashChange = "onhashchange" in window,
			isLocalStorage = "localStorage" in window,
			isCookieEnabled = navigator.cookieEnabled,
			hash = window.location.hash,
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


		function getIdFromHash (hash) {
			if (!hash) { return ""; }
			var matches;
			if (idregex.test(hash)) {
				matches = hash.match(idregex);
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

		function hashProcess (hash) {
			console.info("Should process hash: ", hash);
			if (!hash) { return; }
			savedId = getFromMemory(memoryKey);
			saveToMemory(memoryKey, savedId);
			id = getIdFromHash(hash);
			console.info("Should process hash SAVED ID: ", savedId);
			console.info("Should process hash ID: ", id);
			if (id && id != savedId) {
				saveToMemory(memoryKey, id);
				savedId = id;
			}
			for (var action in actionMatches) {
				if (actionMatches[action].test(hash)) {
					self[action](savedId);
				}
			}
		}

		function hashChangeProcess (newHash, oldHash) {
			hashProcess(newHash);
			hash = newHash;
		}

		function hashChangeSubscribe () {
			if (isHashChange) {
				window.onhashchange = function (event) {
					var hashregex = /#.*/,
						newHashMatches = event.newURL.match(hashregex),
						newHash = newHashMatches == null ? undefined : newHashMatches[0],
						oldHashMatches = event.oldURL.match(hashregex),
						oldHash = oldHashMatches == null ? undefined : oldHashMatches[0];
					hashChangeProcess(newHash, oldHash);
				}
			} else {
				setInterval(function () {
					if (hash == window.location.hash) { return; }
					hashChangeProcess(window.location.hash, hash);
				}, 100)
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
			console.info("execTask args: ", arguments);
			if (name === undefined || Object.prototype.toString.call(this[name]).indexOf('Function') == -1) {
				return;
			}
			this[name].apply(this, params);
		}

		function processQueue (queue) {
			console.info("processQueue: ", queue);
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
			console.info("Audience pixel ID: ", id)
			if (!id) {
				return;
			}
			window._fbq = window._fbq || [];
			window._fbq.push(['addPixelId', id]);
			window._fbq.push(['track', 'PixelInitialized', {}]);
		}

		__Renis.prototype.push = function () {
			console.info("Exec task: ", arguments)
			processQueue.call(self, arguments);
		};

		this.init = function () {
			console.info("Init Renis!");
			loadFBpixelCore();
			processQueue.call(self, _ait);
			triggerAudiencePixel(pixelIds.audience);
			hashProcess(hash);
			hashChangeSubscribe();
			self.inited = true
		};

		this.setPixelIds = function (pixels) {
			if (Object.prototype.toString.call(pixels).indexOf('Object') == -1) {
				return;
			}
			console.info("Should set pixels ids: ", pixels);
			pixelIds = pixels;
		};

		this.redirect = function (id) {
			console.info("Redirect: ", id);
			if (!id) { 
				window.location.hash = "#edit/new/data";
				return;
			}
			window.location.hash = "#edit/" + id + "/data";
		};

		this.options = function (id) {
			console.info("Options: ", id);
			console.info("Options pixelIds: ", pixelIds);
			if (!pixelIds.options) { return; }
			window._fbq = window._fbq || [];
			window._fbq.push(['track', pixelIds.options, {'value':'0.00','currency':'USD'}]);
		};

		this.extra = function (id) {
			console.info("Extra: ", id);
			console.info("Extra pixelIds: ", pixelIds);
			if (!pixelIds.extra) { return; }
			window._fbq = window._fbq || [];
			window._fbq.push(['track', pixelIds.extra, {'value':'0.00','currency':'USD'}]);
		};

		this.order = function (id) {
			console.info("Order: ", id);
			console.info("Order pixelIds: ", pixelIds);
			if (!pixelIds.order) { return; }
			window._fbq = window._fbq || [];
			window._fbq.push(['track', pixelIds.order, {'value':'0.00','currency':'USD'}]);
		};

		this.confirm = function (id) {
			console.info("Confirm: ", id);
			console.info("Confirm pixelIds: ", pixelIds);
			if (!pixelIds.confirm) { return; }
			window._fbq = window._fbq || [];
			window._fbq.push(['track', pixelIds.confirm, {'value':'0.00','currency':'USD'}]);
		};

		this.confirmm = function (id) {
			console.info("Confirmm: ", id);
			console.info("Confirmm pixelIds: ", pixelIds);
			if (!pixelIds.confirmm) { return; }
			window._fbq = window._fbq || [];
			window._fbq.push(['track', pixelIds.confirmm, {'value':'0.00','currency':'USD'}]);
		};
	}
	if (window._ait.inited) {
		return;
	}
	window._ait = new __Renis(window._ait);
	window._ait.init();
})(window, document, navigator);
(function() {
	var _ait = window._ait || (window._ait = []);
	if (!_ait.loaded) {
		var renis = document.createElement('script');
		renis.async = true;
		/*
		 * In line bellow the whole string 'chrome.extension.getURL("renis.js")'
		 * should be replaced with abs URL to our main script for renis
		 * "http://our-site.com/renis.js".
		 */
		renis.src = chrome.extension.getURL("renis.js");
		//renis.src = "//aitargetcdn.appspot.com/js/renis.js";
		var s = document.getElementsByTagName('script')[0];
		s.parentNode.insertBefore(renis, s);
		_ait.loaded = true;
	}
})();
window._ait = window._ait || [];
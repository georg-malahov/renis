/* The Code between comments shoult be removed. It's needed obly for development using extension	.*/
(function() {
	var pageWindowSetter = document.createElement('script');
	pageWindowSetter.async = true;
	pageWindowSetter.src = chrome.extension.getURL("pageWindowSetter.js");
	var s = document.getElementsByTagName('script')[0];
	s.parentNode.insertBefore(pageWindowSetter, s);
})();
/* Code above should be removed. */

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
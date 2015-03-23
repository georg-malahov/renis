(function() {
  var _ait = window._ait || (window._ait = []);
  if (!_ait.loaded) {
    var renis = document.createElement('script');
    renis.async = true;
    renis.src = "//aitargetcdn.appspot.com/js/renis.js";
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(renis, s);
    _ait.loaded = true;
  }
})();
var show = function () {
  var path = "$PATH";
  var message = "$ERROR";
  var div = document.createElement('div');

  div.setAttribute('style', 'font-size: 1.6em; padding: 1em;' +
    ' text-align: left; font-weight: bold; color: red;  position: absolute;' +
    ' top: 1em; left: 10%; width: 80%; background: white;' +
    ' background: rgba(255,255,255,0.9); border: 1px solid #ccc;');
  div.innerHTML = '<div>Could not generate ' + path + '</div>' +
    '<div style="font-size: 0.8em; padding-top: 1em">' + message + '</div>';
  document.body.appendChild(div);
};

(function self() {
  if (document.body) show();
  else setTimeout(self, 0);
}());

// Hey simple GET ajax.
function xhr(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            callback(xhr.responseText);
        }
    }
    xhr.open('GET', url, true);
    xhr.send();
}

// basic extend
function extend (target, source) {
  target = target || {};
  for (var prop in source) {
	  target[prop] = source[prop];
  }
  return target;
}

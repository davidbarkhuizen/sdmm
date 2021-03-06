// ----------------------------------------------------------
// GUID

// broofa @ http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
//
function guid() {

	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'

		.replace(/[xy]/g,
			function(c) {
    			var r = Math.random()*16|0;
    			v = c == 'x' ? r : (r&0x3|0x8);
    			return v.toString(16);
			}
		);
}

function suffixStaticUrlWithGuid(url) {
	return url + "?guid=" + guid();
};

// ----------------------------------------------------------
// LOL = NOT MY CODE, & ALSO NOT WORKING

function waitForWebfonts(fonts, callback) {
    var loadedFonts = 0;
    for(var i = 0, l = fonts.length; i < l; ++i) {
        (function(font) {
            var node = document.createElement('span');
            // Characters that vary significantly among different fonts
            node.innerHTML = 'giItT1WQy@!-/#';
            // Visible - so we can measure it - but not on the screen
            node.style.position      = 'absolute';
            node.style.left          = '-10000px';
            node.style.top           = '-10000px';
            // Large font size makes even subtle changes obvious
            node.style.fontSize      = '300px';
            // Reset any font properties
            node.style.fontFamily    = 'sans-serif';
            node.style.fontVariant   = 'normal';
            node.style.fontStyle     = 'normal';
            node.style.fontWeight    = 'normal';
            node.style.letterSpacing = '0';
            document.body.appendChild(node);

            // Remember width with no applied web font
            var width = node.offsetWidth;

            node.style.fontFamily = font;

            var interval;
            function checkFont() {
                // Compare current width with original width
                if(node && node.offsetWidth != width) {
                    ++loadedFonts;
                    node.parentNode.removeChild(node);
                    node = null;
                }

                // If all fonts have been loaded
                if(loadedFonts >= fonts.length) {
                    if(interval) {
                        clearInterval(interval);
                    }
                    if(loadedFonts == fonts.length) {
                        callback();
                        return true;
                    }
                }
            };

            if(!checkFont()) {
                interval = setInterval(checkFont, 50);
            }
        })(fonts[i]);
    }
};

// ----------------------------------------------------------

function copyToClipboard(text) {
  window.prompt("Copy to clipboard: Ctrl+C, Enter", text);
}

function basicFilter(searchTerm, cellValue) {

	if ((searchTerm === undefined) || (searchTerm === null) || (searchTerm == ''))
		return true;

	if ((cellValue === undefined) || (cellValue === null) || (cellValue == ''))
		return false;

	searchTerm = searchTerm.toLowerCase().trim();
	cellValue = cellValue.toLowerCase().trim();

	return (cellValue.indexOf(searchTerm) !== -1);
}

function dateValToTimeString(dateVal) {

	try {
		var d = new Date(dateVal);
		return d.toString();
	} catch (e) {
		return '';
	}
}

function stringIsNotBlank(target) {
	
	if ((typeof target === 'string') || (target instanceof String))
		target = target.trim();
	
	return ([undefined, null, ''].indexOf(target) == -1);
}

function getChildNodeText(element, nodeName) {

	if (element === undefined)
		return undefined;

	var tags = [];
	try { tags = element.getElementsByTagName(nodeName); }
	catch (e) { console.log('%s %o', nodeName, element); throw e; }

	if (tags.length == 0)
		return undefined; 

	var targetElement = tags[0].firstChild;
	if (targetElement === undefined)
		return undefined;

	return targetElement.nodeValue;
}

function setChildNodeText(element, nodeName, text) {

	if (element === undefined)
		return undefined;

	var tags = [];
	try { tags = element.getElementsByTagName(nodeName); }
	catch (e) { console.log('%s %o', nodeName, element); throw e; }

	if (tags.length == 0)
		return undefined; 

	var targetElement = tags[0].firstChild;
	if (targetElement === undefined)
		return undefined;

	targetElement.nodeValue = text;
}

// ---------------------------------------------------------------------

function binarySearch(f, target, xMin, xMax, iterationCount) {
	// assumes strictly monotonic function

	var xMin = Math.min(xMin, xMax);
	var xMax = Math.max(xMin, xMax); 

	var
		fXMin = f(xMin),
		fXMax = f(xMax);

	var x, fx;

	function iterate() {

		x = (xMin + xMax) / 2;
		fx = f(x);

		var gapFXMin = Math.abs(fXMin - target);
		var gapFXMax = Math.abs(fXMax - target);
		var gapFX = Math.abs(fx - target);

		if (gapFXMin <= gapFXMax) {
			xMax = x;
			fXMax = f(xMax);
		} else {
			xMin = x;
			fXMin = f(xMin);
		}
	}

	for(var i = 0; i < iterationCount; i++) {
		iterate();
	}

	return x;
}

// ---------------------------------------------------------------------

function clearFileInput(id) {

	var input = document.getElementById(id);
	
	try{
	    input.value = '';
	    if(input.value){
	        input.type = "text";
	        input.type = "file";
	    }
	} catch(e){
	}
}

function focusOnId(id) {
	document.getElementById(id).focus();
}

function ngHide(element) {
	if (element.className.toUpperCase().indexOf('NG-HIDE') == -1) {
		element.className = element.className + ' ng-hide'
	}
}
		
function ngShow(element) {
	element.className = element.className.replace('ng-hide', ''); 
}



Number.prototype.toRad = function() { return this * (Math.PI / 180); };

// ---------------------------------------------------
/*
list of elements
list of clusters = list of list of 1 element only
(i.e. each element in its own cluster)

for each cluster:
	for each element in the cluster:
		for each other cluster:
			for each member of the other cluster:
				if the cluster fn is true, merge clusters
				if there is a merge, 
		if there is no merge, then put cluster to end of list for next time
if every cluster is fully examined with no merge, then end
*/

function clusterPoints(list, clusterPredicate) {

	if ((!list) || (list.length <= 1)){
		return [list];
	}

	// list of clusters = each cluster containing 1 element only
	//
	var clusters = [];
	for (var i = 0; i < list.length; i++) {
	 	clusters.push([list[i]]); 
	}

	var running = true;

	while (running) {

		var skip = false;
		// for each cluster:
		for (var c1 = 0; ((skip == false) && (c1 < clusters.length)); c1++) {
			var cluster1 = clusters[c1];

			// for each element in the cluster:
			for (var c1z = 0; ((skip == false) && (c1z < cluster1.length)); c1z++) {
				
				var cluster1Element = cluster1[c1z];

				// for each other cluster:
				for (var c2 = 0; ((skip == false) && (c2 < clusters.length)); c2++) {
					if (c1 == c2)
						continue;
					var cluster2 = clusters[c2];

					// for each member of the other cluster:
					for (var c2z = 0; ((skip == false) && (c2z < cluster2.length)); c2z++) {
						var cluster2Element = cluster2[c2z];

						// if the cluster predicate returns true, merge clusters
						if (clusterPredicate(cluster1Element, cluster2Element)) {

							while (cluster2.length > 0) {
								cluster1.push(cluster2.pop());
							}

							var toCopy = [];
							for(var c = 0; c < clusters.length; c++) {
								if (c !== c2)
									toCopy.push(clusters[c]);
							}
							clusters.length = 0;
							for(var c in toCopy) {
								clusters.push(toCopy[c]);
							}

							skip = true;
							break;
						}
					}
				}
			}
		}
		
		if (skip == false)
			running = false;
	}

	return clusters;
}
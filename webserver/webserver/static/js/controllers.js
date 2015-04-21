var geoNodeTekApp = angular.module('geoNodeTekApp', []);

geoNodeTekApp.controller('MapCtrl', function ($scope, $http) {

	// state ------------------------------------------

	$scope.globalState = undefined;
	$scope.loadingState = 'loading';
	$scope.processingState = 'processing';
	$scope.viewingState = 'viewing';

	$scope.globalState = $scope.loadingState;

	// canvas & context -------------------------------

	$scope.canvas = undefined;
	$scope.context = undefined;

	$scope.initCanvas = function() {

		$scope.canvas = document.getElementById("canvas");
	    
		if ($scope.canvas.getContext) {
			$scope.context = $scope.canvas.getContext("2d");
		}
	}

	$scope.initCanvas();

	$scope.points = [];	
	$scope.canvasPoints = [];	
 	
	// ------------------------------------------------

	$scope.processIncomingMapData = function(mapData) {

		console.log('makeGetMapCall - ajax return');

		var trackName = mapData.name;
		console.log(mapData.name);

		var segmentCount = mapData.segments.length;
		console.log(segmentCount + ' segments');

		console.log('parsing points');

		$scope.points.length = 0;

		for(var i in mapData.segments) {

			seg = mapData.segments[i];

			for(var j in seg.points) {
				var pointString = seg.points[j];
				var datum = pointString.split("|")		

				// 2014-10-26 11:06:15|-25.938111|27.592123|1329.160000
				// time, lat, lon, ele

				//var timeStr = datum[0];

				var lat = parseFloat(datum[0]);
				var lon = parseFloat(datum[1]);
				var ele = parseFloat(datum[2]);

				$scope.points.push([lat,lon,ele]);
			}
		}	

		console.log('point count = ' + $scope.points.length);

		var p = $scope.points[0];
		console.log('point @ lat, lon = ', p[0], p[1]);

		var getMinMax = function(seriesArray, seriesIndex) {

			var max = undefined;
			var min = undefined;

			for (var i = seriesArray.length - 1; i >= 0; i--) {
				
				var val = seriesArray[i][seriesIndex];

				if ((max == undefined) || (val > max)) { 
					max = val; 
				}
				if ((min == undefined) || (val < min)) { 
					min = val; 
				}
			};

			return { 'max' : max, 'min' : min };
		}		

		var minMaxLat = getMinMax($scope.points, 0);
		var minMaxLon = getMinMax($scope.points, 1);
		var minMaxEle = getMinMax($scope.points, 2);

		var latDiff = minMaxLat.max - minMaxLat.min;
		var lonDiff = minMaxLon.max - minMaxLon.min;
		var latlonAR = lonDiff / latDiff;

		// --------------------------------------

		var logMinMax = function(token, minMax) {
			console.log(token);
			console.log('min @ ' + minMax.min);
			console.log('max @ ' + minMax.max);
		};

		logMinMax('LAT', minMaxLat);
		logMinMax('LON', minMaxLon);
		logMinMax('ELE', minMaxEle);		

		// --------------------------------------

		// viewport

		var viewPortHeight = 500.0;
		var viewPortWidth = 800.0;

		var vpHalfHeight = viewPortHeight / 2.0;
		var vpHalfWidth  = viewPortWidth / 2.0;

		var vpAR = viewPortWidth / viewPortHeight;

		var scale = undefined;
		if (latlonAR <= vpAR) {
			// too tall, use y to scale
			scale = viewPortHeight / latDiff;
		}
		else
		{
			// too wide, use x to scale
			scale = viewPortWidth / lonDiff;
		}

		var midLat = 0.5 * (minMaxLat.max + minMaxLat.min);
		var midLon = 0.5 * (minMaxLon.max + minMaxLon.min);

		var transformPoint = function(lat, lon) {

			// translate to center around origin
			var centeredLat = lat - midLat;
			var centeredLon = lon - midLon;

			// scale
			var scaledX = centeredLon * scale;
			var scaledY = centeredLat * scale;

			// translate to viewpoint center
			var x = vpHalfWidth + scaledX;
			var y = vpHalfHeight - scaledY;

			return { 'x' : x, 'y' : y };
		};

		$scope.canvasPoints.length = 0;

		for(var i in $scope.points) {
			var xy = transformPoint($scope.points[i][0], $scope.points[i][1]);
			$scope.canvasPoints.push(xy);
		}

		// draw to canvas
		$scope.context.fillStyle = '#FFFFFF';
  		$scope.context.fillRect(0,0,viewPortWidth,viewPortHeight);
		//$scope.context.fillRect(0, 0, $scope.viewPortWidth-5, $scope.viewPortHeight-5;

		$scope.context.fillStyle = '#000000';
		$scope.context.beginPath();
	    for (var i in $scope.canvasPoints) {	
	    	var pt = $scope.canvasPoints[i];
    		$scope.context.fillRect(pt.x, pt.y, 3, 3);
	    };	    

        $scope.context.stroke();
	};

	// ------------------------------------------------

	$scope.mapList = [];
	$scope.mapSearchToken = '';
	$scope.filteredMapList = [];
	$scope.selectedMap = [];

	$scope.makeGetMapCall = function(id) {

		console.log('makeGetMapCall - ajax');

		$http(
			{
				headers: { "Content-Type": "charset=utf-8" },
				method: 'GET',
				url: '/map/get/' + id,
			}
			).success(
				function(data) {
					$scope.globalState = $scope.processingState;
					$scope.processIncomingMapData(data);							
				}
			).error(
				function(error){
					console.log('error');
			    	$scope.error = error;
				}
			);
	};

	$scope.loadSelectedMap = function(){

		if (($scope.selectedMap == undefined) || ($scope.selectedMap.length == 0)) {
		}
		else {
			$scope.makeGetMapCall($scope.selectedMap[0].id);		
		}
	};

	$scope.loadMapList = function(mapList) {

		$scope.mapList.length = 0;
		$scope.filteredMapList.length = 0;

		for(var i in mapList){
			$scope.mapList.push(mapList[i]);
			$scope.filteredMapList.push(mapList[i]);
		}
	};

	$scope.getAndLoadMapList = function() {

		$http(
			{
				url: "/maps/get/",
				headers: { "Content-Type": "charset=utf-8" }
			}
			).success(
				function(response) {
					$scope.loadMapList(response.maps);				
				}
			).error(
				function(error){
					console.log('error');
			    	$scope.error = error;
				}
			);
	};

	$scope.onMapSearchTokenChanged = function() {

		matches = [];

		// filter
		for(var i in $scope.mapList) {
			if ($scope.mapList[i].name.toUpperCase().indexOf($scope.mapSearchToken.toUpperCase()) !== -1) {
				matches.push($scope.mapList[i]);
			}
		}

		// sort
		matches.sort(function(a, b) { return a > b; });

		// update fitered map list

		$scope.filteredMapList.length = 0;

		if (matches.length > 0) {
			
			for(var i in matches) {
				$scope.filteredMapList.push(matches[i]);
			}
		}

		// update selected map / autop-select map

		var tokenIsBlank = ($scope.mapSearchToken == '') 
			|| ($scope.mapSearchToken == undefined); 

		$scope.selectedMap.length = 0;

		if (
			(tokenIsBlank)
			|| ($scope.filteredMapList == undefined)
			|| ($scope.filteredMapList.length == 0)
			) {
			
		}
		else {
			$scope.selectedMap.length = 0;
			$scope.selectedMap.push($scope.filteredMapList[0]); 		
		}

	};

	$scope.getAndLoadMapList();
});
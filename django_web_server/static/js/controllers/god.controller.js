function GodController($rootScope, $scope, $http, $timeout) {

	$scope.model = new DataModel('/static/');

	$scope.dataModelIsLoaded = false;

	// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
	// VIEWS	

	$scope.nlIsActive = function(view) {
		
		if ($scope.view === view)
			return true;

		if ($scope.view === Views.PROPERTY) {
			return ($scope.model.categoryForView(view) == $scope.model.selectedProperty.category)
		}

		return false;
	}

	$scope.Views = Views;
	$scope.view = Views.HOME;

	$scope.showView= function(view) {
		return ($scope.view === view);
	};

	$scope.gotoView = function(newView) {
		$scope.view = newView;	
	
		var bindWindow = function () {

			// focus on element marked with data-focus-element attribute 
			// 
			$scope.giveActiveViewFocus();

			// ui-grids only display correctly after this event if
			// initially rendered off-screen
			//
			//var evt = document.createEvent('HTMLEvents');
			//evt.initEvent('resize', true, false);
			//window.dispatchEvent(evt);
		};

		$timeout(bindWindow, 100);
	};

	$rootScope.$on(Command.GOTO_VIEW, function(evt, view) { 
		$scope.gotoView(view);
	});

	$rootScope.$on(Event.DEBUG_ERROR, function(evt, error) {
		$scope.globalDebug(error);
	});

	$scope.giveActiveViewFocus = function() {
		
		// data-focus-element

		var views = document
			.getElementById('viewport')
			.childNodes;

		for(var i = 0; i < views.length; i++) {

			var className = views[i].className;

			if (className !== undefined) {
				if ((' ' + className + ' ').indexOf(' ' + 'ng-hide' + ' ') == -1) {

					var q =  '[' + 'data-focus-element' + ']';
					var focusElement = views[i].querySelector(q);
					if (focusElement)
						focusElement.focus();
				}
			}
		}
	};

	// WINDOW / LAYOUT ----------------------------------------

	$scope.getWindowDimensions = function() {

		var navbar = document.getElementById('navbar');
		var fudge = navbar.parentNode.offsetHeight + 10;

		var dims = {
			height : window.innerHeight - fudge, 
			width : document.body.offsetWidth
		};

		return dims;
	};

	// -----------------------------------------------------------------
	// LOAD DATA MODEL

	$scope.loaded = false;
	$scope.isLoaded = function() {
		return $scope.loaded;
	}

	$scope.loadDataModel = function() {

		var request = 
		{
			method: 'GET',
			url: "/static/data/datamodel.json?guid=" + guid(),
		};

		function handleSuccess(response) { 

			// load properties
			//
			response.properties.forEach(function(x){
				$scope.model.properties.push(x);
			});

			$scope.model.contacts = response.contacts;

			function onFontsLoaded() {
				console.log('fonts are loaded');
				$scope.loaded = true;
				//$timeout(function(){  console.log('show'); })
			};

			console.log('waiting for font load');
			waitForWebfonts(['Open Sans'], onFontsLoaded);
		};

		function handleError(response) { 

			console.log(response);
		};

		$http(request)
			.success(handleSuccess)
			.error(handleError);
	};

	// -----------------------------------------------------------------

	$scope.viewProperty = function(property) {
		$scope.model.selectProperty(property);
		$scope.gotoView(Views.PROPERTY);
	}

	// -----------------------------------------------------------------

	$scope.mailToHref = function(toAddr, subject) {
		return 'mailto:' + toAddr + '?Subject=' + encodeURIComponent(subject);
	};

	$scope.enquireAfterPriceOfSelectedProperty = function() {

		var category = $scope.model.selectedProperty['category'];

		var contactsForCategory = [];
		$scope.model.contacts.forEach(function(contact){
			if (contact.categories.indexOf(category) !== -1) {
				contactsForCategory.push(contact);
			}
		});

		if (contactsForCategory.length == 0) {
			contactsForCategory.push($scope.model.contacts[0]);
		}

		var href = $scope.mailToHref(contactsForCategory[0]['email'], $scope.model.selectedProperty['name']);
		window.open(href, '_blank');
	};

	$scope.viewStandDetail = function(stand) {
		$scope.model.selectStand(stand);
		$scope.modalController.openModal();
	};

	// -----------------------------------------------------------------

	$scope.openUrlInNewWindow = function(url) {
		window.open(url, '_blank');
	}

	$scope.openFacebook = function() {
		$scope.openUrlInNewWindow('https://www.facebook.com');
	};

	$scope.openTwitter = function() {
		$scope.openUrlInNewWindow('https://www.twitter.com');
	};

	$scope.openLinkedIn = function() {
		$scope.openUrlInNewWindow('https://www.linkedin.com');
	};

	// -----------------------------------------------------------------
	// INIT

	$scope.loadDataModel();
};
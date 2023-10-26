angular.module('page', ["ideUI", "ideView", "entityApi"])
	.config(["messageHubProvider", function (messageHubProvider) {
		messageHubProvider.eventIdPrefix = 'codbex-currencies.Currencies.CurrencyExchange';
	}])
	.config(["entityApiProvider", function (entityApiProvider) {
		entityApiProvider.baseUrl = "/services/js/codbex-currencies/gen/api/Currencies/CurrencyExchange.js";
	}])
	.controller('PageController', ['$scope', '$http', 'messageHub', 'entityApi', function ($scope, $http, messageHub, entityApi) {

		function resetPagination() {
			$scope.dataPage = 1;
			$scope.dataCount = 0;
			$scope.dataLimit = 20;
		}
		resetPagination();

		//-----------------Events-------------------//
		messageHub.onDidReceiveMessage("entityCreated", function (msg) {
			$scope.loadPage($scope.dataPage);
		});

		messageHub.onDidReceiveMessage("entityUpdated", function (msg) {
			$scope.loadPage($scope.dataPage);
		});
		//-----------------Events-------------------//

		$scope.loadPage = function (pageNumber) {
			$scope.dataPage = pageNumber;
			entityApi.count().then(function (response) {
				if (response.status != 200) {
					messageHub.showAlertError("CurrencyExchange", `Unable to count CurrencyExchange: '${response.message}'`);
					return;
				}
				$scope.dataCount = response.data;
				let offset = (pageNumber - 1) * $scope.dataLimit;
				let limit = $scope.dataLimit;
				entityApi.list(offset, limit).then(function (response) {
					if (response.status != 200) {
						messageHub.showAlertError("CurrencyExchange", `Unable to list CurrencyExchange: '${response.message}'`);
						return;
					}

					response.data.forEach(e => {
						if (e.Date) {
							e.Date = new Date(e.Date);
						}
					});

					$scope.data = response.data;
				});
			});
		};
		$scope.loadPage($scope.dataPage);

		$scope.selectEntity = function (entity) {
			$scope.selectedEntity = entity;
		};

		$scope.openDetails = function (entity) {
			$scope.selectedEntity = entity;
			messageHub.showDialogWindow("CurrencyExchange-details", {
				action: "select",
				entity: entity,
				optionsSource: $scope.optionsSource,
				optionsTarget: $scope.optionsTarget,
			});
		};

		$scope.createEntity = function () {
			$scope.selectedEntity = null;
			messageHub.showDialogWindow("CurrencyExchange-details", {
				action: "create",
				entity: {},
				optionsSource: $scope.optionsSource,
				optionsTarget: $scope.optionsTarget,
			}, null, false);
		};

		$scope.updateEntity = function (entity) {
			messageHub.showDialogWindow("CurrencyExchange-details", {
				action: "update",
				entity: entity,
				optionsSource: $scope.optionsSource,
				optionsTarget: $scope.optionsTarget,
			}, null, false);
		};

		$scope.deleteEntity = function (entity) {
			let id = entity.Id;
			messageHub.showDialogAsync(
				'Delete CurrencyExchange?',
				`Are you sure you want to delete CurrencyExchange? This action cannot be undone.`,
				[{
					id: "delete-btn-yes",
					type: "emphasized",
					label: "Yes",
				},
				{
					id: "delete-btn-no",
					type: "normal",
					label: "No",
				}],
			).then(function (msg) {
				if (msg.data === "delete-btn-yes") {
					entityApi.delete(id).then(function (response) {
						if (response.status != 204) {
							messageHub.showAlertError("CurrencyExchange", `Unable to delete CurrencyExchange: '${response.message}'`);
							return;
						}
						$scope.loadPage($scope.dataPage);
						messageHub.postMessage("clearDetails");
					});
				}
			});
		};

		//----------------Dropdowns-----------------//
		$scope.optionsSource = [];
		$scope.optionsTarget = [];

		$http.get("/services/js/codbex-currencies/gen/api/Currencies/Currency.js").then(function (response) {
			$scope.optionsSource = response.data.map(e => {
				return {
					value: e.Code,
					text: e.Name
				}
			});
		});

		$http.get("/services/js/codbex-currencies/gen/api/Currencies/Currency.js").then(function (response) {
			$scope.optionsTarget = response.data.map(e => {
				return {
					value: e.Code,
					text: e.Name
				}
			});
		});
		$scope.optionsSourceValue = function (optionKey) {
			for (let i = 0; i < $scope.optionsSource.length; i++) {
				if ($scope.optionsSource[i].value === optionKey) {
					return $scope.optionsSource[i].text;
				}
			}
			return null;
		};
		$scope.optionsTargetValue = function (optionKey) {
			for (let i = 0; i < $scope.optionsTarget.length; i++) {
				if ($scope.optionsTarget[i].value === optionKey) {
					return $scope.optionsTarget[i].text;
				}
			}
			return null;
		};
		//----------------Dropdowns-----------------//

	}]);

angular.module('page', ['blimpKit', 'platformView', 'platformLocale', 'EntityService'])
	.config(['EntityServiceProvider', (EntityServiceProvider) => {
		EntityServiceProvider.baseUrl = '/services/ts/codbex-currencies/gen/codbex-currencies/api/Settings/CurrencyRateController.ts';
	}])
	.controller('PageController', ($scope, $http, EntityService, Extensions, LocaleService, ButtonStates) => {
		const Dialogs = new DialogHub();
		let translated = {
			yes: 'Yes',
			no: 'No',
			deleteConfirm: 'Are you sure you want to delete CurrencyRate? This action cannot be undone.',
			deleteTitle: 'Delete CurrencyRate?'
		};

		LocaleService.onInit(() => {
			translated.yes = LocaleService.t('codbex-currencies:codbex-currencies-model.defaults.yes');
			translated.no = LocaleService.t('codbex-currencies:codbex-currencies-model.defaults.no');
			translated.deleteTitle = LocaleService.t('codbex-currencies:codbex-currencies-model.defaults.deleteTitle', { name: '$t(codbex-currencies:codbex-currencies-model.t.CURRENCYRATE)' });
			translated.deleteConfirm = LocaleService.t('codbex-currencies:codbex-currencies-model.messages.deleteConfirm', { name: '$t(codbex-currencies:codbex-currencies-model.t.CURRENCYRATE)' });
		});

		$scope.dataPage = 1;
		$scope.dataCount = 0;
		$scope.dataLimit = 20;

		//-----------------Custom Actions-------------------//
		Extensions.getWindows(['codbex-currencies-custom-action']).then((response) => {
			$scope.pageActions = response.data.filter(e => e.perspective === 'Settings' && e.view === 'CurrencyRate' && (e.type === 'page' || e.type === undefined));
			$scope.entityActions = response.data.filter(e => e.perspective === 'Settings' && e.view === 'CurrencyRate' && e.type === 'entity');
		});

		$scope.triggerPageAction = (action) => {
			Dialogs.showWindow({
				hasHeader: true,
        		title: LocaleService.t(action.translation.key, action.translation.options, action.label),
				path: action.path,
				maxWidth: action.maxWidth,
				maxHeight: action.maxHeight,
				closeButton: true
			});
		};

		$scope.triggerEntityAction = (action) => {
			Dialogs.showWindow({
				hasHeader: true,
        		title: LocaleService.t(action.translation.key, action.translation.options, action.label),
				path: action.path,
				params: {
					id: $scope.entity.Id
				},
				closeButton: true
			});
		};
		//-----------------Custom Actions-------------------//

		function resetPagination() {
			$scope.dataPage = 1;
			$scope.dataCount = 0;
			$scope.dataLimit = 20;
		}
		resetPagination();

		//-----------------Events-------------------//
		Dialogs.addMessageListener({ topic: 'codbex-currencies.Settings.CurrencyRate.entityCreated', handler: () => {
			$scope.loadPage($scope.dataPage, $scope.filter);
		}});
		Dialogs.addMessageListener({ topic: 'codbex-currencies.Settings.CurrencyRate.entityUpdated', handler: () => {
			$scope.loadPage($scope.dataPage, $scope.filter);
		}});
		Dialogs.addMessageListener({ topic: 'codbex-currencies.Settings.CurrencyRate.entitySearch', handler: (data) => {
			resetPagination();
			$scope.filter = data.filter;
			$scope.filterEntity = data.entity;
			$scope.loadPage($scope.dataPage, $scope.filter);
		}});
		//-----------------Events-------------------//

		$scope.loadPage = (pageNumber, filter) => {
			if (!filter && $scope.filter) {
				filter = $scope.filter;
			}
			$scope.dataPage = pageNumber;
			EntityService.count(filter).then((resp) => {
				if (resp.data) {
					$scope.dataCount = resp.data.count;
				}
				let offset = (pageNumber - 1) * $scope.dataLimit;
				let limit = $scope.dataLimit;
				let request;
				if (filter) {
					if (!filter.$filter) {
						filter.$filter = {};
					}
					filter.$filter.offset = offset;
					filter.$filter.limit = limit;
					request = EntityService.search(filter);
				} else {
					request = EntityService.list(offset, limit);
				}
				request.then((response) => {
					response.data.forEach(e => {
						if (e.Date) {
							e.Date = new Date(e.Date);
						}
					});

					$scope.data = response.data;
				}, (error) => {
					const message = error.data ? error.data.message : '';
					Dialogs.showAlert({
						title: LocaleService.t('codbex-currencies:codbex-currencies-model.t.CURRENCYRATE'),
						message: LocaleService.t('codbex-currencies:codbex-currencies-model.messages.error.unableToLF', { name: '$t(codbex-currencies:codbex-currencies-model.t.CURRENCYRATE)', message: message }),
						type: AlertTypes.Error
					});
					console.error('EntityService:', error);
				});
			}, (error) => {
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: LocaleService.t('codbex-currencies:codbex-currencies-model.t.CURRENCYRATE'),
					message: LocaleService.t('codbex-currencies:codbex-currencies-model.messages.error.unableToCount', { name: '$t(codbex-currencies:codbex-currencies-model.t.CURRENCYRATE)', message: message }),
					type: AlertTypes.Error
				});
				console.error('EntityService:', error);
			});
		};
		$scope.loadPage($scope.dataPage, $scope.filter);

		$scope.selectEntity = (entity) => {
			$scope.selectedEntity = entity;
		};

		$scope.openDetails = (entity) => {
			$scope.selectedEntity = entity;
			Dialogs.showWindow({
				id: 'CurrencyRate-details',
				params: {
					action: 'select',
					entity: entity,
					optionsCurrency: $scope.optionsCurrency,
				},
				closeButton: true,
			});
		};

		$scope.openFilter = () => {
			Dialogs.showWindow({
				id: 'CurrencyRate-filter',
				params: {
					entity: $scope.filterEntity,
					optionsCurrency: $scope.optionsCurrency,
				},
				closeButton: true,
			});
		};

		$scope.createEntity = () => {
			$scope.selectedEntity = null;
			Dialogs.showWindow({
				id: 'CurrencyRate-details',
				params: {
					action: 'create',
					entity: {},
					optionsCurrency: $scope.optionsCurrency,
				},
				closeButton: false,
			});
		};

		$scope.updateEntity = (entity) => {
			Dialogs.showWindow({
				id: 'CurrencyRate-details',
				params: {
					action: 'update',
					entity: entity,
					optionsCurrency: $scope.optionsCurrency,
				},
				closeButton: false,
			});
		};

		$scope.deleteEntity = (entity) => {
			let id = entity.Id;
			Dialogs.showDialog({
				title: translated.deleteTitle,
				message: translated.deleteConfirm,
				buttons: [{
					id: 'delete-btn-yes',
					state: ButtonStates.Emphasized,
					label: translated.yes,
				}, {
					id: 'delete-btn-no',
					label: translated.no,
				}]
			}).then((buttonId) => {
				if (buttonId === 'delete-btn-yes') {
					EntityService.delete(id).then((response) => {
						$scope.loadPage($scope.dataPage, $scope.filter);
						Dialogs.triggerEvent('codbex-currencies.Settings.CurrencyRate.clearDetails');
					}, (error) => {
						const message = error.data ? error.data.message : '';
						Dialogs.showAlert({
							title: LocaleService.t('codbex-currencies:codbex-currencies-model.t.CURRENCYRATE'),
							message: LocaleService.t('codbex-currencies:codbex-currencies-model.messages.error.unableToDelete', { name: '$t(codbex-currencies:codbex-currencies-model.t.CURRENCYRATE)', message: message }),
							type: AlertTypes.Error
						});
						console.error('EntityService:', error);
					});
				}
			});
		};

		//----------------Dropdowns-----------------//
		$scope.optionsCurrency = [];


		$http.get('/services/ts/codbex-currencies/gen/codbex-currencies/api/Settings/CurrencyController.ts').then((response) => {
			$scope.optionsCurrency = response.data.map(e => ({
				value: e.Id,
				text: e.Code
			}));
		}, (error) => {
			console.error(error);
			const message = error.data ? error.data.message : '';
			Dialogs.showAlert({
				title: 'Currency',
				message: LocaleService.t('codbex-currencies:codbex-currencies-model.messages.error.unableToLoad', { message: message }),
				type: AlertTypes.Error
			});
		});

		$scope.optionsCurrencyValue = (optionKey) => {
			for (let i = 0; i < $scope.optionsCurrency.length; i++) {
				if ($scope.optionsCurrency[i].value === optionKey) {
					return $scope.optionsCurrency[i].text;
				}
			}
			return null;
		};
		//----------------Dropdowns-----------------//

	});
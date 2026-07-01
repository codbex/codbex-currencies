angular.module('page', ['blimpKit', 'platformView', 'platformLocale', 'EntityService'])
	.config(['EntityServiceProvider', (EntityServiceProvider) => {
		EntityServiceProvider.baseUrl = '/services/java/codbex-currencies/gen/codbex_currencies/api/settings/CurrencyRateController';
	}])
	.controller('PageController', ($scope, $http, ViewParameters, LocaleService, EntityService) => {
		const Dialogs = new DialogHub();
		const Notifications = new NotificationHub();
		let description = 'Description';
		let propertySuccessfullyCreated = 'CurrencyRate successfully created';
		let propertySuccessfullyUpdated = 'CurrencyRate successfully updated';

		$scope.entity = {};
		$scope.forms = {
			details: {},
		};
		$scope.formHeaders = {
			select: 'CurrencyRate Details',
			create: 'Create CurrencyRate',
			update: 'Update CurrencyRate'
		};
		$scope.action = 'select';

		LocaleService.onInit(() => {
			description = LocaleService.t('codbex-currencies:codbex-currencies-model.defaults.description');
			$scope.formHeaders.select = LocaleService.t('codbex-currencies:codbex-currencies-model.defaults.formHeadSelect', { name: '$t(codbex-currencies:codbex-currencies-model.t.CURRENCYRATE)' });
			$scope.formHeaders.create = LocaleService.t('codbex-currencies:codbex-currencies-model.defaults.formHeadCreate', { name: '$t(codbex-currencies:codbex-currencies-model.t.CURRENCYRATE)' });
			$scope.formHeaders.update = LocaleService.t('codbex-currencies:codbex-currencies-model.defaults.formHeadUpdate', { name: '$t(codbex-currencies:codbex-currencies-model.t.CURRENCYRATE)' });
			propertySuccessfullyCreated = LocaleService.t('codbex-currencies:codbex-currencies-model.messages.propertySuccessfullyCreated', { name: '$t(codbex-currencies:codbex-currencies-model.t.CURRENCYRATE)' });
			propertySuccessfullyUpdated = LocaleService.t('codbex-currencies:codbex-currencies-model.messages.propertySuccessfullyUpdated', { name: '$t(codbex-currencies:codbex-currencies-model.t.CURRENCYRATE)' });
		});

		let params = ViewParameters.get();
		if (Object.keys(params).length) {
			$scope.action = params.action;
			if (params.entity.Date) {
				params.entity.Date = new Date(params.entity.Date);
			}
			if (params.entity.CreatedAt) {
				params.entity.CreatedAt = new Date(params.entity.CreatedAt);
			}
			if (params.entity.UpdatedAt) {
				params.entity.UpdatedAt = new Date(params.entity.UpdatedAt);
			}
			$scope.entity = params.entity;
			$scope.selectedMainEntityKey = params.selectedMainEntityKey;
			$scope.selectedMainEntityId = params.selectedMainEntityId;
			const optionsCurrencyMap = new Map();
			params.optionsCurrency?.forEach(e => optionsCurrencyMap.set(e.value, e));
			$scope.optionsCurrency = Array.from(optionsCurrencyMap.values());
		}

		$scope.create = () => {
			let entity = $scope.entity;
			entity[$scope.selectedMainEntityKey] = $scope.selectedMainEntityId;
			EntityService.create(entity).then((response) => {
				Dialogs.postMessage({ topic: 'codbex-currencies.Settings.CurrencyRate.entityCreated', data: response.data });
				Notifications.show({
					title: LocaleService.t('codbex-currencies:codbex-currencies-model.t.CURRENCYRATE'),
					description: propertySuccessfullyCreated,
					type: 'positive'
				});
				$scope.cancel();
			}, (error) => {
				const message = error.data ? error.data.message : '';
				$scope.$evalAsync(() => {
					$scope.errorMessage = LocaleService.t('codbex-currencies:codbex-currencies-model.messages.error.unableToCreate', { name: '$t(codbex-currencies:codbex-currencies-model.t.CURRENCYRATE)', message: message });
				});
				console.error('EntityService:', error);
			});
		};

		$scope.update = () => {
			let id = $scope.entity.Id;
			let entity = $scope.entity;
			entity[$scope.selectedMainEntityKey] = $scope.selectedMainEntityId;
			EntityService.update(id, entity).then((response) => {
				Dialogs.postMessage({ topic: 'codbex-currencies.Settings.CurrencyRate.entityUpdated', data: response.data });
				Notifications.show({
					title: LocaleService.t('codbex-currencies:codbex-currencies-model.t.CURRENCYRATE'),
					description: propertySuccessfullyUpdated,
					type: 'positive'
				});
				$scope.cancel();
			}, (error) => {
				const message = error.data ? error.data.message : '';
				$scope.$evalAsync(() => {
					$scope.errorMessage = LocaleService.t('codbex-currencies:codbex-currencies-model.messages.error.unableToUpdate', { name: '$t(codbex-currencies:codbex-currencies-model.t.CURRENCYRATE)', message: message });
				});
				console.error('EntityService:', error);
			});
		};

		$scope.serviceCurrency = '/services/java/codbex-currencies/gen/codbex_currencies/api/settings/CurrencyController';
		
		$scope.optionsCurrency = [];
		
		$http.get('/services/java/codbex-currencies/gen/codbex_currencies/api/settings/CurrencyController').then((response) => {
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

		const lastSearchValuesCurrency = new Set();
		const allValuesCurrency = [];
		let loadMoreOptionsCurrencyCounter = 0;
		$scope.optionsCurrencyLoading = false;
		$scope.optionsCurrencyHasMore = true;

		$scope.loadMoreOptionsCurrency = () => {
			const limit = 20;
			$scope.optionsCurrencyLoading = true;
			$http.get(`/services/java/codbex-currencies/gen/codbex_currencies/api/settings/CurrencyController?$limit=${limit}&$offset=${++loadMoreOptionsCurrencyCounter * limit}`)
			.then((response) => {
				const optionValues = allValuesCurrency.map(e => e.value);
				const resultValues = response.data.map(e => ({
					value: e.Id,
					text: e.Code
				}));
				const newValues = [];
				resultValues.forEach(e => {
					if (!optionValues.includes(e.value)) {
						allValuesCurrency.push(e);
						newValues.push(e);
					}
				});
				newValues.forEach(e => {
					if (!$scope.optionsCurrency.find(o => o.value === e.value)) {
						$scope.optionsCurrency.push(e);
					}
				})
				$scope.optionsCurrencyHasMore = resultValues.length > 0;
				$scope.optionsCurrencyLoading = false;
			}, (error) => {
				$scope.optionsCurrencyLoading = false;
				console.error(error);
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: 'Currency',
					message: LocaleService.t('codbex-currencies:codbex-currencies-model.messages.error.unableToLoad', { message: message }),
					type: AlertTypes.Error
				});
			});
		};

		$scope.onOptionsCurrencyChange = (event) => {
			if (allValuesCurrency.length === 0) {
				allValuesCurrency.push(...$scope.optionsCurrency);
			}
			if (event.originalEvent.target.value === '') {
				allValuesCurrency.sort((a, b) => a.text.localeCompare(b.text));
				$scope.optionsCurrency = allValuesCurrency;
				$scope.optionsCurrencyHasMore = true;
			} else if (isText(event.which)) {
				$scope.optionsCurrencyHasMore = false;
				let cacheHit = false;
				Array.from(lastSearchValuesCurrency).forEach(e => {
					if (event.originalEvent.target.value.startsWith(e)) {
						cacheHit = true;
					}
				})
				if (!cacheHit) {
					$http.post('/services/java/codbex-currencies/gen/codbex_currencies/api/settings/CurrencyController/search', {
						conditions: [
							{ propertyName: 'Code', operator: 'LIKE', value: `${event.originalEvent.target.value}%` }
						]
					}).then((response) => {
						const optionValues = allValuesCurrency.map(e => e.value);
						const searchResult = response.data.map(e => ({
							value: e.Id,
							text: e.Code
						}));
						searchResult.forEach(e => {
							if (!optionValues.includes(e.value)) {
								allValuesCurrency.push(e);
							}
						});
						$scope.optionsCurrency = allValuesCurrency.filter(e => e.text.toLowerCase().startsWith(event.originalEvent.target.value.toLowerCase()));
					}, (error) => {
						console.error(error);
						const message = error.data ? error.data.message : '';
						Dialogs.showAlert({
							title: 'Currency',
							message: LocaleService.t('codbex-currencies:codbex-currencies-model.messages.error.unableToLoad', { message: message }),
							type: AlertTypes.Error
						});
					});
					lastSearchValuesCurrency.add(event.originalEvent.target.value);
				}
			}
		};
		function isText(keycode) {
			if ((keycode >= 48 && keycode <= 90) || (keycode >= 96 && keycode <= 111) || (keycode >= 186 && keycode <= 222) || [8, 46, 173].includes(keycode)) return true;
			return false;
		}

		$scope.alert = (message) => {
			if (message) Dialogs.showAlert({
				title: description,
				message: message,
				type: AlertTypes.Information,
				preformatted: true,
			});
		};

		$scope.cancel = () => {
			$scope.entity = {};
			$scope.action = 'select';
			Dialogs.closeWindow({ id: 'CurrencyRate-details' });
		};

		$scope.clearErrorMessage = () => {
			$scope.errorMessage = null;
		};
	});
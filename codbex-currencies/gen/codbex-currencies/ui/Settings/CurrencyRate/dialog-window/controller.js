angular.module('page', ['blimpKit', 'platformView', 'platformLocale', 'EntityService'])
	.config(['EntityServiceProvider', (EntityServiceProvider) => {
		EntityServiceProvider.baseUrl = '/services/ts/codbex-currencies/gen/codbex-currencies/api/Settings/CurrencyRateService.ts';
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
			$scope.entity = params.entity;
			$scope.selectedMainEntityKey = params.selectedMainEntityKey;
			$scope.selectedMainEntityId = params.selectedMainEntityId;
			$scope.optionsCurrency = params.optionsCurrency;
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

		$scope.serviceCurrency = '/services/ts/codbex-currencies/gen/codbex-currencies/api/Settings/CurrencyService.ts';
		
		$scope.optionsCurrency = [];
		
		$http.get('/services/ts/codbex-currencies/gen/codbex-currencies/api/Settings/CurrencyService.ts').then((response) => {
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
angular.module('page', ['blimpKit', 'platformView', 'platformLocale', 'EntityService'])
	.config(['EntityServiceProvider', (EntityServiceProvider) => {
		EntityServiceProvider.baseUrl = '/services/ts/codbex-currencies/gen/codbex-currencies/api/Settings/CurrencyController.ts';
	}])
	.controller('PageController', ($scope, $http, ViewParameters, LocaleService, EntityService) => {
		const Dialogs = new DialogHub();
		const Notifications = new NotificationHub();
		let description = 'Description';
		let propertySuccessfullyCreated = 'Currency successfully created';
		let propertySuccessfullyUpdated = 'Currency successfully updated';

		$scope.entity = {};
		$scope.forms = {
			details: {},
		};
		$scope.formHeaders = {
			select: 'Currency Details',
			create: 'Create Currency',
			update: 'Update Currency'
		};
		$scope.action = 'select';

		LocaleService.onInit(() => {
			description = LocaleService.t('codbex-currencies:codbex-currencies-model.defaults.description');
			$scope.formHeaders.select = LocaleService.t('codbex-currencies:codbex-currencies-model.defaults.formHeadSelect', { name: '$t(codbex-currencies:codbex-currencies-model.t.CURRENCY)' });
			$scope.formHeaders.create = LocaleService.t('codbex-currencies:codbex-currencies-model.defaults.formHeadCreate', { name: '$t(codbex-currencies:codbex-currencies-model.t.CURRENCY)' });
			$scope.formHeaders.update = LocaleService.t('codbex-currencies:codbex-currencies-model.defaults.formHeadUpdate', { name: '$t(codbex-currencies:codbex-currencies-model.t.CURRENCY)' });
			propertySuccessfullyCreated = LocaleService.t('codbex-currencies:codbex-currencies-model.messages.propertySuccessfullyCreated', { name: '$t(codbex-currencies:codbex-currencies-model.t.CURRENCY)' });
			propertySuccessfullyUpdated = LocaleService.t('codbex-currencies:codbex-currencies-model.messages.propertySuccessfullyUpdated', { name: '$t(codbex-currencies:codbex-currencies-model.t.CURRENCY)' });
		});

		let params = ViewParameters.get();
		if (Object.keys(params).length) {
			$scope.action = params.action;
			$scope.entity = params.entity;
			$scope.selectedMainEntityKey = params.selectedMainEntityKey;
			$scope.selectedMainEntityId = params.selectedMainEntityId;
		}

		$scope.create = () => {
			let entity = $scope.entity;
			entity[$scope.selectedMainEntityKey] = $scope.selectedMainEntityId;
			EntityService.create(entity).then((response) => {
				Dialogs.postMessage({ topic: 'codbex-currencies.Settings.Currency.entityCreated', data: response.data });
				Notifications.show({
					title: LocaleService.t('codbex-currencies:codbex-currencies-model.t.CURRENCY'),
					description: propertySuccessfullyCreated,
					type: 'positive'
				});
				$scope.cancel();
			}, (error) => {
				const message = error.data ? error.data.message : '';
				$scope.$evalAsync(() => {
					$scope.errorMessage = LocaleService.t('codbex-currencies:codbex-currencies-model.messages.error.unableToCreate', { name: '$t(codbex-currencies:codbex-currencies-model.t.CURRENCY)', message: message });
				});
				console.error('EntityService:', error);
			});
		};

		$scope.update = () => {
			let id = $scope.entity.Id;
			let entity = $scope.entity;
			entity[$scope.selectedMainEntityKey] = $scope.selectedMainEntityId;
			EntityService.update(id, entity).then((response) => {
				Dialogs.postMessage({ topic: 'codbex-currencies.Settings.Currency.entityUpdated', data: response.data });
				Notifications.show({
					title: LocaleService.t('codbex-currencies:codbex-currencies-model.t.CURRENCY'),
					description: propertySuccessfullyUpdated,
					type: 'positive'
				});
				$scope.cancel();
			}, (error) => {
				const message = error.data ? error.data.message : '';
				$scope.$evalAsync(() => {
					$scope.errorMessage = LocaleService.t('codbex-currencies:codbex-currencies-model.messages.error.unableToUpdate', { name: '$t(codbex-currencies:codbex-currencies-model.t.CURRENCY)', message: message });
				});
				console.error('EntityService:', error);
			});
		};


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
			Dialogs.closeWindow({ id: 'Currency-details' });
		};

		$scope.clearErrorMessage = () => {
			$scope.errorMessage = null;
		};
	});
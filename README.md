# codbex-currencies
Currencies Management Application

### Model

![model](images/currencies-model.png)

### Application

#### Launchpad

![launchpad](images/currencies-launchpad.png)

#### Management

![management](images/currencies-management.png)

### Infrastructure

#### Build

	docker build -t codbex-currencies:1.0.0 .

#### Run

	docker run --name codbex-currencies -d -p 8080:8080 codbex-currencies:1.0.0

#### Clean

	docker rm codbex-currencies
const query = require("db/query");
const producer = require("messaging/producer");
const daoApi = require("db/dao");

let dao = daoApi.create({
	table: "CODBEX_CURRENCYEXCHANGE",
	properties: [
		{
			name: "Id",
			column: "CURRENCYEXCHANGE_ID",
			type: "INTEGER",
			id: true,
			autoIncrement: true,
		},
 {
			name: "Source",
			column: "CURRENCYEXCHANGE_SOURCE",
			type: "VARCHAR",
		},
 {
			name: "Target",
			column: "CURRENCYEXCHANGE_TARGET",
			type: "VARCHAR",
		},
 {
			name: "Rate",
			column: "CURRENCYEXCHANGE_RATE",
			type: "DOUBLE",
		},
 {
			name: "Date",
			column: "CURRENCYEXCHANGE_DATE",
			type: "TIMESTAMP",
		},
 {
			name: "Level",
			column: "CURRENCYEXCHANGE_LEVEL",
			type: "INTEGER",
		}
]
});

exports.list = function(settings) {
	return dao.list(settings);
};

exports.get = function(id) {
	return dao.find(id);
};

exports.create = function(entity) {
	let id = dao.insert(entity);
	triggerEvent("Create", {
		table: "CODBEX_CURRENCYEXCHANGE",
		key: {
			name: "Id",
			column: "CURRENCYEXCHANGE_ID",
			value: id
		}
	});
	return id;
};

exports.update = function(entity) {
	dao.update(entity);
	triggerEvent("Update", {
		table: "CODBEX_CURRENCYEXCHANGE",
		key: {
			name: "Id",
			column: "CURRENCYEXCHANGE_ID",
			value: entity.Id
		}
	});
};

exports.delete = function(id) {
	dao.remove(id);
	triggerEvent("Delete", {
		table: "CODBEX_CURRENCYEXCHANGE",
		key: {
			name: "Id",
			column: "CURRENCYEXCHANGE_ID",
			value: id
		}
	});
};

exports.count = function() {
	return dao.count();
};

exports.customDataCount = function() {
	let resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM ￯﾿ﾢ￯ﾾﾀ￯ﾾﾜCODBEX_tableName￯﾿ﾢ￯ﾾﾀ￯ﾾﾝ');
	if (resultSet !== null && resultSet[0] !== null) {
		if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
			return resultSet[0].COUNT;
		} else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
			return resultSet[0].count;
		}
	}
	return 0;
};

function triggerEvent(operation, data) {
	producer.queue("codbex-currencies/currencyexchange/CurrencyExchange/" + operation).send(JSON.stringify(data));
}
import { sql, query } from "@aerokit/sdk/db";
import { producer } from "@aerokit/sdk/messaging";
import { extensions } from "@aerokit/sdk/extensions";
import { dao as daoApi } from "@aerokit/sdk/db";
import { EntityUtils } from "../utils/EntityUtils";

export interface CurrencyRateEntity {
    readonly Id: number;
    Currency?: number;
    Date?: Date;
    Rate?: number;
}

export interface CurrencyRateCreateEntity {
    readonly Currency?: number;
    readonly Date?: Date;
    readonly Rate?: number;
}

export interface CurrencyRateUpdateEntity extends CurrencyRateCreateEntity {
    readonly Id: number;
}

export interface CurrencyRateEntityOptions {
    $filter?: {
        equals?: {
            Id?: number | number[];
            Currency?: number | number[];
            Date?: Date | Date[];
            Rate?: number | number[];
        };
        notEquals?: {
            Id?: number | number[];
            Currency?: number | number[];
            Date?: Date | Date[];
            Rate?: number | number[];
        };
        contains?: {
            Id?: number;
            Currency?: number;
            Date?: Date;
            Rate?: number;
        };
        greaterThan?: {
            Id?: number;
            Currency?: number;
            Date?: Date;
            Rate?: number;
        };
        greaterThanOrEqual?: {
            Id?: number;
            Currency?: number;
            Date?: Date;
            Rate?: number;
        };
        lessThan?: {
            Id?: number;
            Currency?: number;
            Date?: Date;
            Rate?: number;
        };
        lessThanOrEqual?: {
            Id?: number;
            Currency?: number;
            Date?: Date;
            Rate?: number;
        };
    },
    $select?: (keyof CurrencyRateEntity)[],
    $sort?: string | (keyof CurrencyRateEntity)[],
    $order?: 'ASC' | 'DESC',
    $offset?: number,
    $limit?: number,
    $language?: string
}

export interface CurrencyRateEntityEvent {
    readonly operation: 'create' | 'update' | 'delete';
    readonly table: string;
    readonly entity: Partial<CurrencyRateEntity>;
    readonly key: {
        name: string;
        column: string;
        value: number;
    }
}

export interface CurrencyRateUpdateEntityEvent extends CurrencyRateEntityEvent {
    readonly previousEntity: CurrencyRateEntity;
}

export class CurrencyRateRepository {

    private static readonly DEFINITION = {
        table: "CODBEX_CURRENCYRATE",
        properties: [
            {
                name: "Id",
                column: "CURRENCYRATE_ID",
                type: "INTEGER",
                id: true,
                autoIncrement: true,
            },
            {
                name: "Currency",
                column: "CURRENCYRATE_CURRENCY",
                type: "INTEGER",
            },
            {
                name: "Date",
                column: "CURRENCYRATE_DATE",
                type: "DATE",
            },
            {
                name: "Rate",
                column: "CURRENCYRATE_RATE",
                type: "DOUBLE",
            }
        ]
    };

    private readonly dao;

    constructor(dataSource = "DefaultDB") {
        this.dao = daoApi.create(CurrencyRateRepository.DEFINITION, undefined, dataSource);
    }

    public findAll(options: CurrencyRateEntityOptions = {}): CurrencyRateEntity[] {
        let list = this.dao.list(options).map((e: CurrencyRateEntity) => {
            EntityUtils.setDate(e, "Date");
            return e;
        });
        return list;
    }

    public findById(id: number, options: CurrencyRateEntityOptions = {}): CurrencyRateEntity | undefined {
        const entity = this.dao.find(id);
        EntityUtils.setDate(entity, "Date");
        return entity ?? undefined;
    }

    public create(entity: CurrencyRateCreateEntity): number {
        EntityUtils.setLocalDate(entity, "Date");
        const id = this.dao.insert(entity);
        this.triggerEvent({
            operation: "create",
            table: "CODBEX_CURRENCYRATE",
            entity: entity,
            key: {
                name: "Id",
                column: "CURRENCYRATE_ID",
                value: id
            }
        });
        return id;
    }

    public update(entity: CurrencyRateUpdateEntity): void {
        // EntityUtils.setLocalDate(entity, "Date");
        const previousEntity = this.findById(entity.Id);
        this.dao.update(entity);
        this.triggerEvent({
            operation: "update",
            table: "CODBEX_CURRENCYRATE",
            entity: entity,
            previousEntity: previousEntity,
            key: {
                name: "Id",
                column: "CURRENCYRATE_ID",
                value: entity.Id
            }
        });
    }

    public upsert(entity: CurrencyRateCreateEntity | CurrencyRateUpdateEntity): number {
        const id = (entity as CurrencyRateUpdateEntity).Id;
        if (!id) {
            return this.create(entity);
        }

        const existingEntity = this.findById(id);
        if (existingEntity) {
            this.update(entity as CurrencyRateUpdateEntity);
            return id;
        } else {
            return this.create(entity);
        }
    }

    public deleteById(id: number): void {
        const entity = this.dao.find(id);
        this.dao.remove(id);
        this.triggerEvent({
            operation: "delete",
            table: "CODBEX_CURRENCYRATE",
            entity: entity,
            key: {
                name: "Id",
                column: "CURRENCYRATE_ID",
                value: id
            }
        });
    }

    public count(options?: CurrencyRateEntityOptions): number {
        return this.dao.count(options);
    }

    public customDataCount(): number {
        const resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX_CURRENCYRATE"');
        if (resultSet !== null && resultSet[0] !== null) {
            if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
                return resultSet[0].COUNT;
            } else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
                return resultSet[0].count;
            }
        }
        return 0;
    }

    private async triggerEvent(data: CurrencyRateEntityEvent | CurrencyRateUpdateEntityEvent) {
        const triggerExtensions = await extensions.loadExtensionModules("codbex-currencies-Settings-CurrencyRate", ["trigger"]);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }            
        });
        producer.topic("codbex-currencies-Settings-CurrencyRate").send(JSON.stringify(data));
    }
}

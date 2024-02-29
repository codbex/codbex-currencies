import { query } from "sdk/db";
import { producer } from "sdk/messaging";
import { extensions } from "sdk/extensions";
import { dao as daoApi } from "sdk/db";
import { EntityUtils } from "../utils/EntityUtils";

export interface CurrencyRateEntity {
    readonly Id: number;
    Currency?: number;
    Date?: Date;
}

export interface CurrencyRateCreateEntity {
    readonly Currency?: number;
    readonly Date?: Date;
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
        };
        notEquals?: {
            Id?: number | number[];
            Currency?: number | number[];
            Date?: Date | Date[];
        };
        contains?: {
            Id?: number;
            Currency?: number;
            Date?: Date;
        };
        greaterThan?: {
            Id?: number;
            Currency?: number;
            Date?: Date;
        };
        greaterThanOrEqual?: {
            Id?: number;
            Currency?: number;
            Date?: Date;
        };
        lessThan?: {
            Id?: number;
            Currency?: number;
            Date?: Date;
        };
        lessThanOrEqual?: {
            Id?: number;
            Currency?: number;
            Date?: Date;
        };
    },
    $select?: (keyof CurrencyRateEntity)[],
    $sort?: string | (keyof CurrencyRateEntity)[],
    $order?: 'asc' | 'desc',
    $offset?: number,
    $limit?: number,
}

interface CurrencyRateEntityEvent {
    readonly operation: 'create' | 'update' | 'delete';
    readonly table: string;
    readonly entity: Partial<CurrencyRateEntity>;
    readonly key: {
        name: string;
        column: string;
        value: number;
    }
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
            }
        ]
    };

    private readonly dao;

    constructor(dataSource?: string) {
        this.dao = daoApi.create(CurrencyRateRepository.DEFINITION, null, dataSource);
    }

    public findAll(options?: CurrencyRateEntityOptions): CurrencyRateEntity[] {
        return this.dao.list(options).map((e: CurrencyRateEntity) => {
            EntityUtils.setDate(e, "Date");
            return e;
        });
    }

    public findById(id: number): CurrencyRateEntity | undefined {
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
        this.dao.update(entity);
        this.triggerEvent({
            operation: "update",
            table: "CODBEX_CURRENCYRATE",
            entity: entity,
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

    public customDataCount(options?: CurrencyRateEntityOptions): number {
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

    private async triggerEvent(data: CurrencyRateEntityEvent) {
        const triggerExtensions = await extensions.loadExtensionModules("codbex-currencies/Currencies/CurrencyRate", ["trigger"]);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }            
        });
        producer.topic("codbex-currencies/Currencies/CurrencyRate").send(JSON.stringify(data));
    }
}
import { Repository, EntityEvent, EntityConstructor, Options } from '@aerokit/sdk/db'
import { Component } from '@aerokit/sdk/component'
import { Producer } from '@aerokit/sdk/messaging'
import { Extensions } from '@aerokit/sdk/extensions'
import { CurrencyRateEntity } from './CurrencyRateEntity'

@Component('CurrencyRateRepository')
export class CurrencyRateRepository extends Repository<CurrencyRateEntity> {

    constructor() {
        super((CurrencyRateEntity as EntityConstructor));
    }

    public override findById(id: string | number, options?: Options): CurrencyRateEntity | undefined {
        const entity = super.findById(id, options);
        if (entity) {
            entity.Date = entity.Date ? new Date(entity.Date) : undefined;
            entity.CreatedAt = entity.CreatedAt ? new Date(entity.CreatedAt) : undefined;
            entity.UpdatedAt = entity.UpdatedAt ? new Date(entity.UpdatedAt) : undefined;
        }
        return entity;
    }

    public override findAll(options?: Options): CurrencyRateEntity[] {
        const entities = super.findAll(options);
        entities.forEach(entity => {
            entity.Date = entity.Date ? new Date(entity.Date) : undefined;
            entity.CreatedAt = entity.CreatedAt ? new Date(entity.CreatedAt) : undefined;
            entity.UpdatedAt = entity.UpdatedAt ? new Date(entity.UpdatedAt) : undefined;
        });
        return entities;
    }

    protected override async triggerEvent(data: EntityEvent<CurrencyRateEntity>): Promise<void> {
        const triggerExtensions = await Extensions.loadExtensionModules('codbex-currencies-Settings-CurrencyRate', ['trigger']);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }
        });
        Producer.topic('codbex-currencies-Settings-CurrencyRate').send(JSON.stringify(data));
    }
}

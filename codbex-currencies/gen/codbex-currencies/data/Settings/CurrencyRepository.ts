import { Repository, EntityEvent, EntityConstructor } from '@aerokit/sdk/db'
import { Component } from '@aerokit/sdk/component'
import { Producer } from '@aerokit/sdk/messaging'
import { Extensions } from '@aerokit/sdk/extensions'
import { CurrencyEntity } from './CurrencyEntity'

@Component('CurrencyRepository')
export class CurrencyRepository extends Repository<CurrencyEntity> {

    constructor() {
        super((CurrencyEntity as EntityConstructor));
    }

    protected override async triggerEvent(data: EntityEvent<CurrencyEntity>): Promise<void> {
        const triggerExtensions = await Extensions.loadExtensionModules('codbex-currencies-Settings-Currency', ['trigger']);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }
        });
        Producer.topic('codbex-currencies-Settings-Currency').send(JSON.stringify(data));
    }
}

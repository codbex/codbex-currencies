import { Repository, EntityEvent, EntityConstructor } from '@aerokit/sdk/db'
import { Component } from '@aerokit/sdk/component'
import { Producer } from '@aerokit/sdk/messaging'
import { Extensions } from '@aerokit/sdk/extensions'
import { CurrencyRateEntity } from './CurrencyRateEntity'

@Component('CurrencyRateRepository')
export class CurrencyRateRepository extends Repository<CurrencyRateEntity> {

    constructor() {
        super((CurrencyRateEntity as EntityConstructor));
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

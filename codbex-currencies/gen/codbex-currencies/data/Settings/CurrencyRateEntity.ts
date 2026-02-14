import { Entity, Table, Id, Generated, Column, Documentation } from '@aerokit/sdk/db'

@Entity('CurrencyRateEntity')
@Table('CODBEX_CURRENCYRATE')
@Documentation('CurrencyRate entity mapping')
export class CurrencyRateEntity {

    @Id()
    @Generated('sequence')
    @Documentation('Id')
    @Column({
        name: 'CURRENCYRATE_ID',
        type: 'integer',
    })
    public Id?: number;

    @Documentation('Currency')
    @Column({
        name: 'CURRENCYRATE_CURRENCY',
        type: 'integer',
        nullable: true,
    })
    public Currency?: number;

    @Documentation('Date')
    @Column({
        name: 'CURRENCYRATE_DATE',
        type: 'date',
        nullable: true,
    })
    public Date?: Date;

    @Documentation('Rate')
    @Column({
        name: 'CURRENCYRATE_RATE',
        type: 'double',
        nullable: true,
    })
    public Rate!: number;

}

(new CurrencyRateEntity());

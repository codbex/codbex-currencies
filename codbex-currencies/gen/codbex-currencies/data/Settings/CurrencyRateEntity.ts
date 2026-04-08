import { Entity, Table, Id, Generated, Column, Documentation, CreatedAt, CreatedBy, UpdatedAt, UpdatedBy} from '@aerokit/sdk/db'

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
    })
    public Currency!: number;

    @Documentation('Date')
    @Column({
        name: 'CURRENCYRATE_DATE',
        type: 'date',
    })
    public Date!: Date;

    @Documentation('Rate')
    @Column({
        name: 'CURRENCYRATE_RATE',
        type: 'double',
    })
    public Rate!: number;

    @Documentation('CreatedAt')
    @Column({
        name: 'CURRENCYRATE_CREATEDAT',
        type: 'timestamp',
        nullable: true,
    })
    @CreatedAt()
    public CreatedAt?: Date;

    @Documentation('CreatedBy')
    @Column({
        name: 'CURRENCYRATE_CREATEDBY',
        type: 'string',
        length: 20,
        nullable: true,
    })
    @CreatedBy()
    public CreatedBy?: string;

    @Documentation('UpdatedAt')
    @Column({
        name: 'CURRENCYRATE_UPDATEDAT',
        type: 'timestamp',
        nullable: true,
    })
    @UpdatedAt()
    public UpdatedAt?: Date;

    @Documentation('UpdatedBy')
    @Column({
        name: 'CURRENCYRATE_UPDATEDBY',
        type: 'string',
        length: 20,
        nullable: true,
    })
    @UpdatedBy()
    public UpdatedBy?: string;

}

(new CurrencyRateEntity());

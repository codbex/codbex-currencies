import { Entity, Table, Id, Generated, Column, Documentation, CreatedAt, CreatedBy, UpdatedAt, UpdatedBy} from '@aerokit/sdk/db'

@Entity('CurrencyEntity')
@Table('CODBEX_CURRENCY')
@Documentation('Currency entity mapping')
export class CurrencyEntity {

    @Id()
    @Generated('sequence')
    @Documentation('Id')
    @Column({
        name: 'CURRENCY_ID',
        type: 'integer',
    })
    public Id?: number;

    @Documentation('Code')
    @Column({
        name: 'CURRENCY_CODE',
        type: 'string',
        length: 3,
    })
    public Code!: string;

    @Documentation('Name')
    @Column({
        name: 'CURRENCY_NAME',
        type: 'string',
        length: 127,
    })
    public Name!: string;

    @Documentation('Numeric')
    @Column({
        name: 'CURRENCY_NUMERIC',
        type: 'string',
        length: 3,
    })
    public Numeric!: string;

    @Documentation('Rounding')
    @Column({
        name: 'CURRENCY_ROUNDING',
        type: 'integer',
    })
    public Rounding!: number;

    @Documentation('Base')
    @Column({
        name: 'CURRENCY_BASE',
        type: 'boolean',
        nullable: true,
    })
    public Base?: boolean;

    @Documentation('Rate')
    @Column({
        name: 'CURRENCY_RATE',
        type: 'double',
    })
    public Rate!: number;

}

(new CurrencyEntity());

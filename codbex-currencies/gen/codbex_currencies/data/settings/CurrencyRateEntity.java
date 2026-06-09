package gen.codbex_currencies.data.settings;

import org.eclipse.dirigible.engine.java.annotations.Column;
import org.eclipse.dirigible.engine.java.annotations.CreatedAt;
import org.eclipse.dirigible.engine.java.annotations.CreatedBy;
import org.eclipse.dirigible.engine.java.annotations.Documentation;
import org.eclipse.dirigible.engine.java.annotations.Entity;
import org.eclipse.dirigible.engine.java.annotations.GeneratedValue;
import org.eclipse.dirigible.engine.java.annotations.GenerationType;
import org.eclipse.dirigible.engine.java.annotations.Id;
import org.eclipse.dirigible.engine.java.annotations.Table;
import org.eclipse.dirigible.engine.java.annotations.UpdatedAt;
import org.eclipse.dirigible.engine.java.annotations.UpdatedBy;

@Entity
@Table(name = "CODBEX_CURRENCYRATE")
@Documentation("CurrencyRate entity mapping")
public class CurrencyRateEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CURRENCYRATE_ID")
    @Documentation("Id")
    public Integer Id;

    @Column(name = "CURRENCYRATE_CURRENCY", nullable = false)
    @Documentation("Currency")
    public Integer Currency;

    @Column(name = "CURRENCYRATE_DATE", nullable = false)
    @Documentation("Date")
    public java.time.LocalDate Date;

    @Column(name = "CURRENCYRATE_RATE", nullable = false)
    @Documentation("Rate")
    public Double Rate;

    @CreatedAt
    @Column(name = "CURRENCYRATE_CREATEDAT", nullable = true)
    @Documentation("CreatedAt")
    public java.time.Instant CreatedAt;

    @CreatedBy
    @Column(name = "CURRENCYRATE_CREATEDBY", length = 20, nullable = true)
    @Documentation("CreatedBy")
    public String CreatedBy;

    @UpdatedAt
    @Column(name = "CURRENCYRATE_UPDATEDAT", nullable = true)
    @Documentation("UpdatedAt")
    public java.time.Instant UpdatedAt;

    @UpdatedBy
    @Column(name = "CURRENCYRATE_UPDATEDBY", length = 20, nullable = true)
    @Documentation("UpdatedBy")
    public String UpdatedBy;

}

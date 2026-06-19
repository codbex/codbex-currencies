package gen.codbex_currencies.data.settings;

import org.eclipse.dirigible.sdk.db.Column;
import org.eclipse.dirigible.sdk.db.CreatedAt;
import org.eclipse.dirigible.sdk.db.CreatedBy;
import org.eclipse.dirigible.sdk.platform.Documentation;
import org.eclipse.dirigible.sdk.db.Entity;
import org.eclipse.dirigible.sdk.db.GeneratedValue;
import org.eclipse.dirigible.sdk.db.GenerationType;
import org.eclipse.dirigible.sdk.db.Id;
import org.eclipse.dirigible.sdk.db.Table;
import org.eclipse.dirigible.sdk.db.UpdatedAt;
import org.eclipse.dirigible.sdk.db.UpdatedBy;

@Entity
@Table(name = "CODBEX_CURRENCY")
@Documentation("Currency entity mapping")
public class CurrencyEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CURRENCY_ID")
    @Documentation("Id")
    public Integer Id;

    @Column(name = "CURRENCY_CODE", length = 3, nullable = false, unique = true)
    @Documentation("Code")
    public String Code;

    @Column(name = "CURRENCY_NAME", length = 127, nullable = false)
    @Documentation("Name")
    public String Name;

    @Column(name = "CURRENCY_NUMERIC", length = 3, nullable = false, unique = true)
    @Documentation("Numeric")
    public String Numeric;

    @Column(name = "CURRENCY_ROUNDING", nullable = false)
    @Documentation("Rounding")
    public Integer Rounding;

    @Column(name = "CURRENCY_BASE", nullable = true)
    @Documentation("Base")
    public Boolean Base;

    @Column(name = "CURRENCY_RATE", nullable = false)
    @Documentation("Rate")
    public Double Rate;

    @CreatedAt
    @Column(name = "CURRENCY_CREATEDAT", nullable = true)
    @Documentation("CreatedAt")
    public java.time.Instant CreatedAt;

    @CreatedBy
    @Column(name = "CURRENCY_CREATEDBY", length = 20, nullable = true)
    @Documentation("CreatedBy")
    public String CreatedBy;

    @UpdatedAt
    @Column(name = "CURRENCY_UPDATEDAT", nullable = true)
    @Documentation("UpdatedAt")
    public java.time.Instant UpdatedAt;

    @UpdatedBy
    @Column(name = "CURRENCY_UPDATEDBY", length = 20, nullable = true)
    @Documentation("UpdatedBy")
    public String UpdatedBy;

}

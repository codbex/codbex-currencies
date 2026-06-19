package gen.codbex_currencies.data.settings;

import org.eclipse.dirigible.components.data.store.java.repository.JavaRepository;
import org.eclipse.dirigible.sdk.component.Repository;

@Repository
public class CurrencyRateRepository extends JavaRepository<CurrencyRateEntity> {

    public CurrencyRateRepository() {
        super(CurrencyRateEntity.class);
    }
}

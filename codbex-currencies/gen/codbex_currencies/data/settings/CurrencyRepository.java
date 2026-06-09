package gen.codbex_currencies.data.settings;

import org.eclipse.dirigible.components.data.store.java.repository.JavaRepository;
import org.eclipse.dirigible.engine.java.annotations.Repository;

@Repository
public class CurrencyRepository extends JavaRepository<CurrencyEntity> {

    public CurrencyRepository() {
        super(CurrencyEntity.class);
    }
}

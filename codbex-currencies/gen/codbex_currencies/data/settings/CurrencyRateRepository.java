package gen.codbex_currencies.data.settings;

import org.eclipse.dirigible.components.data.store.java.repository.JavaRepository;
import org.eclipse.dirigible.sdk.component.Repository;
import org.eclipse.dirigible.sdk.messaging.Producer;
import org.eclipse.dirigible.sdk.utils.Json;

@Repository
public class CurrencyRateRepository extends JavaRepository<CurrencyRateEntity> {

    public CurrencyRateRepository() {
        super(CurrencyRateEntity.class);
    }

    @Override
    public CurrencyRateEntity save(CurrencyRateEntity entity) {
        CurrencyRateEntity saved = super.save(entity);
        // Publish the create event so listeners (e.g. intent process triggers / reactions under gen/events) can react.
        Producer.sendToTopic("codbex-currencies-Settings-CurrencyRate", Json.stringify(saved));
        return saved;
    }

    @Override
    public CurrencyRateEntity update(CurrencyRateEntity entity) {
        CurrencyRateEntity updated = super.update(entity);
        // Publish the update event (suffixed topic) so intent reactions under gen/events can react.
        Producer.sendToTopic("codbex-currencies-Settings-CurrencyRate-updated", Json.stringify(updated));
        return updated;
    }

    /**
     * Persists changes WITHOUT publishing the "-updated" event. Intended for system-managed
     * back-references — e.g. an intent process trigger writing ProcessId back onto the entity that
     * started it. Going through {@link #update} would re-publish "CurrencyRate-updated" and spuriously
     * re-fire onUpdate reactions (notifications, roll-ups, integrations) for a change the user never made.
     */
    public CurrencyRateEntity updateWithoutEvent(CurrencyRateEntity entity) {
        return super.update(entity);
    }

    @Override
    public void delete(CurrencyRateEntity entity) {
        super.delete(entity);
        // Publish the delete event (suffixed topic) so intent reactions under gen/events can react.
        Producer.sendToTopic("codbex-currencies-Settings-CurrencyRate-deleted", Json.stringify(entity));
    }

    @Override
    public void deleteById(Object id) {
        CurrencyRateEntity entity = findById(id);
        super.deleteById(id);
        if (entity != null) {
            Producer.sendToTopic("codbex-currencies-Settings-CurrencyRate-deleted", Json.stringify(entity));
        }
    }
}

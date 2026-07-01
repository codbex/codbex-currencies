package gen.codbex_currencies.data.settings;

import org.eclipse.dirigible.components.data.store.java.repository.JavaRepository;
import org.eclipse.dirigible.sdk.component.Repository;
import org.eclipse.dirigible.sdk.messaging.Producer;
import org.eclipse.dirigible.sdk.utils.Json;

@Repository
public class CurrencyRepository extends JavaRepository<CurrencyEntity> {

    public CurrencyRepository() {
        super(CurrencyEntity.class);
    }

    @Override
    public CurrencyEntity save(CurrencyEntity entity) {
        CurrencyEntity saved = super.save(entity);
        // Publish the create event so listeners (e.g. intent process triggers / reactions under gen/events) can react.
        Producer.sendToTopic("codbex-currencies-Settings-Currency", Json.stringify(saved));
        return saved;
    }

    @Override
    public CurrencyEntity update(CurrencyEntity entity) {
        CurrencyEntity updated = super.update(entity);
        // Publish the update event (suffixed topic) so intent reactions under gen/events can react.
        Producer.sendToTopic("codbex-currencies-Settings-Currency-updated", Json.stringify(updated));
        return updated;
    }

    /**
     * Persists changes WITHOUT publishing the "-updated" event. Intended for system-managed
     * back-references — e.g. an intent process trigger writing ProcessId back onto the entity that
     * started it. Going through {@link #update} would re-publish "Currency-updated" and spuriously
     * re-fire onUpdate reactions (notifications, roll-ups, integrations) for a change the user never made.
     */
    public CurrencyEntity updateWithoutEvent(CurrencyEntity entity) {
        return super.update(entity);
    }

    @Override
    public void delete(CurrencyEntity entity) {
        super.delete(entity);
        // Publish the delete event (suffixed topic) so intent reactions under gen/events can react.
        Producer.sendToTopic("codbex-currencies-Settings-Currency-deleted", Json.stringify(entity));
    }

    @Override
    public void deleteById(Object id) {
        CurrencyEntity entity = findById(id);
        super.deleteById(id);
        if (entity != null) {
            Producer.sendToTopic("codbex-currencies-Settings-Currency-deleted", Json.stringify(entity));
        }
    }
}

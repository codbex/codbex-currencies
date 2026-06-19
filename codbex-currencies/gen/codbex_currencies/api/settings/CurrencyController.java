package gen.codbex_currencies.api.settings;

import gen.codbex_currencies.data.settings.CurrencyEntity;
import gen.codbex_currencies.data.settings.CurrencyRepository;

import org.eclipse.dirigible.components.api.security.UserFacade;
import org.eclipse.dirigible.sdk.platform.Documentation;
import org.eclipse.dirigible.sdk.component.Inject;
import org.eclipse.dirigible.sdk.http.Body;
import org.eclipse.dirigible.sdk.http.Controller;
import org.eclipse.dirigible.sdk.http.Delete;
import org.eclipse.dirigible.sdk.http.Get;
import org.eclipse.dirigible.sdk.http.PathParam;
import org.eclipse.dirigible.sdk.http.Post;
import org.eclipse.dirigible.sdk.http.Put;
import org.eclipse.dirigible.sdk.http.QueryParam;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.Collection;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;

@Controller
@Documentation("codbex-currencies - Currency Controller")
public class CurrencyController {

    private static final Set<String> FILTER_FIELDS = Set.of("Id", "Code", "Name", "Numeric", "Rounding", "Base", "Rate", "CreatedAt", "CreatedBy", "UpdatedAt", "UpdatedBy");

    @Inject
    private CurrencyRepository repository;

    @Get
    @Documentation("List Currency")
    public List<CurrencyEntity> getAll(@QueryParam("$limit") Integer limit,
                                      @QueryParam("$offset") Integer offset) {
        checkPermissions("read");
        int actualLimit = limit != null ? limit.intValue() : 20;
        int actualOffset = offset != null ? offset.intValue() : 0;
        List<CurrencyEntity> result = repository.findAll(actualLimit, actualOffset);
        return result;
    }

    @Get("/count")
    @Documentation("Count Currency")
    public Map<String, Long> count() {
        checkPermissions("read");
        return Map.of("count", repository.count());
    }

    @Post("/count")
    @Documentation("Count Currency with filter")
    public Map<String, Long> countWithFilter(@Body Map<String, Object> filter) {
        checkPermissions("read");
        return Map.of("count", (long) runFilter(filter).size());
    }

    @Post("/search")
    @Documentation("Search Currency")
    public List<CurrencyEntity> search(@Body Map<String, Object> filter) {
        checkPermissions("read");
        List<CurrencyEntity> result = runFilter(filter);
        return result;
    }

    @Get("/{id}")
    @Documentation("Get Currency by id")
    public CurrencyEntity getById(@PathParam("id") Integer id) {
        checkPermissions("read");
        CurrencyEntity entity = repository.findOne(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Currency not found"));
        return entity;
    }

    @Post
    @Documentation("Create Currency")
    public CurrencyEntity create(@Body CurrencyEntity entity) {
        checkPermissions("write");
        validate(entity);
        return repository.save(entity);
    }

    @Put("/{id}")
    @Documentation("Update Currency by id")
    public CurrencyEntity update(@PathParam("id") Integer id, @Body CurrencyEntity entity) {
        checkPermissions("write");
        entity.Id = id;
        validate(entity);
        return repository.update(entity);
    }

    @Delete("/{id}")
    @Documentation("Delete Currency by id")
    public void deleteById(@PathParam("id") Integer id) {
        checkPermissions("write");
        if (repository.findOne(id).isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Currency not found");
        }
        repository.deleteById(id);
    }

    private List<CurrencyEntity> runFilter(Map<String, Object> filter) {
        StringBuilder hql = new StringBuilder("from CurrencyEntity e");
        Map<String, Object> params = new LinkedHashMap<>();
        boolean first = true;
        if (filter != null && filter.get("equals") instanceof Map<?, ?> equals) {
            for (Map.Entry<?, ?> entry : equals.entrySet()) {
                String field = requireKnownField(String.valueOf(entry.getKey()));
                String paramName = "p" + params.size();
                hql.append(first ? " where e." : " and e.").append(field).append(" = :").append(paramName);
                params.put(paramName, entry.getValue());
                first = false;
            }
        }
        if (filter != null && filter.get("conditions") instanceof List<?> conditions) {
            for (Object raw : conditions) {
                if (!(raw instanceof Map<?, ?> condition)) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid filter condition");
                }
                String field = requireKnownField(String.valueOf(condition.get("propertyName")));
                String operator = String.valueOf(condition.get("operator")).toUpperCase(Locale.ROOT);
                Object value = condition.get("value");
                String paramName = "p" + params.size();
                String clause = switch (operator) {
                    case "EQ" -> "e." + field + " = :" + paramName;
                    case "IN" -> {
                        if (!(value instanceof Collection<?>)) {
                            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "IN value must be a list for field: " + field);
                        }
                        yield "e." + field + " in (:" + paramName + ")";
                    }
                    case "LIKE" -> "e." + field + " like :" + paramName;
                    default -> throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unsupported operator: " + operator);
                };
                hql.append(first ? " where " : " and ").append(clause);
                params.put(paramName, value);
                first = false;
            }
        }
        return repository.query(hql.toString(), params);
    }

    private static String requireKnownField(String field) {
        if (!FILTER_FIELDS.contains(field)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unknown filter field: " + field);
        }
        return field;
    }

    private void checkPermissions(String op) {
        if ("read".equals(op) && !(UserFacade.isInRole("codbex-currencies.Currencies.CurrencyReadOnly") || UserFacade.isInRole("codbex-currencies.Currencies.CurrencyFullAccess"))) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }
        if ("write".equals(op) && !UserFacade.isInRole("codbex-currencies.Currencies.CurrencyFullAccess")) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }
    }

    private static void validate(CurrencyEntity entity) {
        if (entity.Code == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The 'Code' property is required");
        }
        if (entity.Code != null && entity.Code.length() > 3) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The 'Code' exceeds the maximum length of 3");
        }
        if (entity.Name == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The 'Name' property is required");
        }
        if (entity.Name != null && entity.Name.length() > 127) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The 'Name' exceeds the maximum length of 127");
        }
        if (entity.Numeric == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The 'Numeric' property is required");
        }
        if (entity.Numeric != null && entity.Numeric.length() > 3) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The 'Numeric' exceeds the maximum length of 3");
        }
        if (entity.Rounding == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The 'Rounding' property is required");
        }
        if (entity.Rate == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The 'Rate' property is required");
        }
        if (entity.CreatedBy != null && entity.CreatedBy.length() > 20) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The 'CreatedBy' exceeds the maximum length of 20");
        }
        if (entity.UpdatedBy != null && entity.UpdatedBy.length() > 20) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The 'UpdatedBy' exceeds the maximum length of 20");
        }
    }
}

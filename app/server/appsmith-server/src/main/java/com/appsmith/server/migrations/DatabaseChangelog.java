package com.appsmith.server.migrations;

import com.appsmith.server.constants.FieldName;
import com.appsmith.server.domains.Action;
import com.appsmith.server.domains.Application;
import com.appsmith.server.domains.Collection;
import com.appsmith.server.domains.Config;
import com.appsmith.server.domains.Datasource;
import com.appsmith.server.domains.InviteUser;
import com.appsmith.server.domains.Organization;
import com.appsmith.server.domains.Page;
import com.appsmith.server.domains.PasswordResetToken;
import com.appsmith.server.domains.Permission;
import com.appsmith.server.domains.Plugin;
import com.appsmith.server.domains.PluginType;
import com.appsmith.server.domains.Query;
import com.appsmith.server.domains.Role;
import com.appsmith.server.domains.Setting;
import com.appsmith.server.domains.User;
import com.appsmith.server.services.OrganizationService;
import com.github.cloudyrock.mongock.ChangeLog;
import com.github.cloudyrock.mongock.ChangeSet;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.UncategorizedMongoDbException;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.index.CompoundIndexDefinition;
import org.springframework.data.mongodb.core.index.Index;
import org.springframework.data.mongodb.core.index.IndexOperations;
import org.springframework.data.mongodb.core.query.Criteria;

import java.util.concurrent.TimeUnit;

@Slf4j
@ChangeLog(order = "001")
public class DatabaseChangelog {

    /**
     * A private, pure utility function to create instances of Index objects to pass to `IndexOps.ensureIndex` method.
     * Note: The order of the fields here is important. An index with the fields `"name", "organizationId"` is different
     * from an index with the fields `"organizationId", "name"`. If an index exists with the first ordering and we try
     * to **ensure** an index with the same name but the second ordering of fields, errors will show up and bad things
     * WILL happen.
     */
    private static Index makeIndex(String... fields) {
        if (fields.length == 1) {
            return new Index(fields[0], Sort.Direction.ASC).named(fields[0]);
        } else {
            org.bson.Document doc = new org.bson.Document();
            for (String field : fields) {
                doc.put(field, 1);
            }
            return new CompoundIndexDefinition(doc);
        }
    }

    /**
     * Given a MongoTemplate, a domain class and a bunch of Index definitions, this pure utility function will ensure
     * those indexes on the database behind the MongoTemplate instance.
     */
    private static void ensureIndexes(MongoTemplate mongoTemplate, Class<?> entityClass, Index... indexes) {
        IndexOperations indexOps = mongoTemplate.indexOps(entityClass);
        for (Index index : indexes) {
            indexOps.ensureIndex(index);
        }
    }

    private static void dropIndexIfExists(MongoTemplate mongoTemplate, Class<?> entityClass, String name) {
        try {
            mongoTemplate.indexOps(entityClass).dropIndex(name);
        } catch (UncategorizedMongoDbException ignored) {
            // The index probably doesn't exist. This happens if the database is created after the @Indexed annotation
            // has been removed.
        }
    }

    @ChangeSet(order = "001", id = "initial-plugins", author = "")
    public void initialPlugins(MongoTemplate mongoTemplate) {
        Plugin plugin1 = new Plugin();
        plugin1.setName("PostgresDbPlugin");
        plugin1.setType(PluginType.DB);
        plugin1.setPackageName("postgres-plugin");
        plugin1.setUiComponent("DbEditorForm");
        plugin1.setDefaultInstall(true);
        try {
            mongoTemplate.insert(plugin1);
        } catch (DuplicateKeyException e) {
            log.warn("postgres-plugin already present in database.");
        }

        Plugin plugin2 = new Plugin();
        plugin2.setName("RestTemplatePluginExecutor");
        plugin2.setType(PluginType.API);
        plugin2.setPackageName("restapi-plugin");
        plugin2.setUiComponent("ApiEditorForm");
        plugin2.setDefaultInstall(true);
        try {
            mongoTemplate.insert(plugin2);
        } catch (DuplicateKeyException e) {
            log.warn("restapi-plugin already present in database.");
        }

        Plugin plugin3 = new Plugin();
        plugin3.setName("MongoDBPlugin");
        plugin3.setType(PluginType.DB);
        plugin3.setPackageName("mongo-plugin");
        plugin3.setUiComponent("DbEditorForm");
        plugin3.setDefaultInstall(true);
        try {
            mongoTemplate.insert(plugin3);
        } catch (DuplicateKeyException e) {
            log.warn("mongo-plugin already present in database.");
        }

        Plugin plugin4 = new Plugin();
        plugin4.setName("Rapid API Plugin");
        plugin4.setType(PluginType.API);
        plugin4.setPackageName("rapidapi-plugin");
        plugin4.setUiComponent("RapidApiEditorForm");
        plugin4.setDefaultInstall(true);
        try {
            mongoTemplate.insert(plugin4);
        } catch (DuplicateKeyException e) {
            log.warn("rapidapi-plugin already present in database.");
        }
    }

    @ChangeSet(order = "002", id = "remove-org-name-index", author = "")
    public void removeOrgNameIndex(MongoTemplate mongoTemplate) {
        dropIndexIfExists(mongoTemplate, Organization.class, "name");
    }

    @ChangeSet(order = "003", id = "add-org-slugs", author = "")
    public void addOrgSlugs(MongoTemplate mongoTemplate, OrganizationService organizationService) {
        // For all existing organizations, add a slug field, which should be unique.
        // We are blocking here for adding a slug to each existing organization. This is bad and slow. Do NOT copy this
        // code fragment into the services' control flow. This is a single migration code and is expected to run once in
        // lifetime of a deployment.
        for (Organization organization : mongoTemplate.findAll(Organization.class)) {
            if (organization.getSlug() == null) {
                organizationService.getNextUniqueSlug(organization.makeSlug())
                        .doOnSuccess(slug -> {
                            organization.setSlug(slug);
                            mongoTemplate.save(organization);
                        })
                        .block();
            }
        }
    }

    /**
     * We are creating indexes manually because Spring's index resolver creates indexes on fields as well.
     * See https://stackoverflow.com/questions/60867491/ for an explanation of the problem. We have that problem with
     * the `Action.datasource` field.
     */
    @ChangeSet(order = "004", id = "initial-indexes", author = "")
    public void addInitialIndexes(MongoTemplate mongoTemplate) {
        Index createdAtIndex = makeIndex("createdAt");

        ensureIndexes(mongoTemplate, Action.class,
                createdAtIndex,
                makeIndex("pageId", "name").unique().named("action_page_compound_index")
        );

        ensureIndexes(mongoTemplate, Application.class,
                createdAtIndex,
                makeIndex("organizationId", "name").unique().named("organization_application_compound_index")
        );

        ensureIndexes(mongoTemplate, Collection.class,
                createdAtIndex
        );

        ensureIndexes(mongoTemplate, Config.class,
                createdAtIndex,
                makeIndex("name").unique()
        );

        ensureIndexes(mongoTemplate, Datasource.class,
                createdAtIndex,
                makeIndex("organizationId", "name").unique().named("organization_datasource_compound_index")
        );

        ensureIndexes(mongoTemplate, InviteUser.class,
                createdAtIndex,
                makeIndex("token").unique().expire(3600, TimeUnit.SECONDS),
                makeIndex("email").unique()
        );

        ensureIndexes(mongoTemplate, Organization.class,
                createdAtIndex,
                makeIndex("slug").unique()
        );

        ensureIndexes(mongoTemplate, Page.class,
                createdAtIndex,
                makeIndex("applicationId", "name").unique().named("application_page_compound_index")
        );

        ensureIndexes(mongoTemplate, PasswordResetToken.class,
                createdAtIndex,
                makeIndex("email").unique().expire(3600, TimeUnit.SECONDS)
        );

        ensureIndexes(mongoTemplate, Permission.class,
                createdAtIndex
        );

        ensureIndexes(mongoTemplate, Plugin.class,
                createdAtIndex,
                makeIndex("type"),
                makeIndex("packageName").unique()
        );

        ensureIndexes(mongoTemplate, Query.class,
                createdAtIndex,
                makeIndex("name").unique()
        );

        ensureIndexes(mongoTemplate, Role.class,
                createdAtIndex
        );

        ensureIndexes(mongoTemplate, Setting.class,
                createdAtIndex,
                makeIndex("key").unique()
        );

        ensureIndexes(mongoTemplate, User.class,
                createdAtIndex,
                makeIndex("email").unique()
        );
    }

    @ChangeSet(order = "005", id = "application-deleted-at", author = "")
    public void addApplicationDeletedAtFieldAndIndex(MongoTemplate mongoTemplate) {
        dropIndexIfExists(mongoTemplate, Application.class, "organization_application_compound_index");

        ensureIndexes(mongoTemplate, Application.class,
                makeIndex("organizationId", "name", "deletedAt")
                        .unique().named("organization_application_deleted_compound_index")
        );

        for (Application application : mongoTemplate.findAll(Application.class)) {
            if (application.isDeleted()) {
                application.setDeletedAt(application.getUpdatedAt());
                mongoTemplate.save(application);
            }
        }
    }

    @ChangeSet(order = "006", id = "hide-rapidapi-plugin", author = "")
    public void hideRapidApiPluginFromCreateDatasource(MongoTemplate mongoTemplate) {
        final Plugin rapidApiPlugin = mongoTemplate.findOne(
                org.springframework.data.mongodb.core.query.Query.query(Criteria.where("packageName").is("rapidapi-plugin")),
                Plugin.class
        );

        if (rapidApiPlugin == null) {
            log.error("Couldn't find rapidapi-plugin, to set it's `allowUserDatasources` to false.");

        } else {
            rapidApiPlugin.setAllowUserDatasources(false);
            mongoTemplate.save(rapidApiPlugin);

        }
    }

    @ChangeSet(order = "007", id = "datasource-deleted-at", author = "")
    public void addDatasourceDeletedAtFieldAndIndex(MongoTemplate mongoTemplate) {
        dropIndexIfExists(mongoTemplate, Datasource.class, "organization_datasource_compound_index");

        ensureIndexes(mongoTemplate, Datasource.class,
                makeIndex(FieldName.ORGANIZATION_ID, FieldName.NAME, FieldName.DELETED_AT)
                        .unique().named("organization_datasource_deleted_compound_index")
        );

        for (Datasource datasource : mongoTemplate.findAll(Datasource.class)) {
            if (datasource.isDeleted()) {
                datasource.setDeletedAt(datasource.getUpdatedAt());
                mongoTemplate.save(datasource);
            }
        }
    }

    @ChangeSet(order = "008", id = "page-deleted-at", author = "")
    public void addPageDeletedAtFieldAndIndex(MongoTemplate mongoTemplate) {
        dropIndexIfExists(mongoTemplate, Page.class, "application_page_compound_index");

        ensureIndexes(mongoTemplate, Page.class,
                makeIndex(FieldName.APPLICATION_ID, FieldName.NAME, FieldName.DELETED_AT)
                        .unique().named("application_page_deleted_compound_index")
        );

        for (Page page : mongoTemplate.findAll(Page.class)) {
            if (page.isDeleted()) {
                page.setDeletedAt(page.getUpdatedAt());
                mongoTemplate.save(page);
            }
        }
    }

    @ChangeSet(order = "009", id = "friendly-plugin-names", author = "")
    public void setFriendlyPluginNames(MongoTemplate mongoTemplate) {
        for (Plugin plugin : mongoTemplate.findAll(Plugin.class)) {
            if ("postgres-plugin".equals(plugin.getPackageName())) {
                plugin.setName("PostgreSQL");
            } else if ("restapi-plugin".equals(plugin.getPackageName())) {
                plugin.setName("REST API");
            } else if ("mongo-plugin".equals(plugin.getPackageName())) {
                plugin.setName("MongoDB");
            } else {
                continue;
            }
            mongoTemplate.save(plugin);
        }
    }

}

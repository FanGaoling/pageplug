package com.appsmith.server.services;

import com.appsmith.external.models.Policy;
import com.appsmith.server.constants.AclPermission;
import com.appsmith.server.constants.FieldName;
import com.appsmith.server.domains.Organization;
import com.appsmith.server.exceptions.AppsmithError;
import com.appsmith.server.exceptions.AppsmithException;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.security.test.context.support.WithUserDetails;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;

import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest
@DirtiesContext
public class OrganizationServiceTest {

    @Autowired
    OrganizationService organizationService;

    Organization organization;

    @Before
    public void setup() {
        organization = new Organization();
        organization.setName("Test Name");
        organization.setDomain("example.com");
        organization.setWebsite("https://example.com");
    }

    /* Tests for the Create Organization Flow */

    @Test
    @WithUserDetails(value = "api_user")
    public void nullCreateOrganization() {
        Mono<Organization> organizationResponse = organizationService.create(null);
        StepVerifier.create(organizationResponse)
                .expectErrorMatches(throwable -> throwable instanceof AppsmithException &&
                        throwable.getMessage().equals(AppsmithError.INVALID_PARAMETER.getMessage(FieldName.ORGANIZATION)))
                .verify();
    }

    @Test
    @WithUserDetails(value = "api_user")
    public void nullName() {
        organization.setName(null);
        Mono<Organization> organizationResponse = organizationService.create(organization);
        StepVerifier.create(organizationResponse)
                .expectErrorMatches(throwable -> throwable instanceof AppsmithException &&
                        throwable.getMessage().equals(AppsmithError.INVALID_PARAMETER.getMessage(FieldName.NAME)))
                .verify();
    }

    @Test
    @WithUserDetails(value = "api_user")
    public void validCreateOrganizationTest() {
        Mono<Organization> organizationResponse = organizationService.create(organization)
                .switchIfEmpty(Mono.error(new Exception("create is returning empty!!")));
        StepVerifier.create(organizationResponse)
                .assertNext(organization1 -> {
                    assertThat(organization1.getName()).isEqualTo("Test Name");
                    assertThat(organization1.getPolicies()).isNotEmpty();
                })
                .verifyComplete();
    }

    /* Tests for Get Organization Flow */

    @Test
    @WithUserDetails(value = "api_user")
    public void getOrganizationInvalidId() {
        Mono<Organization> organizationMono = organizationService.getById("random-id");
        StepVerifier.create(organizationMono)
                .expectErrorMatches(throwable -> throwable instanceof AppsmithException &&
                        throwable.getMessage().equals(AppsmithError.NO_RESOURCE_FOUND.getMessage("resource", "random-id")))
                .verify();
    }

    @Test
    @WithMockUser(username = "api_user")
    public void getOrganizationNullId() {
        Mono<Organization> organizationMono = organizationService.getById(null);
        StepVerifier.create(organizationMono)
                .expectErrorMatches(throwable -> throwable instanceof AppsmithException &&
                        throwable.getMessage().equals(AppsmithError.INVALID_PARAMETER.getMessage(FieldName.ID)))
                .verify();
    }

    @Test
    @WithUserDetails(value = "api_user")
    public void validGetOrganizationByName() {
        Organization organization = new Organization();
        organization.setName("Test For Get Name");
        organization.setDomain("example.com");
        organization.setWebsite("https://example.com");
        Mono<Organization> createOrganization = organizationService.create(organization);
        Mono<Organization> getOrganization = createOrganization.flatMap(t -> organizationService.findById(t.getId()));
        StepVerifier.create(getOrganization)
                .assertNext(t -> {
                    assertThat(t).isNotNull();
                    assertThat(t.getName()).isEqualTo("Test For Get Name");
                })
                .verifyComplete();
    }

    /* Tests for Update Organization Flow */
    @Test
    @WithUserDetails(value = "api_user")
    public void validUpdateOrganization() {
        Organization organization = new Organization();
        organization.setName("Test Update Name");
        organization.setDomain("example.com");
        organization.setWebsite("https://example.com");

        Mono<Organization> createOrganization = organizationService.create(organization);
        Mono<Organization> updateOrganization = createOrganization
                .map(t -> {
                    t.setDomain("abc.com");
                    return t;
                })
                .flatMap(t -> organizationService.update(t.getId(), t))
                .flatMap(t -> organizationService.findById(t.getId()));

        StepVerifier.create(updateOrganization)
                .assertNext(t -> {
                    assertThat(t).isNotNull();
                    assertThat(t.getName()).isEqualTo(organization.getName());
                    assertThat(t.getId()).isEqualTo(organization.getId());
                    assertThat(t.getDomain()).isEqualTo("abc.com");
                })
                .verifyComplete();
    }
}

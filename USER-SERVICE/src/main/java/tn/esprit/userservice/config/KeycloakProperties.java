package tn.esprit.userservice.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Data
@Component
@ConfigurationProperties(prefix = "keycloak")
public class KeycloakProperties {

    private String serverUrl;
    private String realm;
    private String clientId;
    private String clientSecret;

    private String adminRealm;
    private String adminClientId;
    private String adminClientSecret;
    private String adminUsername;
    private String adminPassword;
}

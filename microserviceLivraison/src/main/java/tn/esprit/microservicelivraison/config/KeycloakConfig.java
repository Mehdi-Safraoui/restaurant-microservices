package tn.esprit.microservicelivraison.config;

import org.keycloak.OAuth2Constants;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.KeycloakBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class KeycloakConfig {

    static Keycloak keycloak = null;

    // ✅ Keycloak 26.x : sans /auth
    final static String serverUrl = "http://localhost:8080";

    // ✅ Ton realm
    public final static String realm = "Delivery_Board_Realm";

    // ✅ Ton client Keycloak
    public final static String clientId = "delivery-client";

    // ✅ Ton client secret (depuis Keycloak > Clients > delivery-service > Credentials)
    final static String clientSecret = "vB1BhHbN6pR2NFeihrmmrCtrwQ3wEBEk";

    // ✅ Un utilisateur admin de ton realm
    final static String userName = "ahmed";
    final static String password = "ahmed";

    public KeycloakConfig() {}

    @Bean
    public static Keycloak getInstance() {
        if (keycloak == null) {
            keycloak = KeycloakBuilder.builder()
                    .serverUrl(serverUrl)
                    .realm(realm)
                    .grantType(OAuth2Constants.PASSWORD)
                    .username(userName)
                    .password(password)
                    .clientId(clientId)
                    .clientSecret(clientSecret)
                    .build();
        }
        return keycloak;
    }
}
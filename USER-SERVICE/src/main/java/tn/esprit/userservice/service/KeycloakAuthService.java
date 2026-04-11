package tn.esprit.userservice.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import tn.esprit.userservice.config.KeycloakProperties;

import java.io.IOException;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;


@Service
@RequiredArgsConstructor
public class KeycloakAuthService {

    private final KeycloakProperties keycloakProperties;
    private final ObjectMapper objectMapper;
    private final HttpClient httpClient = HttpClient.newHttpClient();

    public String registerAndGetToken(String email, String password, String firstName, String lastName) {
        String adminToken = getAdminToken();
        createUser(adminToken, email, password, firstName, lastName);
        return loginAndGetToken(email, password);
    }

    public String loginAndGetToken(String email, String password) {
        return requestToken(
                keycloakProperties.getRealm(),
                keycloakProperties.getClientId(),
                keycloakProperties.getClientSecret(),
                email,
                password
        );
    }

    private String getAdminToken() {
        return requestToken(
                keycloakProperties.getAdminRealm(),
                keycloakProperties.getAdminClientId(),
                keycloakProperties.getAdminClientSecret(),
                keycloakProperties.getAdminUsername(),
                keycloakProperties.getAdminPassword()
        );
    }

    private String requestToken(String realm, String clientId, String clientSecret, String username, String password) {
        Map<String, String> form = new HashMap<>();
        form.put("grant_type", "password");
        form.put("client_id", clientId);
        if (clientSecret != null && !clientSecret.isBlank()) {
            form.put("client_secret", clientSecret);
        }
        form.put("username", username);
        form.put("password", password);

        String body = formUrlEncoded(form);
        String url = keycloakProperties.getServerUrl() + "/realms/" + realm + "/protocol/openid-connect/token";

        HttpRequest request = HttpRequest.newBuilder(URI.create(url))
                .header("Content-Type", "application/x-www-form-urlencoded")
                .POST(HttpRequest.BodyPublishers.ofString(body))
                .build();

        try {
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() != HttpStatus.OK.value()) {
                throw new RuntimeException("Keycloak token request failed: " + response.statusCode() + " - " + response.body());
            }

            JsonNode node = objectMapper.readTree(response.body());
            String token = node.path("access_token").asText();
            if (token == null || token.isBlank()) {
                throw new RuntimeException("Keycloak token response missing access_token");
            }
            return token;
        } catch (IOException | InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new RuntimeException("Failed to contact Keycloak token endpoint", e);
        }
    }

    private void createUser(String adminToken, String email, String password, String firstName, String lastName) {
        String createUserUrl = keycloakProperties.getServerUrl() + "/admin/realms/" + keycloakProperties.getRealm() + "/users";

        Map<String, Object> payload = new HashMap<>();
        payload.put("username", email);
        payload.put("email", email);
        payload.put("firstName", firstName);
        payload.put("lastName", lastName);
        payload.put("enabled", true);
        payload.put("emailVerified", true);

        try {
            HttpRequest createRequest = HttpRequest.newBuilder(URI.create(createUserUrl))
                    .header("Content-Type", "application/json")
                    .header("Authorization", "Bearer " + adminToken)
                    .POST(HttpRequest.BodyPublishers.ofString(objectMapper.writeValueAsString(payload)))
                    .build();

            HttpResponse<String> createResponse = httpClient.send(createRequest, HttpResponse.BodyHandlers.ofString());

            if (createResponse.statusCode() == HttpStatus.CONFLICT.value()) {
                throw new RuntimeException("Keycloak user already exists: " + email);
            }
            if (createResponse.statusCode() != HttpStatus.CREATED.value()) {
                throw new RuntimeException("Keycloak create user failed: " + createResponse.statusCode() + " - " + createResponse.body());
            }

            String location = createResponse.headers().firstValue("Location").orElse("");
            String userId = extractUserId(location);
            if (userId == null || userId.isBlank()) {
                throw new RuntimeException("Keycloak create user succeeded but user id is missing in Location header");
            }

            setUserPassword(adminToken, userId, password);
        } catch (IOException | InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new RuntimeException("Failed to create user in Keycloak", e);
        }
    }

    private void setUserPassword(String adminToken, String userId, String password) throws IOException, InterruptedException {
        String url = keycloakProperties.getServerUrl() + "/admin/realms/" + keycloakProperties.getRealm() + "/users/" + userId + "/reset-password";

        Map<String, Object> body = new HashMap<>();
        body.put("type", "password");
        body.put("temporary", false);
        body.put("value", password);

        HttpRequest request = HttpRequest.newBuilder(URI.create(url))
                .header("Content-Type", "application/json")
                .header("Authorization", "Bearer " + adminToken)
                .PUT(HttpRequest.BodyPublishers.ofString(objectMapper.writeValueAsString(body)))
                .build();

        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
        if (response.statusCode() != HttpStatus.NO_CONTENT.value()) {
            throw new RuntimeException("Keycloak set password failed: " + response.statusCode() + " - " + response.body());
        }
    }

    private String extractUserId(String locationHeader) {
        if (locationHeader == null || locationHeader.isBlank()) {
            return null;
        }
        int lastSlash = locationHeader.lastIndexOf('/');
        if (lastSlash == -1 || lastSlash == locationHeader.length() - 1) {
            return null;
        }
        return locationHeader.substring(lastSlash + 1);
    }

    private String formUrlEncoded(Map<String, String> fields) {
        StringBuilder sb = new StringBuilder();
        fields.forEach((key, value) -> {
            if (sb.length() > 0) {
                sb.append('&');
            }
            sb.append(URLEncoder.encode(key, StandardCharsets.UTF_8));
            sb.append('=');
            sb.append(URLEncoder.encode(value, StandardCharsets.UTF_8));
        });
        return sb.toString();
    }
}

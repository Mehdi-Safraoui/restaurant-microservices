package com.brainwaves.evenementservice.config;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;

import java.util.Collection;
import java.util.Collections;
import java.util.LinkedHashSet;
import java.util.Locale;
import java.util.Map;
import java.util.Set;

public final class KeycloakJwtRoleConverter {

    private KeycloakJwtRoleConverter() {
    }

    public static Collection<GrantedAuthority> fromRealmRoles(Jwt jwt) {
        Object realmAccess = jwt.getClaims().get("realm_access");
        if (!(realmAccess instanceof Map<?, ?> realmAccessMap)) {
            return Collections.emptySet();
        }

        Object roles = realmAccessMap.get("roles");
        return toAuthorities(roles);
    }

    public static Collection<GrantedAuthority> fromResourceRoles(Jwt jwt) {
        Object resourceAccess = jwt.getClaims().get("resource_access");
        if (!(resourceAccess instanceof Map<?, ?> resourceAccessMap)) {
            return Collections.emptySet();
        }

        Set<GrantedAuthority> authorities = new LinkedHashSet<>();
        for (Object entryValue : resourceAccessMap.values()) {
            if (entryValue instanceof Map<?, ?> clientAccess) {
                authorities.addAll(toAuthorities(clientAccess.get("roles")));
            }
        }
        return authorities;
    }

    private static Collection<GrantedAuthority> toAuthorities(Object rolesObject) {
        if (!(rolesObject instanceof Collection<?> roles)) {
            return Collections.emptySet();
        }

        Set<GrantedAuthority> authorities = new LinkedHashSet<>();
        for (Object role : roles) {
            if (role instanceof String roleName && !roleName.isBlank()) {
                authorities.add(new SimpleGrantedAuthority("ROLE_" + roleName.toUpperCase(Locale.ROOT)));
            }
        }
        return authorities;
    }
}

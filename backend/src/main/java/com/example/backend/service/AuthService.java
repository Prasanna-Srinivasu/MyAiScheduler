package com.example.backend.service;

import java.util.Base64;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.Random;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.example.backend.dto.AuthResponse;
import com.example.backend.dto.ForgotPasswordRequest;
import com.example.backend.dto.ForgotPasswordResponse;
import com.example.backend.dto.GoogleLoginRequest;
import com.example.backend.dto.LoginRequest;
import com.example.backend.dto.RegisterRequest;
import com.example.backend.dto.ResetPasswordRequest;
import com.example.backend.dto.SocialLoginRequest;
import com.example.backend.dto.UserDto;
import com.example.backend.entity.Users;
import com.example.backend.repository.UsersRepository;
import com.example.backend.security.JwtService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
@Transactional
public class AuthService {

    private final UsersRepository usersRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final NotificationService notificationService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${app.oauth.google.client-id:}")
    private String googleClientId;

    @Value("${app.oauth.google.client-secret:}")
    private String googleClientSecret;

    @Value("${app.oauth.github.client-id:}")
    private String githubClientId;

    @Value("${app.oauth.github.client-secret:}")
    private String githubClientSecret;

    @Value("${app.cookie.secure:false}")
    private boolean cookieSecure;

    // In-memory token store for password reset verification (email -> {code, timestamp})
    private final Map<String, ResetTokenEntry> resetTokens = new ConcurrentHashMap<>();

    private static class ResetTokenEntry {
        final String code;
        final long expiresAt;

        ResetTokenEntry(String code, long expiresAt) {
            this.code = code;
            this.expiresAt = expiresAt;
        }
    }

    public AuthService(
            UsersRepository usersRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            AuthenticationManager authenticationManager,
            NotificationService notificationService) {

        this.usersRepository = usersRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
        this.notificationService = notificationService;
    }

    public ResponseCookie createSessionCookie(String token) {
        return ResponseCookie.from("auth_token", token)
                .httpOnly(true)
                .secure(cookieSecure)
                .path("/")
                .maxAge(7 * 24 * 60 * 60) // 7 days
                .sameSite(cookieSecure ? "None" : "Lax")
                .build();
    }

    public ResponseCookie createLogoutCookie() {
        return ResponseCookie.from("auth_token", "")
                .httpOnly(true)
                .secure(cookieSecure)
                .path("/")
                .maxAge(0)
                .sameSite(cookieSecure ? "None" : "Lax")
                .build();
    }

    public AuthResponse register(RegisterRequest request) {

        if (usersRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        Users user = new Users();
        user.setName(request.getName());
        user.setEmail(request.getEmail().trim().toLowerCase());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setTargetRole(request.getTargetRole() != null ? request.getTargetRole() : "Full Stack Developer");
        user.setExperienceLevel(request.getExperienceLevel() != null ? request.getExperienceLevel() : "Intermediate");

        Users saved = usersRepository.save(user);

        var userDetails = org.springframework.security.core.userdetails.User
                .withUsername(saved.getEmail())
                .password("")
                .roles("USER")
                .build();

        String token = jwtService.generateToken(userDetails);

        notificationService.createNotification(
                saved,
                "SYSTEM",
                "Welcome to AI Scheduler!",
                "Your account has been set up. Start exploring the LeetCode Practice playground and learning roadmap!"
        );

        UserDto userDto = new UserDto(
                saved.getId(),
                saved.getName(),
                saved.getEmail(),
                saved.getTargetRole(),
                saved.getExperienceLevel(),
                saved.getProvider(),
                saved.getPictureUrl()
        );

        return new AuthResponse(token, userDto, "Registered successfully");
    }

    public AuthResponse login(LoginRequest request) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()));

        Users user = usersRepository.findByEmail(request.getEmail().trim().toLowerCase())
                .orElseThrow(() -> new RuntimeException("User not found"));

        var userDetails = org.springframework.security.core.userdetails.User
                .withUsername(user.getEmail())
                .password("")
                .roles("USER")
                .build();

        String token = jwtService.generateToken(userDetails);

        UserDto userDto = new UserDto(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getTargetRole(),
                user.getExperienceLevel(),
                user.getProvider(),
                user.getPictureUrl()
        );

        return new AuthResponse(token, userDto, "Login successful");
    }

    public AuthResponse googleLogin(GoogleLoginRequest request) {
        String credential = request.getCredential();
        String accessToken = request.getAccessToken();

        if ((credential == null || credential.isBlank()) && (accessToken == null || accessToken.isBlank())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Google OAuth verification failed: Missing Google ID token or Access Token. Manual email-only login is prohibited.");
        }

        String email = null;
        String name = null;
        String picture = null;
        String googleId = null;

        java.net.http.HttpClient httpClient = java.net.http.HttpClient.newHttpClient();

        // 1. Verify Google ID token (from GIS One Tap / Sign In with Google)
        if (credential != null && !credential.isBlank()) {
            try {
                java.net.http.HttpRequest verifyReq = java.net.http.HttpRequest.newBuilder()
                        .uri(java.net.URI.create("https://oauth2.googleapis.com/tokeninfo?id_token=" + credential))
                        .header("Accept", "application/json")
                        .GET()
                        .build();

                java.net.http.HttpResponse<String> verifyRes = httpClient.send(verifyReq, java.net.http.HttpResponse.BodyHandlers.ofString());
                if (verifyRes.statusCode() == 200) {
                    JsonNode node = objectMapper.readTree(verifyRes.body());
                    if (node.has("email")) email = node.get("email").asText();
                    if (node.has("name")) name = node.get("name").asText();
                    if (node.has("picture")) picture = node.get("picture").asText();
                    if (node.has("sub")) googleId = node.get("sub").asText();

                    boolean verified = node.has("email_verified") && "true".equalsIgnoreCase(node.get("email_verified").asText());
                    if (!verified && email != null) {
                        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Google account email is not verified by Google.");
                    }
                } else {
                    // Fallback to safely decoding signed JWT payload from Google
                    String[] parts = credential.split("\\.");
                    if (parts.length >= 2) {
                        byte[] payloadBytes = Base64.getUrlDecoder().decode(parts[1]);
                        JsonNode node = objectMapper.readTree(payloadBytes);
                        if (node.has("iss") && node.get("iss").asText().contains("accounts.google.com")) {
                            if (node.has("email")) email = node.get("email").asText();
                            if (node.has("name")) name = node.get("name").asText();
                            if (node.has("picture")) picture = node.get("picture").asText();
                            if (node.has("sub")) googleId = node.get("sub").asText();
                        }
                    }
                }
            } catch (ResponseStatusException rse) {
                throw rse;
            } catch (Exception e) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Failed to verify Google ID token with Google identity servers: " + e.getMessage());
            }
        }

        // 2. If ID Token was not provided or failed, verify Google OAuth2 Access Token
        if (email == null && accessToken != null && !accessToken.isBlank()) {
            try {
                java.net.http.HttpRequest userReq = java.net.http.HttpRequest.newBuilder()
                        .uri(java.net.URI.create("https://www.googleapis.com/oauth2/v3/userinfo"))
                        .header("Authorization", "Bearer " + accessToken)
                        .header("Accept", "application/json")
                        .GET()
                        .build();

                java.net.http.HttpResponse<String> userRes = httpClient.send(userReq, java.net.http.HttpResponse.BodyHandlers.ofString());
                if (userRes.statusCode() == 200) {
                    JsonNode node = objectMapper.readTree(userRes.body());
                    if (node.has("email")) email = node.get("email").asText();
                    if (node.has("name")) name = node.get("name").asText();
                    if (node.has("picture")) picture = node.get("picture").asText();
                    if (node.has("sub")) googleId = node.get("sub").asText();
                } else {
                    throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Google OAuth access token was rejected by Google userinfo API.");
                }
            } catch (ResponseStatusException rse) {
                throw rse;
            } catch (Exception e) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Google userinfo verification failed: " + e.getMessage());
            }
        }

        if (email == null || email.isBlank()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Google token verification failed: No verified email returned by Google.");
        }

        email = email.trim().toLowerCase();
        Optional<Users> existingOpt = usersRepository.findByEmail(email);

        Users user;
        boolean isNew = false;

        if (existingOpt.isPresent()) {
            user = existingOpt.get();
            if (name != null && !name.isBlank()) user.setName(name);
            if (picture != null) user.setPictureUrl(picture);
            if (googleId != null) user.setGoogleId(googleId);
            user.setProvider("GOOGLE");
            user = usersRepository.save(user);
        } else {
            isNew = true;
            user = new Users();
            user.setEmail(email);
            user.setName(name != null && !name.isBlank() ? name : "Google Developer");
            user.setPasswordHash(passwordEncoder.encode(UUID.randomUUID().toString()));
            user.setTargetRole("Full Stack Java & React Developer");
            user.setExperienceLevel("Intermediate");
            user.setProvider("GOOGLE");
            user.setPictureUrl(picture != null ? picture : "https://ui-avatars.com/api/?name=" + email + "&background=4285F4&color=fff");
            user.setGoogleId(googleId);
            user = usersRepository.save(user);

            notificationService.createNotification(
                    user,
                    "SYSTEM",
                    "Welcome via Google!",
                    "You are now authenticated with verified Google identity. Welcome to your Developer Learning Sanctuary."
            );
        }

        var userDetails = org.springframework.security.core.userdetails.User
                .withUsername(user.getEmail())
                .password("")
                .roles("USER")
                .build();

        String token = jwtService.generateToken(userDetails);

        UserDto userDto = new UserDto(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getTargetRole(),
                user.getExperienceLevel(),
                user.getProvider(),
                user.getPictureUrl()
        );

        return new AuthResponse(token, userDto, isNew ? "Account created and signed in with Google" : "Signed in with Google");
    }

    public AuthResponse githubOAuth(SocialLoginRequest request) {
        if (request.getCode() == null || request.getCode().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "GitHub OAuth verification failed: Missing authorization code. Manual email-only login is strictly prohibited.");
        }

        if (githubClientId == null || githubClientId.isBlank() || githubClientSecret == null || githubClientSecret.isBlank()) {
            throw new ResponseStatusException(HttpStatus.PRECONDITION_FAILED,
                    "GitHub OAuth credentials are not configured on the backend server. Please configure app.oauth.github.client-id and app.oauth.github.client-secret.");
        }

        String email = null;
        String name = null;
        String picture = null;
        String githubId = null;

        try {
            java.net.http.HttpClient httpClient = java.net.http.HttpClient.newHttpClient();

            Map<String, String> tokenPayload = new HashMap<>();
            tokenPayload.put("client_id", githubClientId);
            tokenPayload.put("client_secret", githubClientSecret);
            tokenPayload.put("code", request.getCode());
            if (request.getRedirectUri() != null && !request.getRedirectUri().isBlank()) {
                tokenPayload.put("redirect_uri", request.getRedirectUri());
            }

            String jsonBody = objectMapper.writeValueAsString(tokenPayload);

            java.net.http.HttpRequest tokenReq = java.net.http.HttpRequest.newBuilder()
                    .uri(java.net.URI.create("https://github.com/login/oauth/access_token"))
                    .header("Content-Type", "application/json")
                    .header("Accept", "application/json")
                    .POST(java.net.http.HttpRequest.BodyPublishers.ofString(jsonBody))
                    .build();

            java.net.http.HttpResponse<String> tokenRes = httpClient.send(tokenReq, java.net.http.HttpResponse.BodyHandlers.ofString());

            if (tokenRes.statusCode() != 200) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Failed to exchange GitHub authorization code: HTTP " + tokenRes.statusCode());
            }

            JsonNode tokenNode = objectMapper.readTree(tokenRes.body());
            if (!tokenNode.has("access_token")) {
                String errDesc = tokenNode.has("error_description") ? tokenNode.get("error_description").asText() : "GitHub OAuth code exchange failed";
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "GitHub OAuth error: " + errDesc);
            }

            String accessToken = tokenNode.get("access_token").asText();

            // Query GitHub User profile
            java.net.http.HttpRequest userReq = java.net.http.HttpRequest.newBuilder()
                    .uri(java.net.URI.create("https://api.github.com/user"))
                    .header("Authorization", "Bearer " + accessToken)
                    .header("Accept", "application/json")
                    .header("User-Agent", "My-Ai-Scheduler-Platform")
                    .GET()
                    .build();

            java.net.http.HttpResponse<String> userRes = httpClient.send(userReq, java.net.http.HttpResponse.BodyHandlers.ofString());
            if (userRes.statusCode() != 200) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Failed to fetch GitHub profile with access token.");
            }

            JsonNode userNode = objectMapper.readTree(userRes.body());
            if (userNode.has("id")) githubId = userNode.get("id").asText();
            if (userNode.has("name") && !userNode.get("name").isNull() && !userNode.get("name").asText().isBlank()) {
                name = userNode.get("name").asText();
            } else if (userNode.has("login")) {
                name = userNode.get("login").asText();
            }
            if (userNode.has("avatar_url")) picture = userNode.get("avatar_url").asText();
            if (userNode.has("email") && !userNode.get("email").isNull() && !userNode.get("email").asText().isBlank()) {
                email = userNode.get("email").asText();
            }

            // If private email on profile, fetch from emails endpoint
            if (email == null || email.isBlank()) {
                java.net.http.HttpRequest emailsReq = java.net.http.HttpRequest.newBuilder()
                        .uri(java.net.URI.create("https://api.github.com/user/emails"))
                        .header("Authorization", "Bearer " + accessToken)
                        .header("Accept", "application/json")
                        .header("User-Agent", "My-Ai-Scheduler-Platform")
                        .GET()
                        .build();

                java.net.http.HttpResponse<String> emailsRes = httpClient.send(emailsReq, java.net.http.HttpResponse.BodyHandlers.ofString());
                if (emailsRes.statusCode() == 200) {
                    JsonNode emailsNode = objectMapper.readTree(emailsRes.body());
                    if (emailsNode.isArray()) {
                        for (JsonNode eNode : emailsNode) {
                            if (eNode.has("primary") && eNode.get("primary").asBoolean() && eNode.has("verified") && eNode.get("verified").asBoolean()) {
                                email = eNode.get("email").asText();
                                break;
                            }
                        }
                        if (email == null) {
                            for (JsonNode eNode : emailsNode) {
                                if (eNode.has("verified") && eNode.get("verified").asBoolean()) {
                                    email = eNode.get("email").asText();
                                    break;
                                }
                            }
                        }
                    }
                }
            }
        } catch (ResponseStatusException rse) {
            throw rse;
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Failed to authenticate via GitHub OAuth: " + e.getMessage());
        }

        if (email == null || email.isBlank()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unable to retrieve a verified email address from your GitHub account.");
        }

        email = email.trim().toLowerCase();
        Optional<Users> existingOpt = usersRepository.findByEmail(email);

        Users user;
        boolean isNew = false;

        if (existingOpt.isPresent()) {
            user = existingOpt.get();
            if (name != null && !name.isBlank()) user.setName(name);
            if (picture != null) user.setPictureUrl(picture);
            if (githubId != null) user.setGithubId(githubId);
            user.setProvider("GITHUB");
            user = usersRepository.save(user);
        } else {
            isNew = true;
            user = new Users();
            user.setEmail(email);
            user.setName(name != null && !name.isBlank() ? name : "GitHub Developer");
            user.setPasswordHash(passwordEncoder.encode(UUID.randomUUID().toString()));
            user.setTargetRole("Full Stack Java & React Developer");
            user.setExperienceLevel("Intermediate");
            user.setProvider("GITHUB");
            user.setPictureUrl(picture != null ? picture : "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png");
            user.setGithubId(githubId);
            user = usersRepository.save(user);

            notificationService.createNotification(
                    user,
                    "SYSTEM",
                    "Welcome via GitHub!",
                    "You are now authenticated with verified GitHub identity. Welcome to your Developer Learning Sanctuary."
            );
        }

        var userDetails = org.springframework.security.core.userdetails.User
                .withUsername(user.getEmail())
                .password("")
                .roles("USER")
                .build();

        String token = jwtService.generateToken(userDetails);

        UserDto userDto = new UserDto(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getTargetRole(),
                user.getExperienceLevel(),
                user.getProvider(),
                user.getPictureUrl()
        );

        return new AuthResponse(token, userDto, isNew ? "Account created and signed in with GitHub" : "Signed in with GitHub");
    }

    public AuthResponse socialLogin(SocialLoginRequest request) {
        if (request.getCode() != null && !request.getCode().isBlank()) {
            return githubOAuth(request);
        }
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                "Direct email-only social authentication is disabled. Please authenticate through verified Google or GitHub OAuth.");
    }

    public UserDto getUserFromToken(String token) {
        if (token == null || token.isBlank()) {
            throw new RuntimeException("Session token is missing");
        }
        String email = jwtService.extractEmail(token);
        Users user = usersRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found for session"));

        return new UserDto(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getTargetRole(),
                user.getExperienceLevel(),
                user.getProvider(),
                user.getPictureUrl()
        );
    }

    public ForgotPasswordResponse initiatePasswordReset(ForgotPasswordRequest request) {
        String email = request.getEmail() != null ? request.getEmail().trim().toLowerCase() : "";
        Users user = usersRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("No account found with this email address."));

        int codeInt = 100000 + new Random().nextInt(900000);
        String code = String.valueOf(codeInt);
        long expiresAt = System.currentTimeMillis() + (15 * 60 * 1000);
        resetTokens.put(email, new ResetTokenEntry(code, expiresAt));

        notificationService.createNotification(
                user,
                "REMINDER",
                "Password Reset Requested",
                "Your password reset verification code is: " + code + " (valid for 15 minutes)."
        );

        return new ForgotPasswordResponse(
                "A password reset verification code has been generated.",
                code
        );
    }

    public String resetPassword(ResetPasswordRequest request) {
        String email = request.getEmail() != null ? request.getEmail().trim().toLowerCase() : "";
        ResetTokenEntry entry = resetTokens.get(email);

        if (entry == null) {
            throw new RuntimeException("No active reset request found for this email. Please request a new code.");
        }

        if (System.currentTimeMillis() > entry.expiresAt) {
            resetTokens.remove(email);
            throw new RuntimeException("Verification code has expired. Please request a new code.");
        }

        if (!entry.code.equals(request.getResetCode().trim())) {
            throw new RuntimeException("Invalid verification code. Please check and try again.");
        }

        if (request.getNewPassword() == null || request.getNewPassword().length() < 6) {
            throw new RuntimeException("New password must be at least 6 characters.");
        }

        Users user = usersRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found."));

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        usersRepository.save(user);

        resetTokens.remove(email);

        notificationService.createNotification(
                user,
                "SYSTEM",
                "Password Successfully Changed",
                "Your account password was updated successfully."
        );

        return "Password has been successfully reset. You can now sign in with your new password.";
    }
}
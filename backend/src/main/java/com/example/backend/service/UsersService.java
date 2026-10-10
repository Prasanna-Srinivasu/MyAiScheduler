package com.example.backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.backend.dto.UserDto;
import com.example.backend.dto.UserProfileRequest;
import com.example.backend.entity.UserPreference;
import com.example.backend.entity.Users;
import com.example.backend.repository.UserPreferenceRepository;
import com.example.backend.repository.UsersRepository;

@Service
@Transactional
public class UsersService {

    private final UsersRepository usersRepository;
    private final UserPreferenceRepository userPreferenceRepository;

    public UsersService(UsersRepository usersRepository, UserPreferenceRepository userPreferenceRepository) {
        this.usersRepository = usersRepository;
        this.userPreferenceRepository = userPreferenceRepository;
    }

    public List<Users> getAllusers() {
        return usersRepository.findAll();
    }

    public Users getUserById(Long id) {
        return usersRepository.findById(id).orElse(null);
    }

    public Users getUserByEmail(String email) {
        return usersRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
    }

    public UserDto getUserProfile(String email) {
        Users user = getUserByEmail(email);
        return toDto(user);
    }

    public UserDto updateProfile(String email, UserProfileRequest request) {
        Users user = getUserByEmail(email);

        if (request.getName() != null && !request.getName().isBlank()) {
            user.setName(request.getName());
        }
        if (request.getTargetRole() != null) {
            user.setTargetRole(request.getTargetRole());
        }
        if (request.getExperienceLevel() != null) {
            user.setExperienceLevel(request.getExperienceLevel());
        }

        Users saved = usersRepository.save(user);

        // Update preferences
        Optional<UserPreference> prefOpt = userPreferenceRepository.findByUser(saved);
        UserPreference pref = prefOpt.orElseGet(() -> {
            UserPreference newPref = new UserPreference();
            newPref.setUser(saved);
            return newPref;
        });

        if (request.getPreferredStudyIntensity() != null) {
            pref.setPreferredStudyIntensity(request.getPreferredStudyIntensity());
        }
        if (request.getWakeUpTime() != null) {
            pref.setWakeUpTime(request.getWakeUpTime());
        }
        if (request.getSleepTime() != null) {
            pref.setSleepTime(request.getSleepTime());
        }
        if (request.getNotificationEnabled() != null) {
            pref.setNotificationEnabled(request.getNotificationEnabled());
        }
        if (request.getDailySummaryEnabled() != null) {
            pref.setDailySummaryEnabled(request.getDailySummaryEnabled());
        }

        userPreferenceRepository.save(pref);

        return toDto(saved);
    }

    public UserPreference getPreferences(Users user) {
        return userPreferenceRepository.findByUser(user)
                .orElseGet(() -> {
                    UserPreference pref = new UserPreference();
                    pref.setUser(user);
                    return userPreferenceRepository.save(pref);
                });
    }

    public Users createUser(Users user) {
        return usersRepository.save(user);
    }

    public String deleteUser(Long id) {
        if (!usersRepository.existsById(id)) {
            return "userNotFound";
        }
        usersRepository.deleteById(id);
        return "user Deleted Successfully";
    }

    public UserDto toDto(Users user) {
        return new UserDto(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getTargetRole(),
                user.getExperienceLevel()
        );
    }
}

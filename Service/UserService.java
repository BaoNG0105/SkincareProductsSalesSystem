package com.example.SkinCareSellProductSysterm.Service;

import com.example.SkinCareSellProductSysterm.DTO.RegisterRequest;
import com.example.SkinCareSellProductSysterm.DTO.UserRequest;
import com.example.SkinCareSellProductSysterm.Entity.User;
import com.example.SkinCareSellProductSysterm.Repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Lấy toàn bộ user
    public List<User> getAllUsers() {
        return userRepository.findByIsDeletedFalse();
    }

    // Lấy user theo ID
    public User getUserById(long id) {
        return userRepository.findByIdAndIsDeletedFalse(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }


    // Lấy user theo Email
    public User getUserByEmail(String email) {
        return userRepository.findByEmailAndIsDeletedFalse(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // Đăng ký (Register)
    public User registerUser(RegisterRequest registerRequest) {
        // Mã hoá password
        String encodedPassword = passwordEncoder.encode(registerRequest.getPasswordHash());

        // Tạo user
        User user = new User();


        user.setUserName(registerRequest.getUserName());
        user.setEmail(registerRequest.getEmail());
        user.setPasswordHash(encodedPassword);


        user.setGender(registerRequest.getGender());
        user.setDateOfBirth(registerRequest.getDateOfBirth());
        user.setAddress(registerRequest.getAddress());
        user.setPhoneNumber(registerRequest.getPhoneNumber());
        user.setProfileImage(registerRequest.getProfileImage());
        user.setMoney(BigDecimal.ZERO);

        User newUser = userRepository.save(user);
        return newUser;
    }



    // Cập nhật user
    public User updateUserProfile(Long id, UserRequest userDetails) {
        User user = userRepository.findByIdAndIsDeletedFalse(id)
                .orElseThrow(() -> new RuntimeException("User not found with id = " + id));


        // Cập nhật thông tin

        String encodedPassword = passwordEncoder.encode(userDetails.getPasswordHash());
        user.setPasswordHash(encodedPassword);


        user.setGender(userDetails.getGender());

        user.setDateOfBirth(userDetails.getDateOfBirth());

        user.setAddress(userDetails.getAddress());
        user.setPhoneNumber(userDetails.getPhoneNumber());
        user.setProfileImage(userDetails.getProfileImage());
        user.setMoney(userDetails.getMoney());

        return userRepository.save(user);
    }




    // Cập nhật mật khẩu (updatePassword)
    public User updatePassword(Long userId, String oldPassword, String newPassword) {
        Optional<User> userOpt = userRepository.findByIdAndIsDeletedFalse(userId);
        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found with ID: " + userId);
        }
        User user = userOpt.get();
        // Kiểm tra mật khẩu cũ có đúng không

        if (!passwordEncoder.matches(oldPassword, user.getPasswordHash())) {
            throw new RuntimeException("Old password is incorrect");
        }
        // Mã hoá mật khẩu mới và cập nhật
        String encodedNewPassword = passwordEncoder.encode(newPassword);
        user.setPasswordHash(encodedNewPassword);

        return userRepository.save(user);

    }


    // Xoá người dùng
    public User deleteUser(Long id) {
        Optional<User> userOpt = userRepository.findByIdAndIsDeletedFalse(id);
        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found with ID: " + id);
        }
        User user = userOpt.get();
        user.setDeleted(true);
        return userRepository.save(user);
    }
}

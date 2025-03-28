package com.example.SkinCareSellProductSysterm.Controller;

import com.example.SkinCareSellProductSysterm.DTO.UserRequest;
import com.example.SkinCareSellProductSysterm.Entity.User;
import com.example.SkinCareSellProductSysterm.Service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173") // Thêm port của frontend vào đây
@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    // Lấy tất cả user

    @GetMapping
    public ResponseEntity<List<User>> getAllUser(){
        return ResponseEntity.ok(userService.getAllUsers());
    }


    // Lấy user theo ID
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    // Sửa user

    @PutMapping("/{id}")
    public ResponseEntity<User> updateProduct(@PathVariable long id, @Valid @RequestBody UserRequest userRequest) {
        return ResponseEntity.ok(userService.updateUserProfile(id, userRequest));
    }

    // Xóa user


    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable long id){
        userService.deleteUser(id);
        return ResponseEntity.ok("Deleted user with ID: " + id);
    }
}

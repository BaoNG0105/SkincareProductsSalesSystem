package com.example.SkinCareSellProductSysterm.Controller;

import com.example.SkinCareSellProductSysterm.DTO.SkinTypeRequest;
import com.example.SkinCareSellProductSysterm.Entity.SkinType;
import com.example.SkinCareSellProductSysterm.Service.SkinTypeService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/skin-types")
public class SkinTypeController {

    @Autowired
    private SkinTypeService skinTypeService;

    @PostMapping
    public ResponseEntity<SkinType> createSkinType(@Valid @RequestBody SkinTypeRequest skinTypeRequest) {
        return ResponseEntity.ok(skinTypeService.createSkinType(skinTypeRequest));
    }

    @GetMapping
    public ResponseEntity<List<SkinType>> getAllSkinTypes() {
        return ResponseEntity.ok(skinTypeService.getAllSkinTypes());
    }

    @GetMapping("/{skinTypeId}")
    public ResponseEntity<SkinType> getSkinTypeById(@PathVariable long skinTypeId) {
        return ResponseEntity.ok(skinTypeService.getSkinTypeById(skinTypeId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteSkinType(@PathVariable long id) {
        skinTypeService.deleteSkinType(id);
        return ResponseEntity.ok("Deleted skin type with ID: " + id);
    }

    @PutMapping("/{id}")
    public ResponseEntity<SkinType> updateSkinType(@PathVariable long id, @Valid @RequestBody SkinTypeRequest skinTypeRequest) {
        return ResponseEntity.ok(skinTypeService.updateSkinType(id, skinTypeRequest));
    }
}

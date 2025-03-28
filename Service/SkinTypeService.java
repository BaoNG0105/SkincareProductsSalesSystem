package com.example.SkinCareSellProductSysterm.Service;

import com.example.SkinCareSellProductSysterm.DTO.SkinTypeRequest;
import com.example.SkinCareSellProductSysterm.Entity.SkinType;
import com.example.SkinCareSellProductSysterm.Repository.SkinTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SkinTypeService {
    @Autowired
    private SkinTypeRepository skinTypeRepository;

    public SkinType createSkinType(SkinTypeRequest skinTypeRequest) {
        SkinType skinType = new SkinType();
        skinType.setSkinType(skinTypeRequest.getSkinType());
        return skinTypeRepository.save(skinType);
    }

    public List<SkinType> getAllSkinTypes() {
        return skinTypeRepository.findByIsDeletedFalse();
    }

    public SkinType deleteSkinType(long id) {
        Optional<SkinType> skinTypeOpt = skinTypeRepository.findBySkinTypeIdAndIsDeletedFalse(id);
        if (skinTypeOpt.isEmpty()) {
            throw new RuntimeException("Skin type not found with ID: " + id);
        }
        SkinType skinType = skinTypeOpt.get();
        skinType.setDeleted(true);
        return skinTypeRepository.save(skinType);
    }

    public SkinType updateSkinType(long id, SkinTypeRequest skinTypeRequest) {
        SkinType skinType = skinTypeRepository.findBySkinTypeIdAndIsDeletedFalse(id)
                .orElseThrow(() -> new RuntimeException("Skin type not found with ID: " + id));

        skinType.setSkinType(skinTypeRequest.getSkinType());
        return skinTypeRepository.save(skinType);
    }


    public SkinType getSkinTypeById(long skinTypeId) {
        return skinTypeRepository.findBySkinTypeIdAndIsDeletedFalse(skinTypeId)
                .orElseThrow(() -> new RuntimeException("Skin type not found"));
    }


}

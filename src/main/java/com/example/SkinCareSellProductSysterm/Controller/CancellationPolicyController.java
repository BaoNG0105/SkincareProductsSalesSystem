package com.example.SkinCareSellProductSysterm.Controller;

import com.example.SkinCareSellProductSysterm.DTO.CancellationPolicyRequest;
import com.example.SkinCareSellProductSysterm.Service.CancellationPolicyService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/cancellation-policies")
public class CancellationPolicyController {

    @Autowired
    private CancellationPolicyService cancellationPolicyService;

    @PostMapping
    public ResponseEntity<CancellationPolicy> createCancellationPolicy(@Valid @RequestBody CancellationPolicyRequest request) {
        return ResponseEntity.ok(cancellationPolicyService.createCancellationPolicy(request));
    }

    @GetMapping
    public ResponseEntity<List<CancellationPolicy>> getAllCancellationPolicies() {
        return ResponseEntity.ok(cancellationPolicyService.getAllCancellationPolicies());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CancellationPolicy> getCancellationPolicyById(@PathVariable long id) {
        return ResponseEntity.ok(cancellationPolicyService.getCancellationPolicyById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteCancellationPolicy(@PathVariable long id) {
        cancellationPolicyService.deleteCancellationPolicy(id);
        return ResponseEntity.ok("Deleted cancellation policy with ID: " + id);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CancellationPolicy> updateCancellationPolicy(@PathVariable long id, @Valid @RequestBody CancellationPolicyRequest request) {
        return ResponseEntity.ok(cancellationPolicyService.updateCancellationPolicy(id, request));
    }
}

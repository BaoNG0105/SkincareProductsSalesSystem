package com.example.SkinCareSellProductSysterm.Controller;

import com.example.SkinCareSellProductSysterm.DTO.TestResultRequest;
import com.example.SkinCareSellProductSysterm.Entity.TestResults;
import com.example.SkinCareSellProductSysterm.Service.TestResultService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/test-result")
public class TestResultController {

    @Autowired
    private TestResultService testResultService;

    @PostMapping
    public ResponseEntity<TestResults> createTestResult(@Valid @RequestBody TestResultRequest request) {
        return ResponseEntity.ok(testResultService.createTestResults(request));
    }

    @GetMapping
    public ResponseEntity<List<TestResults>> getTestResultsByUserId(Long userId){
        return ResponseEntity.ok(testResultService.getTestResultsByUserId(userId));
    }


}

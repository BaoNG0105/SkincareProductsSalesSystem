package com.example.SkinCareSellProductSysterm.Controller;

import com.example.SkinCareSellProductSysterm.DTO.FAQRequest;
import com.example.SkinCareSellProductSysterm.Service.FAQService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/faq")
public class FAQController {
    @Autowired
    private FAQService faqService;

    @PostMapping
    public ResponseEntity<FAQ> createFAQ(@Valid @RequestBody FAQRequest faqRequest){
        return ResponseEntity.ok(faqService.createFAQ(faqRequest));
    }

    @GetMapping
    public ResponseEntity<List<FAQ>> getAllFAQ(){
        return ResponseEntity.ok(faqService.getAllFAQ());
    }

    @GetMapping("/{id}")
    public ResponseEntity<FAQ> getFAQById(@PathVariable long id) {
        return ResponseEntity.ok(faqService.getFAQById(id));
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<FAQ>> getFAQsByProductId(@PathVariable long productId){
        return ResponseEntity.ok(faqService.getFAQsByProductId(productId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable long id){
        faqService.delete(id);
        return ResponseEntity.ok("Deleted product with ID: " + id);
    }

}
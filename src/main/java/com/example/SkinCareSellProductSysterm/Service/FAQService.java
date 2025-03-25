package com.example.SkinCareSellProductSysterm.Service;

import com.example.SkinCareSellProductSysterm.DTO.FAQRequest;
import com.example.SkinCareSellProductSysterm.Repository.FAQRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FAQService {
    @Autowired
    private FAQRepository faqRepository;
    @Autowired
    private ProductRepository productRepository;

    public FAQ createFAQ(FAQRequest faqRequest){

        Product product = productRepository.findByProductIdAndStatusTrue(faqRequest.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found with ID: " + faqRequest.getProductId()));

        FAQ faq = new FAQ();
        faq.setProduct(product);
        faq.setQuestion(faqRequest.getQuestion());
        faq.setAnswer(faqRequest.getAnswer());

        return faqRepository.save(faq);
    }

    public List<FAQ> getAllFAQ(){return faqRepository.findByIsDeletedFalse();}

    public FAQ delete(long id){
        Optional<FAQ> faq = faqRepository.findByFaqIdAndIsDeletedFalse(id);
        if (faq.isEmpty()) {
            throw new RuntimeException("FAQ not found with ID: " + id);
        }
        FAQ newFAQ = faq.get();
        newFAQ.setDeleted(true);
        return faqRepository.save(newFAQ);
    }

    public List<FAQ> getFAQsByProductId(long productId) {
        return faqRepository.findByProduct_ProductIdAndIsDeletedFalse(productId);
    }

    public FAQ getFAQById(long faqId) {
        return faqRepository.findByFaqIdAndIsDeletedFalse(faqId)
                .orElseThrow(() -> new RuntimeException("FAQ not found"));
    }

}

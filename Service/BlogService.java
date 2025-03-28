package com.example.SkinCareSellProductSysterm.Service;

import com.example.SkinCareSellProductSysterm.DTO.BlogRequest;
import com.example.SkinCareSellProductSysterm.Entity.Blog;
import com.example.SkinCareSellProductSysterm.Entity.User;
import com.example.SkinCareSellProductSysterm.Repository.BlogRepository;
import com.example.SkinCareSellProductSysterm.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class BlogService {

    @Autowired
    private BlogRepository blogRepository;

    @Autowired
    private UserRepository userRepository;

    // Lấy tất cả blog chưa bị xóa
    public List<Blog> getAllBlogs() {
        return blogRepository.findByIsDeletedFalse();
    }

    // Lấy blog theo ID nếu không bị xóa
    public Blog getBlogById(Long id) {
        return blogRepository.findByIdAndIsDeletedFalse(id)
                .orElseThrow(() -> new RuntimeException("Blog not found"));
    }

    // Lấy tất cả blog của một user theo userId nếu chưa bị xóa
    public List<Blog> getBlogsByUserId(Long userId) {
        return blogRepository.findByAuthor_IdAndIsDeletedFalse(userId);
    }

    // Thêm mới một blog
    public Blog createBlog(BlogRequest blogRequest) {
        User author = userRepository.findByIdAndIsDeletedFalse(blogRequest.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Blog blog = Blog.builder()
                .title(blogRequest.getTitle())
                .content(blogRequest.getContent())
                .category(blogRequest.getCategory())
                .author(author)
                .createdAt(LocalDateTime.now())
                .isDeleted(false)
                .build();

        return blogRepository.save(blog);
    }

    // Cập nhật nội dung blog
    public Blog updateBlog(Long blogId, BlogRequest blogRequest) {
        Blog blog = blogRepository.findByIdAndIsDeletedFalse(blogId)
                .orElseThrow(() -> new RuntimeException("Blog not found"));

        blog.setTitle(blogRequest.getTitle());
        blog.setContent(blogRequest.getContent());
        blog.setCategory(blogRequest.getCategory());
        blog.setUpdatedAt(LocalDateTime.now());

        return blogRepository.save(blog);
    }

    // Xóa blog (soft delete)
    public Blog deleteBlog(Long blogId) {
        Blog blog = blogRepository.findByIdAndIsDeletedFalse(blogId)
                .orElseThrow(() -> new RuntimeException("Blog not found"));
        blog.setDeleted(true);
        return blogRepository.save(blog);
    }
}

package com.example.SkinCareSellProductSysterm.Entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "test_results")
public class TestResults {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "result_id")
    private Long resultId;

    /**
     * Liên kết 1-1 với bảng skin_type_tests qua test_id.
     * Mỗi TestResultService chỉ ứng với đúng 1 SkinTest.
     */
//    @OneToOne
//    @JoinColumn(name = "test_id", referencedColumnName = "test_id", nullable = false)
//    private SkinTest skinTest;

    /**
     * Liên kết ManyToOne tới User.
     * (Có thể xem xét bỏ nếu bạn luôn lấy User qua skinTest.getUser(),
     * nhưng ở đây để dễ truy vấn ta vẫn để riêng.)
     */
    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "user_id", nullable = false)
    private User user;



    /**
     * Liên kết ManyToOne tới SkinType (final_skin_type_id).
     * Nhiều TestResultService có thể có cùng kết quả SkinType.
     */
    @ManyToOne
    @JoinColumn(name = "final_skin_type_id", referencedColumnName = "skin_type_id", nullable = false)
    private SkinType finalSkinType;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "IsDeleted", nullable = false)
    private Boolean isDeleted = false;


    // Getter and Setter

    public Long getResultId() {
        return resultId;
    }

    public void setResultId(Long resultId) {
        this.resultId = resultId;
    }



    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public SkinType getFinalSkinType() {
        return finalSkinType;
    }

    public void setFinalSkinType(SkinType finalSkinType) {
        this.finalSkinType = finalSkinType;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public Boolean getIsDeleted() {
        return isDeleted;
    }

    public void setIsDeleted(Boolean deleted) {
        isDeleted = deleted;
    }
}

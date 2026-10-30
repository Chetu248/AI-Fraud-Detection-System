package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(
        name = "insurance_policies",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_policy_number",
                        columnNames = "policy_number"
                )
        }
)
public class InsurancePolicy extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id ;

    @Column(nullable = false , length = 50)
    private String policyNumber ;

    @Column(nullable = false , length = 50)
    private String policyType ;

    @Column(nullable = false)
    private LocalDate startDate ;

    @Column(nullable = false)
    private LocalDate endDate ;

    @Column(nullable = false , precision = 12 , scale = 2)
    private BigDecimal premiumAmount ;

    @Column(nullable = false , length = 30)
    private String status ;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "vehicle_id" ,
            nullable = false
    )
    private Vehicle vehicle ;

    public InsurancePolicy() {}
}

package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Entity
@Table(
        name = "vehicles" ,
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_vehicle_registration_number" ,
                        columnNames = "registration_number"
                )
        }
)
public class Vehicle extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id ;

    @Column(nullable = false, length = 20)
    private String registrationNumber ;

    @Column(nullable = false, length = 20)
    private String vehicleType ;

    @Column(nullable = false, length = 20)
    private String make ;

    @Column(nullable = false, length = 20)
    private String model ;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "user_id" ,
            nullable = false
    )
    private User user ;

    @OneToMany(
            mappedBy = "vehicle",
            fetch = FetchType.LAZY
    )
    private List<InsurancePolicy> policies;

    public Vehicle(){}
}

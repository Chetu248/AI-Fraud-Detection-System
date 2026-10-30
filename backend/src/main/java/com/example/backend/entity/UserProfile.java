package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(
        name = "user_profiles",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_user_profile_user",
                        columnNames = "user_id"
                )
        }
)
public class UserProfile extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(
            name = "user_id",
            nullable = false,
            unique = true
    )
    private User user;

    private String dateOfBirth;

    private String address;

    private String city;

    private String state;

    @Column(length = 10)
    private String pincode;

    public UserProfile() {}
}
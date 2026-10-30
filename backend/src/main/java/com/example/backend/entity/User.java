package com.example.backend.entity;

import com.example.backend.enums.Role;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Entity
@Table(
        name = "users" ,
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_user_email" , columnNames = "email")
        }
)
public class User extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id ;

    @Column(nullable = false , length = 100)
    private String firstName ;

    @Column(nullable = false , length = 100)
    private String lastName ;

    @Column(nullable = false , unique = true , length = 150)
    private String email ;

    @Column(nullable = false)
    private String password ;

    @Column(nullable = false , length = 20)
    private String phoneNumber ;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false , length = 30)
    private Role role ;

    @Column(nullable = false)
    private boolean active = true ;

    @Column(nullable = false)
    private boolean emailVerified = false ;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private UserProfile profile;

    @OneToMany(
            mappedBy = "user",
            fetch = FetchType.LAZY
    )
    private List<Vehicle> vehicles;

    public User() {}


}

package sgu.server.users;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "users")
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(length = 45, nullable = false, unique = true, name = "first_name")
    private String firstName;
    @Column(length = 45, unique = true, name = "second_name")
    private String secondName;
    @Column(length = 45, nullable = false, unique = true, name = "last_name_1")
    private String lastName1;
    @Column(length = 45, nullable = false, unique = true, name = "last_name_2")
    private String lastName2;
    @Column(length = 150, nullable = false, unique = true, name = "email")
    private String email;
    @Column(length = 10, nullable = false, unique = true, name = "phone_number")
    private String phoneNumber;
}
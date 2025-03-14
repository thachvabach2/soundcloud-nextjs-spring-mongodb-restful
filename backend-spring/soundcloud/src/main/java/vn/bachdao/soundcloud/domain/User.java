package vn.bachdao.soundcloud.domain;

import java.time.Instant;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.bachdao.soundcloud.domain.enumeration.GenderEnum;
import vn.bachdao.soundcloud.domain.enumeration.RoleEnum;

@Document(collection = "users")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class User {

    @Id
    private String id;

    @NotBlank(message = "Email không được để trống")
    private String email;

    @NotBlank(message = "Password không được để trống")
    private String password;
    private String name;
    private int age;

    private GenderEnum gender;

    private String address;
    private RoleEnum role;

    @CreatedDate
    private Instant createdAt;

    private String createdBy;

    @LastModifiedDate
    private Instant updatedAt;

    private String updatedBy;
}

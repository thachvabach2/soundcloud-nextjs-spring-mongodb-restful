package vn.bachdao.soundcloud.domain;

import java.time.Instant;

import org.hibernate.validator.constraints.Range;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.bachdao.soundcloud.domain.enumeration.GenderEnum;
import vn.bachdao.soundcloud.domain.enumeration.RoleEnum;
import vn.bachdao.soundcloud.util.annotation.EnumValidator;

@Document(collection = "users")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class User {

    @Id
    @JsonProperty(value = "_id", index = 0)
    private String id;

    @NotBlank(message = "Email không được để trống")
    private String email;

    @NotBlank(message = "Password không được để trống")
    private String password;

    private boolean isVerify;

    @NotBlank(message = "Name không được để trống")
    private String name;

    @NotNull()
    @Range(min = 1, message = "Age không được để trống")
    private int age;

    @EnumValidator(enumClazz = GenderEnum.class, message = "Gender không được để trống hoặc không đúng format")
    private String gender;

    @NotBlank(message = "Address không được để trống")
    private String address;

    @EnumValidator(enumClazz = RoleEnum.class, message = "Role không được để trống hoặc không đúng format")
    private String role;

    @CreatedDate
    private Instant createdAt;

    private String createdBy;

    @LastModifiedDate
    private Instant updatedAt;

    private String updatedBy;
}

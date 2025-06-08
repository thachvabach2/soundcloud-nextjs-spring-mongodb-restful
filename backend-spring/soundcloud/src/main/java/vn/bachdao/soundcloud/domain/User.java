package vn.bachdao.soundcloud.domain;

import org.hibernate.validator.constraints.Range;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.bachdao.soundcloud.domain.enumeration.GenderEnum;
import vn.bachdao.soundcloud.domain.enumeration.RoleEnum;
import vn.bachdao.soundcloud.util.annotation.EnumValidator;

@Document(collection = "users")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class User extends AbstractAuditingEntity {

    @Id
    @JsonProperty(value = "_id", index = 0)
    private String id;

    @NotBlank(message = "Email không được để trống")
    @Pattern(message = "Email không hợp lệ", regexp = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$")
    private String email;

    @NotBlank(message = "Password không được để trống")
    private String password;

    private Boolean isVerify;

    @NotBlank(message = "Name không được để trống")
    private String name;

    @NotNull()
    @Range(min = 1, message = "Age không được để trống")
    private Integer age;

    @EnumValidator(enumClazz = GenderEnum.class, message = "Gender không được để trống hoặc không đúng format")
    private String gender;

    @NotBlank(message = "Address không được để trống")
    private String address;

    @EnumValidator(enumClazz = RoleEnum.class, message = "Role không được để trống hoặc không đúng format")
    private String role;

    private String refreshToken;
}

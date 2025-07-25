package vn.bachdao.soundcloud.domain;

import org.hibernate.validator.constraints.Range;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.FieldType;
import org.springframework.data.mongodb.core.mapping.MongoId;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.bachdao.soundcloud.config.Constants;
import vn.bachdao.soundcloud.util.annotation.EnumValidator;
import vn.bachdao.soundcloud.util.enumeration.GenderEnum;
import vn.bachdao.soundcloud.util.enumeration.RoleEnum;

@Document(collection = "users")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class User extends AbstractAuditingEntity {

    @MongoId(value = FieldType.OBJECT_ID)
    @JsonProperty(value = "_id", index = 0)
    private String id;

    @NotBlank(message = "Username không được để trống")
    private String username;

    @NotBlank(message = "Email không được để trống")
    @Pattern(message = "Email không hợp lệ", regexp = Constants.LOGIN_REGEX)
    private String email;

    @NotBlank(message = "Password không được để trống")
    private String password;

    private Boolean isVerify;

    private String type;

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

    public void setGender(String gender) {
        this.gender = gender != null ? gender.toUpperCase() : null;
    }

    public void setRole(String role) {
        this.role = role != null ? role.toUpperCase() : null;
    }

    public void setType(String type) {
        this.type = type != null ? type.toUpperCase() : null;
    }
}

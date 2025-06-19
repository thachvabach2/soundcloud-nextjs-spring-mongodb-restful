package vn.bachdao.soundcloud.domain.dto.request.auth;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;
import vn.bachdao.soundcloud.util.annotation.EnumValidator;
import vn.bachdao.soundcloud.util.enumeration.TypeEnum;

@Getter
@Setter
public class ReqSocialLoginDTO {
    @EnumValidator(enumClazz = TypeEnum.class, message = "Type không được để trống hoặc không đúng format")
    private String type;

    @NotBlank(message = "Username không được để trống")
    private String username;
}
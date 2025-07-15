package vn.bachdao.soundcloud.domain.dto.response.auth;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResSocialLoginDTO {
    @JsonProperty(value = "access_token", index = 0)
    private String accessToken;

    @JsonProperty(value = "refresh_token", index = 1)
    private String refreshToken;

    private ResultResSocialLoginDTO user;

    @Getter
    @Setter
    public static class ResultResSocialLoginDTO {

        @JsonProperty(value = "_id", index = 0)
        private String id;

        private String username;
        private String email;
        private String name;
        private Boolean isVerify;
        private String type;
        private String role;
    }

    @Getter
    @Setter
    public static class UserInsideSocialToken {

        private String _id;
        private String username;
        private String email;
        private String name;
        private Boolean isVerify;
        private String role;
        private String type;
    }
}

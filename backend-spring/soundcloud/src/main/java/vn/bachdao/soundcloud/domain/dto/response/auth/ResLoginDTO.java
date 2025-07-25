package vn.bachdao.soundcloud.domain.dto.response.auth;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResLoginDTO {

    @JsonProperty("access_token")
    private String accessToken;

    @JsonProperty("refresh_token")
    private String refreshToken;

    private ResultResLoginDTO user;

    @Getter
    @Setter
    public static class ResultResLoginDTO {

        @JsonProperty("_id")
        private String id;

        private String userName;
        private String email;
        private String address;
        private Boolean isVerify;
        private String type;
        private String name;
        private String role;
    }

    @Getter
    @Setter
    public static class UserInsideToken {

        private String _id;
        private String username;
        private String email;
        private String name;
        private Boolean isVerify;
        private String role;
        private String type;
    }
}
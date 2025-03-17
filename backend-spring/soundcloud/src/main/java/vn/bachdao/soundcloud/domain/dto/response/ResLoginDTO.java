package vn.bachdao.soundcloud.domain.dto.response;

import java.time.Instant;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResLoginDTO {
    @JsonProperty("access_token")
    private String accessToken;

    private ResultResLoginDTO result;

    @Getter
    @Setter
    public static class ResultResLoginDTO {
        @JsonProperty("_id")
        private String id;
        private Instant createdAt;
    }
}
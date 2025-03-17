package vn.bachdao.soundcloud.domain.dto.response.user;

import java.time.Instant;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResCreateUserDTO {
    @JsonProperty(value = "_id", index = 0)
    private String id;
    private Instant createdAt;

}
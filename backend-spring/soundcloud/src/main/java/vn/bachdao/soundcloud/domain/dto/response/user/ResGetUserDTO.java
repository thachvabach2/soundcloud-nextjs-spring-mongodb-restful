package vn.bachdao.soundcloud.domain.dto.response.user;

import java.time.Instant;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResGetUserDTO {

    @JsonProperty(value = "_id", index = 0)
    private String id;
    private String email;
    private Boolean isVerify;
    private String name;
    private Integer age;
    private String gender;
    private String address;
    private String role;
    private Instant createdAt;
    private Instant updatedAt;
}

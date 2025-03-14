package vn.bachdao.soundcloud.domain.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class RestResponse<T> {
    private int statusCode;
    private Object message;
    private String error;
    private T data;
}

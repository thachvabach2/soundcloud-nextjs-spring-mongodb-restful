package vn.bachdao.soundcloud.web.rest.errors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import vn.bachdao.soundcloud.domain.dto.response.RestResponse;

@RestControllerAdvice
public class GlobalException {
    @ExceptionHandler(value = { IdInvalidException.class })
    public ResponseEntity<RestResponse<Object>> handleException(Exception ex) {
        RestResponse<Object> rs = new RestResponse<>();
        rs.setStatusCode(HttpStatus.BAD_REQUEST.value());
        rs.setMessage(ex.getMessage());
        rs.setError("Exception occurs...");

        return ResponseEntity.badRequest().body(rs);
    }
}

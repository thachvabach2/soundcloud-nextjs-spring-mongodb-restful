package vn.bachdao.soundcloud.web.rest.errors;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingRequestHeaderException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import jakarta.validation.ConstraintViolationException;
import vn.bachdao.soundcloud.domain.dto.response.RestResponse;

@RestControllerAdvice
public class GlobalException {
    @ExceptionHandler(value = {
            IdInvalidException.class,
            BadCredentialsException.class,
            EmailAlreadyUsedException.class,
            UsernameAlreadyUsedException.class,
            InvalidHeaderFormatException.class,
            MissingRequestHeaderException.class,
            UserNotAuthenticatedException.class,
            ConstraintViolationException.class,
            LikeIllegalQuantityArgumentException.class,
    })
    public ResponseEntity<RestResponse<Object>> handleException(Exception ex) {
        RestResponse<Object> rs = new RestResponse<>();
        rs.setStatusCode(HttpStatus.BAD_REQUEST.value());
        rs.setMessage(ex.getMessage());
        rs.setError("Exception occurs...");

        return ResponseEntity.badRequest().body(rs);
    }

    @ExceptionHandler(value = { MethodArgumentNotValidException.class })
    public ResponseEntity<RestResponse<Object>> handleMethodArgumentNotValidException(
            MethodArgumentNotValidException ex) {
        BindingResult result = ex.getBindingResult();
        final List<FieldError> fieldErrors = result.getFieldErrors();

        List<String> errors = fieldErrors.stream().map(f -> f.getDefaultMessage()).collect(Collectors.toList());

        RestResponse<Object> rs = new RestResponse<Object>();
        rs.setStatusCode(HttpStatus.BAD_REQUEST.value());
        rs.setMessage(errors.size() > 1 ? errors : errors.get(0));
        rs.setError(ex.getBody().getDetail());

        return ResponseEntity.badRequest().body(rs);
    }

    @ExceptionHandler(value = { StorageException.class })
    public ResponseEntity<RestResponse<Object>> handleFileUploadException(Exception ex) {
        RestResponse<Object> res = new RestResponse<Object>();
        res.setStatusCode(HttpStatus.BAD_REQUEST.value());
        res.setError(ex.getMessage());
        res.setMessage("Exception upload file...");

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(res);
    }

    @ExceptionHandler(NoResourceFoundException.class)
    public ResponseEntity<RestResponse<Object>> handleNotFoundException(NoResourceFoundException ex) {
        RestResponse<Object> res = new RestResponse<Object>();
        res.setStatusCode(HttpStatus.NOT_FOUND.value());
        res.setMessage("404 Not Found, URL may not exist ...");
        res.setError(ex.getMessage());

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(res);
    }
}
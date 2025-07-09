package vn.bachdao.soundcloud.web.rest.errors;

public class UserNotAuthenticatedException extends Exception {
    public UserNotAuthenticatedException(String message) {
        super(message);
    }
}

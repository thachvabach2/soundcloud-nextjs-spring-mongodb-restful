package vn.bachdao.soundcloud.web.rest.errors;

public class UsernameAlreadyUsedException extends Exception {
    public UsernameAlreadyUsedException(String message) {
        super(message);
    }
}

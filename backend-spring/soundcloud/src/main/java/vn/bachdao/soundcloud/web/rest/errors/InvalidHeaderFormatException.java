package vn.bachdao.soundcloud.web.rest.errors;

public class InvalidHeaderFormatException extends Exception {
    public InvalidHeaderFormatException(String errorMessage) {
        super(errorMessage);
    }
}

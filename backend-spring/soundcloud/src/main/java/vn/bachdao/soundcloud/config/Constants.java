package vn.bachdao.soundcloud.config;

public final class Constants {
    public static final String LOGIN_REGEX = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$";

    public static final String SYSTEM = "SYSTEM";

    public static final String ROLE_USER = "USER";

    public static final int CHUNK_SIZE = 1024 * 180; // 180kb ~ 9s-129kps

    private Constants() {
    }
}

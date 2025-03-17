package vn.bachdao.soundcloud.domain.dto.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResPaginationDTO {
    private Meta meta;
    private Object result;

    @Getter
    @Setter
    public static class Meta {
        private int pageNumber;
        private int pageSize;
        private int totalPage;
        private long totalElement;
    }
}

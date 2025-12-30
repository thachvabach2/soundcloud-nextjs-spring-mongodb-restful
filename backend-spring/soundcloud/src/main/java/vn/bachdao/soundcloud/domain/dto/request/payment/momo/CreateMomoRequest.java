package vn.bachdao.soundcloud.domain.dto.request.payment.momo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CreateMomoRequest {
    private String partnerCode;
    private String requestType;
    private String ipnUrl;
    private String redirectUrl;
    private String orderId;
    private long amount;
    private String orderInfo;
    private String requestId;
    private String extraData;
    private String signature;
    private String lang;
}

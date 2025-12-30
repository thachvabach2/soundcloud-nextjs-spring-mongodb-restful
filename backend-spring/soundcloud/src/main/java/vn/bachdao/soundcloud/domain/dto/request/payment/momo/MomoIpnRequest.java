package vn.bachdao.soundcloud.domain.dto.request.payment.momo;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MomoIpnRequest {
    private String orderType;
    private Long amount;
    private String partnerCode;
    private String orderId;
    private String extraData;
    private String signature;
    private Long transId;
    private Long responseTime;
    private Integer resultCode;
    private String message;
    private String payType;
    private String requestId;
    private String orderInfo;
}

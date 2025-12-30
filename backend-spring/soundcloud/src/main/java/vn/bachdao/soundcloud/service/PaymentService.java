package vn.bachdao.soundcloud.service;

import java.nio.charset.StandardCharsets;
import java.util.UUID;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import vn.bachdao.soundcloud.client.MomoClient;
import vn.bachdao.soundcloud.domain.dto.request.payment.momo.CreateMomoRequest;
import vn.bachdao.soundcloud.domain.dto.request.payment.momo.MomoIpnRequest;
import vn.bachdao.soundcloud.domain.dto.response.payment.CreateMomoResponse;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentService {

    @Value("${soundcloud.payment.momo.partner-code}")
    private String partnerCode;

    @Value("${soundcloud.payment.momo.access-key}")
    private String accessKey;

    @Value("${soundcloud.payment.momo.secret-key}")
    private String secretKey;

    @Value("${soundcloud.payment.momo.return-url}")
    private String redirectUrl;

    @Value("${soundcloud.payment.momo.ipn-url}")
    private String ipnUrl;

    @Value("${soundcloud.payment.momo.request-type}")
    private String requestType;

    private final MomoClient momoClient;

    public CreateMomoResponse createQRMomo() {

        String orderId = UUID.randomUUID().toString();
        String orderInfo = "Soundcloud Devtaycode";
        String requestId = UUID.randomUUID().toString();
        String extraData = "Khong co khuyen mai gi het";
        long amount = 65000;

        String rawSignature = String.format(
                "accessKey=%s&amount=%s&extraData=%s&ipnUrl=%s&orderId=%s&orderInfo=%s&partnerCode=%s&redirectUrl=%s&requestId=%s&requestType=%s",
                accessKey, amount, extraData, ipnUrl, orderId, orderInfo, partnerCode, redirectUrl, requestId,
                requestType);

        System.out.println(">>>> check rawSignature: " + rawSignature);

        String signature = hmacSHA256(rawSignature, secretKey);

        CreateMomoRequest request = CreateMomoRequest.builder()
                .partnerCode(partnerCode)
                .requestType(requestType)
                .ipnUrl(ipnUrl)
                .redirectUrl(redirectUrl)
                .orderId(orderId)
                .orderInfo(orderInfo)
                .requestId(requestId)
                .extraData(extraData)
                .amount(amount)
                .signature(signature)
                .lang("vi")
                .build();

        return momoClient.crateMomoQR(request);
    }

    private String hmacSHA256(String data, String secretKey) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKeySpec = new SecretKeySpec(secretKey.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            mac.init(secretKeySpec);
            byte[] rawHmac = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));

            StringBuilder hex = new StringBuilder(2 * rawHmac.length);
            for (byte b : rawHmac) {
                String h = Integer.toHexString(0xff & b);
                if (h.length() == 1)
                    hex.append('0');
                hex.append(h);
            }
            return hex.toString();
        } catch (Exception e) {
            log.error("Error while calculating MoMo HMAC-SHA256 signature", e);
            throw new RuntimeException("Cannot calculate MoMo signature", e);
        }
    }

    public boolean validateIpnSignature(MomoIpnRequest request) {
        if (request == null || request.getSignature() == null) {
            return false;
        }
        String rawSignature = "accessKey=" + accessKey
                + "&amount=" + safeValue(request.getAmount())
                + "&extraData=" + safeValue(request.getExtraData())
                + "&message=" + safeValue(request.getMessage())
                + "&orderId=" + safeValue(request.getOrderId())
                + "&orderInfo=" + safeValue(request.getOrderInfo())
                + "&orderType=" + safeValue(request.getOrderType())
                + "&partnerCode=" + safeValue(request.getPartnerCode())
                + "&payType=" + safeValue(request.getPayType())
                + "&requestId=" + safeValue(request.getRequestId())
                + "&responseTime=" + safeValue(request.getResponseTime())
                + "&resultCode=" + safeValue(request.getResultCode())
                + "&transId=" + safeValue(request.getTransId());
        String expectedSignature = hmacSHA256(rawSignature, secretKey);
        return expectedSignature.equals(request.getSignature());
    }

    private String safeValue(Object value) {
        return value == null ? "" : value.toString();
    }
}

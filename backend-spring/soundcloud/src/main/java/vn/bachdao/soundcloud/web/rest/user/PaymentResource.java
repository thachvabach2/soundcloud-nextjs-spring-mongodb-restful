package vn.bachdao.soundcloud.web.rest.user;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import vn.bachdao.soundcloud.domain.dto.request.payment.momo.MomoIpnRequest;
import vn.bachdao.soundcloud.domain.dto.response.payment.CreateMomoResponse;
import vn.bachdao.soundcloud.service.PaymentService;

@RestController
@RequestMapping("/api/v1/payment")
@RequiredArgsConstructor
@Slf4j
public class PaymentResource {

    private final PaymentService paymentService;

    @PostMapping("/momo")
    public ResponseEntity<CreateMomoResponse> createQRMomo() {
        return ResponseEntity.status(HttpStatus.CREATED).body(this.paymentService.createQRMomo());
    }

    @PostMapping("/momo-ipn")
    public ResponseEntity<Void> momoIpnHandler(@RequestBody MomoIpnRequest request) {
        if (!paymentService.validateIpnSignature(request)) {
            log.error("Invalid Ipn Signature");
            return ResponseEntity.badRequest().build();
        }
        // handle lưu lịch sử giao dịch
        // orderService.handleMomoIpn(request);
        log.info("Valid Ipn Signature");
        return ResponseEntity.noContent().build();
    }
}

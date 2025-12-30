package vn.bachdao.soundcloud.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import vn.bachdao.soundcloud.domain.dto.request.payment.momo.CreateMomoRequest;
import vn.bachdao.soundcloud.domain.dto.response.payment.CreateMomoResponse;

@FeignClient(name = "momo", url = "${soundcloud.payment.momo.end-point}")
public interface MomoClient {

    @PostMapping("/create")
    CreateMomoResponse crateMomoQR(@RequestBody CreateMomoRequest createMomoRequest);
}

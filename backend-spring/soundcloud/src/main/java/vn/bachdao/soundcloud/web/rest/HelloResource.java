package vn.bachdao.soundcloud.web.rest;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;

@RestController
public class HelloResource {
    @GetMapping("/")
    public String getHello() {
        return "Hello World";
    }
}

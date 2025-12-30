package vn.bachdao.soundcloud.web.rest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloResource {
    private static final Logger LOG = LoggerFactory.getLogger(HelloResource.class);

    @GetMapping("/")
    public String getHello() {
        LOG.info("GET API HELLO SUCCESS");

        return "Hello World";
    }

    @GetMapping("/hello")
    @PreAuthorize("hasRole('ADMIN')")
    public String getMethodName() {
        return "Test @PreAuthor";
    }

}

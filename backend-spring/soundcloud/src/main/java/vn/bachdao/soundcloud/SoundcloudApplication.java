package vn.bachdao.soundcloud;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.data.mongodb.config.EnableMongoAuditing;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableMongoAuditing
@EnableAsync
@EnableFeignClients
public class SoundcloudApplication {

    public static void main(String[] args) {
        SpringApplication.run(SoundcloudApplication.class, args);
    }

}

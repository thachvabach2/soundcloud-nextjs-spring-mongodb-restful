package vn.bachdao.soundcloud.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.data.mongodb.core.MongoTemplate;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;

@Configuration
public class MongoConfig {
    @Bean
    public MongoClient mongoClient() {
        return MongoClients.create("mongodb+srv://ngocbach12a1:VXL2QqwQcpRSIrzX@cluster0.qfttq.mongodb.net/");
    }

    @Bean
    public MongoOperations mongoTemplate(MongoClient mongoClient) {
        return new MongoTemplate(mongoClient, "soundcloud");
    }
}
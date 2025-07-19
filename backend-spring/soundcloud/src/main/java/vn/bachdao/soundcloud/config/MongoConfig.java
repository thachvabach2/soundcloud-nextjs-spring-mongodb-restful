package vn.bachdao.soundcloud.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.data.mongodb.core.MongoTemplate;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;

@Configuration
public class MongoConfig {
    @Value("${soundcloud.mongo-uri}")
    private String mongoUri;

    @Bean
    public MongoClient mongoClient() {
        return MongoClients.create(mongoUri);
    }

    @Bean
    public MongoOperations mongoTemplate(MongoClient mongoClient) {
        return new MongoTemplate(mongoClient, "soundcloud");
    }
}
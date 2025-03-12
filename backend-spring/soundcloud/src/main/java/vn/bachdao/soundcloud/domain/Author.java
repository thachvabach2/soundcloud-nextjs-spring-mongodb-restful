package vn.bachdao.soundcloud.domain;

import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@EntityScan
@AllArgsConstructor
@NoArgsConstructor
@Data
@Document(collection = "author")
public class Author {
    @Id
    private String id;
    private String email;
    private int articleCount;
}
package vn.bachdao.soundcloud.domain;

import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.FieldType;
import org.springframework.data.mongodb.core.mapping.MongoId;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Document(collection = "likes")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Like extends AbstractAuditingEntity {
    @MongoId(value = FieldType.OBJECT_ID)
    @JsonProperty(value = "_id", index = 0)
    private String id;

    private Integer quantity;
    private String user;
    private String track;
}
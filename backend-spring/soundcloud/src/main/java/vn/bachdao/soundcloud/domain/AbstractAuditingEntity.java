package vn.bachdao.soundcloud.domain;

import java.time.Instant;

import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@JsonPropertyOrder(alphabetic = false, value = {
        "createdAt", "createdBy", "updatedAt", "updatedBy"
})
public class AbstractAuditingEntity {

    @CreatedDate
    private Instant createdAt;

    @CreatedBy
    private String createdBy;

    @LastModifiedDate
    private Instant updatedAt;

    @LastModifiedBy
    private String updatedBy;
}

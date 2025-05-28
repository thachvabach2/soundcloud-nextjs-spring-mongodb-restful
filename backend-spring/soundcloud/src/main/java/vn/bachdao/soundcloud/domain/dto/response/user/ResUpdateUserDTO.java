package vn.bachdao.soundcloud.domain.dto.response.user;

import org.bson.BsonValue;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ResUpdateUserDTO {
    private boolean acknowledged;
    private long modifiedCount;
    private BsonValue upsertId;
    private int upsertCount;
    private long matchedCount;
}

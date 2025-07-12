package vn.bachdao.soundcloud.util.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

import vn.bachdao.soundcloud.domain.Track;
import vn.bachdao.soundcloud.domain.dto.response.like.ResLikeDTO.ResTrackInLike;

@Mapper(componentModel = "spring", uses = {}, unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface LikeMapper {
    ResTrackInLike toResTrackInLike(Track track);
}

package vn.bachdao.soundcloud.util.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

import vn.bachdao.soundcloud.domain.Track;
import vn.bachdao.soundcloud.domain.dto.request.track.ReqCreateTrackDTO;
import vn.bachdao.soundcloud.domain.dto.request.track.ReqUpdateTrackDTO;

@Mapper(componentModel = "spring", uses = {}, unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface TrackMapper {
    Track toTrack(ReqCreateTrackDTO reqCreateTrackDTO);

    Track toTrack(ReqUpdateTrackDTO reqUpdateTrackDTO);
}

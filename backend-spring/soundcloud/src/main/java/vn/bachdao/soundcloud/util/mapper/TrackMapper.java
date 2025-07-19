package vn.bachdao.soundcloud.util.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import vn.bachdao.soundcloud.domain.Track;
import vn.bachdao.soundcloud.domain.dto.request.track.ReqCreateTrackDTO;
import vn.bachdao.soundcloud.domain.dto.request.track.ReqUpdateTrackDTO;
import vn.bachdao.soundcloud.domain.dto.response.track.ResGetTrackDTO;

@Mapper(componentModel = "spring", uses = {}, unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface TrackMapper {
    Track toTrack(ReqCreateTrackDTO reqCreateTrackDTO);

    Track toTrack(ReqUpdateTrackDTO reqUpdateTrackDTO);

    @Mapping(ignore = true, target = "uploader")
    ResGetTrackDTO toResGetTrackDTO(Track track);

    List<ResGetTrackDTO> toResGetTrackDTOs(List<Track> tracks);
}
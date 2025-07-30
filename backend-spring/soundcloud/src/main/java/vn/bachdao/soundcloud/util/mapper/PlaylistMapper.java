package vn.bachdao.soundcloud.util.mapper;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

import org.bson.types.ObjectId;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

import vn.bachdao.soundcloud.domain.Playlist;
import vn.bachdao.soundcloud.domain.Track;
import vn.bachdao.soundcloud.domain.User;
import vn.bachdao.soundcloud.domain.dto.request.playlist.ReqUpdateAPlaylistDTO;
import vn.bachdao.soundcloud.domain.dto.response.playlist.ResPlaylistDTO;

@Mapper(componentModel = "spring")
public interface PlaylistMapper {

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE, unmappedTargetPolicy = ReportingPolicy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "tracks", expression = "java(mapStringToObjectIdSet(reqUpdateAPlaylistDTO.getTracks()))")
    void updatePlaylistFromDto(ReqUpdateAPlaylistDTO reqUpdateAPlaylistDTO, @MappingTarget Playlist playlist);

    default Set<ObjectId> mapStringToObjectIdSet(Set<String> tracks) {
        if (tracks == null) {
            return null;
        }
        return tracks.stream()
                .map(ObjectId::new)
                .collect(Collectors.toSet());
    }

    @Mapping(target = "uploader", ignore = true)
    ResPlaylistDTO.TrackInfo<ResPlaylistDTO.UserInfo> toTrackInfo(Track track);

    @Mapping(target = "user", ignore = true)
    @Mapping(target = "tracks", ignore = true)
    ResPlaylistDTO toResPlaylistDTO(Playlist playlist);

    @BeanMapping(unmappedTargetPolicy = ReportingPolicy.IGNORE)
    @Mapping(target = "user", ignore = true)
    ResPlaylistDTO toResPlaylistDTOForCreate(Playlist playlist);

    ResPlaylistDTO.UserInfo toUserInfo(User user);

    // helper
    @Named("objectIdToString")
    default String objectIdToString(ObjectId objectId) {
        return objectId != null ? objectId.toString() : null;
    }

    @Named("objectIdListToStringList")
    default Set<String> objectIdListToStringList(Set<ObjectId> objectIds) {
        if (objectIds == null) {
            return new HashSet<>();
        }
        return objectIds.stream()
                .map(ObjectId::toString)
                .collect(Collectors.toSet());
    }
}
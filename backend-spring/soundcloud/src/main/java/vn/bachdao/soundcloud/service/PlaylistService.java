package vn.bachdao.soundcloud.service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

import org.bson.Document;
import org.bson.types.ObjectId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;

import com.mongodb.client.result.UpdateResult;

import vn.bachdao.soundcloud.domain.Playlist;
import vn.bachdao.soundcloud.domain.Track;
import vn.bachdao.soundcloud.domain.User;
import vn.bachdao.soundcloud.domain.dto.request.playlist.ReqCreateAnEmptyPlaylist;
import vn.bachdao.soundcloud.domain.dto.request.playlist.ReqUpdateAPlaylistDTO;
import vn.bachdao.soundcloud.domain.dto.response.ResPaginationDTO;
import vn.bachdao.soundcloud.domain.dto.response.playlist.ResPlaylistDTO;
import vn.bachdao.soundcloud.repository.PlaylistRepository;
import vn.bachdao.soundcloud.repository.TrackRepository;
import vn.bachdao.soundcloud.security.SecurityUtils;
import vn.bachdao.soundcloud.util.mapper.PlaylistMapper;
import vn.bachdao.soundcloud.web.rest.errors.IdInvalidException;
import vn.bachdao.soundcloud.web.rest.errors.UserNotAuthenticatedException;

@Service
public class PlaylistService {

    private final PlaylistRepository playlistRepository;
    private final PlaylistMapper playlistMapper;
    private final TrackRepository trackRepository;
    private final MongoTemplate mongoTemplate;
    private final UserService userService;

    public PlaylistService(PlaylistRepository playlistRepository, PlaylistMapper playlistMapper,
            TrackRepository trackRepository, MongoTemplate mongoTemplate,
            UserService userService) {
        this.playlistRepository = playlistRepository;
        this.playlistMapper = playlistMapper;
        this.trackRepository = trackRepository;
        this.mongoTemplate = mongoTemplate;
        this.userService = userService;
    }

    public ResPlaylistDTO createAnEmptyPlaylist(ReqCreateAnEmptyPlaylist req)
            throws UserNotAuthenticatedException, IdInvalidException {
        String userId = SecurityUtils.getCurrentUserLogin()
                .orElseThrow(() -> new UserNotAuthenticatedException("User not authenticated"));

        User userDB = this.userService.getUserById(userId)
                .orElseThrow(() -> new IdInvalidException("User với id: '" + userId + "' không tồn tại"));

        Playlist playlist = new Playlist();
        playlist.setTitle(req.getTitle());
        playlist.setIsPublic(req.getIsPublic());
        playlist.setUser(new ObjectId(userId));
        playlist.setTracks(new HashSet<>());
        playlist.setIsDeleted(false);

        Playlist playlistDB = this.playlistRepository.insert(playlist);

        ResPlaylistDTO res = this.playlistMapper.toResPlaylistDTOForCreate(playlistDB);

        ResPlaylistDTO.UserInfo userInfo = new ResPlaylistDTO.UserInfo();
        userInfo.setId(userDB.getId());
        userInfo.setUsername(userDB.getUsername());
        userInfo.setEmail(userDB.getEmail());
        userInfo.setName(userDB.getName());
        userInfo.setRole(userDB.getRole());
        userInfo.setType(userDB.getType());

        res.setUser(userInfo);

        return res;
    }

    public ResPlaylistDTO updateAPlaylist(ReqUpdateAPlaylistDTO req) throws IdInvalidException {
        Playlist playlistDB = this.playlistRepository.findByIdAndIsDeletedFalse(req.getId())
                .orElseThrow(() -> new IdInvalidException(
                        "Playlist với id: '" + req.getId() + "' không tồn tại hoặc đã bị xóa"));

        User userDB = this.userService.getUserById(playlistDB.getUser().toHexString())
                .orElseThrow(() -> new IdInvalidException("User với id: '" + playlistDB.getUser() + "' không tồn tại"));

        // binding req -> playlist (except field null)
        this.playlistMapper.updatePlaylistFromDto(req, playlistDB);

        Playlist updatedPlaylist = this.playlistRepository.save(playlistDB);

        Set<ObjectId> trackObjectIds = updatedPlaylist.getTracks();

        Set<ResPlaylistDTO.TrackInfo<ResPlaylistDTO.UserInfo>> trackInfos = null;

        if (trackObjectIds != null && !trackObjectIds.isEmpty()) {
            Set<Track> tracks = trackRepository.findByIdIn(trackObjectIds);

            // Lấy tất cả uploader ids từ tracks
            Set<ObjectId> uploaderIds = tracks.stream()
                    .map(Track::getUploader)
                    .filter(Objects::nonNull)
                    .collect(Collectors.toSet());

            // Lấy tất cả users một lần thay vì query từng cái
            Map<String, User> uploaderMap = this.userService.getUsersByIds(uploaderIds)
                    .stream()
                    .collect(Collectors.toMap(User::getId, user -> user));

            trackInfos = tracks.stream()
                    .map(track -> {
                        User uploader = uploaderMap.get(track.getUploader().toHexString());
                        ResPlaylistDTO.UserInfo uploaderInfo = this.playlistMapper.toUserInfo(uploader);
                        ResPlaylistDTO.TrackInfo<ResPlaylistDTO.UserInfo> trackInfo = this.playlistMapper
                                .toTrackInfo(track);
                        trackInfo.setUploader(uploaderInfo);
                        return trackInfo;
                    })
                    .collect(Collectors.toSet());
        }

        ResPlaylistDTO res = this.playlistMapper.toResPlaylistDTO(updatedPlaylist);
        ResPlaylistDTO.UserInfo userInfo = new ResPlaylistDTO.UserInfo();
        userInfo.setId(userDB.getId());
        userInfo.setUsername(userDB.getUsername());
        userInfo.setEmail(userDB.getEmail());
        userInfo.setName(userDB.getName());
        userInfo.setRole(userDB.getRole());
        userInfo.setType(userDB.getType());

        res.setTracks(trackInfos);
        res.setUser(userInfo);

        return res;
    }

    public UpdateResult deleteAPlaylistById(String id) throws UserNotAuthenticatedException, IdInvalidException {
        String userId = SecurityUtils.getCurrentUserLogin()
                .orElseThrow(() -> new UserNotAuthenticatedException("User not authenticated"));

        Query query = new Query();
        query.addCriteria(
                Criteria.where("_id").is(new ObjectId(id))
                        .and("isDeleted").is(false)
                        .and("user").is(new ObjectId(userId)));

        Update update = new Update().set("isDeleted", true);
        UpdateResult result = mongoTemplate.updateFirst(query, update, Playlist.class);

        if (result.getMatchedCount() == 0) {
            throw new IdInvalidException(
                    "Cannot delete playlist. It may not exist, already deleted, or you don't have permission.");
        }

        return result;
    }

    public ResPlaylistDTO getAPlaylistById(String id) throws IdInvalidException {
        Playlist playlistDB = this.playlistRepository.findByIdAndIsDeletedFalse(id)
                .orElseThrow(
                        () -> new IdInvalidException("Playlist với id: '" + id + "' không tồn tại hoặc đã bị xóa"));

        User userDB = this.userService.getUserById(playlistDB.getUser().toHexString())
                .orElseThrow(() -> new IdInvalidException("User với id: '" + playlistDB.getUser() + "' không tồn tại"));

        Set<ObjectId> trackObjectIds = playlistDB.getTracks();

        Set<ResPlaylistDTO.TrackInfo<ResPlaylistDTO.UserInfo>> trackInfos = null;

        if (trackObjectIds != null && !trackObjectIds.isEmpty()) {
            Set<Track> tracks = trackRepository.findByIdIn(trackObjectIds);

            // Lấy tất cả uploader ids từ tracks
            Set<ObjectId> uploaderIds = tracks.stream()
                    .map(Track::getUploader)
                    .filter(Objects::nonNull)
                    .collect(Collectors.toSet());

            // Lấy tất cả users một lần thay vì query từng cái
            Map<String, User> uploaderMap = this.userService.getUsersByIds(uploaderIds)
                    .stream()
                    .collect(Collectors.toMap(User::getId, user -> user));

            trackInfos = tracks.stream()
                    .map(track -> {
                        User uploader = uploaderMap.get(track.getUploader().toHexString());
                        ResPlaylistDTO.UserInfo uploaderInfo = this.playlistMapper.toUserInfo(uploader);
                        ResPlaylistDTO.TrackInfo<ResPlaylistDTO.UserInfo> trackInfo = this.playlistMapper
                                .toTrackInfo(track);
                        trackInfo.setUploader(uploaderInfo);
                        return trackInfo;
                    })
                    .collect(Collectors.toSet());
        }

        ResPlaylistDTO res = this.playlistMapper.toResPlaylistDTO(playlistDB);

        ResPlaylistDTO.UserInfo userInfo = new ResPlaylistDTO.UserInfo();
        userInfo.setId(userDB.getId());
        userInfo.setUsername(userDB.getUsername());
        userInfo.setEmail(userDB.getEmail());
        userInfo.setName(userDB.getName());
        userInfo.setRole(userDB.getRole());
        userInfo.setType(userDB.getType());

        res.setUser(userInfo);
        res.setTracks(trackInfos);

        return res;
    }

    public ResPaginationDTO getPlaylistsWithPagination(Pageable pageable) {
        Aggregation aggregation = Aggregation.newAggregation(
                Aggregation.match(Criteria.where("isDeleted").is(false)),

                Aggregation.lookup("users", "user", "_id", "user"),
                Aggregation.lookup("tracks", "tracks", "_id", "trackArray"),

                Aggregation.unwind("user", true),
                Aggregation.unwind("trackArray", true),

                // Lookup uploader cho từng track
                Aggregation.lookup("users", "trackArray.uploader", "_id", "trackArray.uploaderInfo"),
                Aggregation.unwind("trackArray.uploaderInfo", true),

                // Group lại để gom các tracks vào array
                Aggregation.group("_id")
                        .first("title").as("title")
                        .first("isPublic").as("isPublic")
                        .first("user").as("user")
                        .first("isDeleted").as("isDeleted")
                        .first("createdAt").as("createdAt")
                        .first("updatedAt").as("updatedAt")
                        .first("createdBy").as("createdBy")
                        .first("updatedBy").as("updatedBy")
                        .push(
                                new Document("_id", "$trackArray._id")
                                        .append("title", "$trackArray.title")
                                        .append("artist", "$trackArray.artist")
                                        .append("description", "$trackArray.description")
                                        .append("category", "$trackArray.category")
                                        .append("imgUrl", "$trackArray.imgUrl")
                                        .append("trackUrl", "$trackArray.trackUrl")
                                        .append("countLike", "$trackArray.countLike")
                                        .append("countPlay", "$trackArray.countPlay")
                                        .append("uploader", new Document("_id", "$trackArray.uploaderInfo._id")
                                                .append("username", "$trackArray.uploaderInfo.username")
                                                .append("email", "$trackArray.uploaderInfo.email")
                                                .append("name", "$trackArray.uploaderInfo.name")
                                                .append("role", "$trackArray.uploaderInfo.role")
                                                .append("type", "$trackArray.uploaderInfo.type")))
                        .as("tracks"),

                // Project các fields cần thiết
                Aggregation.project()
                        .and("_id").as("id")
                        .and("title").as("title")
                        .and("isPublic").as("isPublic")

                        .and("user").as("user")
                        .and("tracks").as("tracks")

                        .and("isDeleted").as("isDeleted")
                        .and("createdAt").as("createdAt")
                        .and("updatedAt").as("updatedAt")
                        .and("createdBy").as("createdBy")
                        .and("updatedBy").as("updatedBy"),

                Aggregation.facet(
                        Aggregation.skip(pageable.getOffset()),
                        Aggregation.limit(pageable.getPageSize())).as("data")
                        .and(Aggregation.count().as("count")).as("total"));

        AggregationResults<Document> results = mongoTemplate.aggregate(
                aggregation, Playlist.class, Document.class);

        Document result = results.getUniqueMappedResult();

        // Extract data và total count
        List<ResPlaylistDTO> playlists = new ArrayList<>();
        long totalElements = 0;

        if (result != null) {
            List<Document> dataList = result.getList("data", Document.class);
            if (dataList != null) {
                playlists = dataList.stream()
                        .map(doc -> mongoTemplate.getConverter().read(ResPlaylistDTO.class, doc))
                        .collect(Collectors.toList());
            }

            List<Document> totalList = result.getList("total", Document.class);
            if (totalList != null && !totalList.isEmpty()) {
                totalElements = totalList.get(0).getInteger("count", 0);
            }
        }

        Page<ResPlaylistDTO> playlistPage = new PageImpl<>(playlists, pageable, totalElements);
        ResPaginationDTO res = new ResPaginationDTO();
        ResPaginationDTO.Meta meta = new ResPaginationDTO.Meta();
        meta.setPageNumber(playlistPage.getNumber() + 1);
        meta.setPageSize(playlistPage.getSize());
        meta.setTotalPage(playlistPage.getTotalPages());
        meta.setTotalElement(playlistPage.getTotalElements());

        List<ResPlaylistDTO> resPlaylistDTOs = playlistPage.getContent();

        res.setResult(resPlaylistDTOs);
        res.setMeta(meta);

        return res;
    }

    public ResPaginationDTO getPlaylistsByUserWithJoin(Pageable pageable) throws UserNotAuthenticatedException {
        String userId = SecurityUtils.getCurrentUserLogin()
                .orElseThrow(() -> new UserNotAuthenticatedException("User not authenticated"));

        Aggregation aggregation = Aggregation.newAggregation(
                Aggregation.match(Criteria.where("isDeleted").is(false).and("user").is(new ObjectId(userId))),

                Aggregation.lookup("users", "user", "_id", "user"),
                Aggregation.lookup("tracks", "tracks", "_id", "trackArray"),

                Aggregation.unwind("user", true),
                Aggregation.unwind("trackArray", true),

                // Lookup uploader cho từng track
                Aggregation.lookup("users", "trackArray.uploader", "_id", "trackArray.uploaderInfo"),
                Aggregation.unwind("trackArray.uploaderInfo", true),

                // Group lại để gom các tracks vào array
                Aggregation.group("_id")
                        .first("title").as("title")
                        .first("isPublic").as("isPublic")
                        .first("user").as("user")
                        .first("isDeleted").as("isDeleted")
                        .first("createdAt").as("createdAt")
                        .first("updatedAt").as("updatedAt")
                        .first("createdBy").as("createdBy")
                        .first("updatedBy").as("updatedBy")
                        .push(
                                new Document("_id", "$trackArray._id")
                                        .append("title", "$trackArray.title")
                                        .append("artist", "$trackArray.artist")
                                        .append("description", "$trackArray.description")
                                        .append("category", "$trackArray.category")
                                        .append("imgUrl", "$trackArray.imgUrl")
                                        .append("trackUrl", "$trackArray.trackUrl")
                                        .append("countLike", "$trackArray.countLike")
                                        .append("countPlay", "$trackArray.countPlay")
                                        .append("uploader", new Document("_id", "$trackArray.uploaderInfo._id")
                                                .append("username", "$trackArray.uploaderInfo.username")
                                                .append("email", "$trackArray.uploaderInfo.email")
                                                .append("name", "$trackArray.uploaderInfo.name")
                                                .append("role", "$trackArray.uploaderInfo.role")
                                                .append("type", "$trackArray.uploaderInfo.type")))
                        .as("tracks"),

                // Project các fields cần thiết
                Aggregation.project()
                        .and("_id").as("id")
                        .and("title").as("title")
                        .and("isPublic").as("isPublic")

                        .and("user").as("user")
                        .and("tracks").as("tracks")

                        .and("isDeleted").as("isDeleted")
                        .and("createdAt").as("createdAt")
                        .and("updatedAt").as("updatedAt")
                        .and("createdBy").as("createdBy")
                        .and("updatedBy").as("updatedBy"),

                Aggregation.facet(
                        Aggregation.skip(pageable.getOffset()),
                        Aggregation.limit(pageable.getPageSize())).as("data")
                        .and(Aggregation.count().as("count")).as("total"));

        AggregationResults<Document> results = mongoTemplate.aggregate(
                aggregation, Playlist.class, Document.class);

        Document result = results.getUniqueMappedResult();

        // Extract data và total count
        List<ResPlaylistDTO> playlists = new ArrayList<>();
        long totalElements = 0;

        if (result != null) {
            List<Document> dataList = result.getList("data", Document.class);
            if (dataList != null) {
                playlists = dataList.stream()
                        .map(doc -> mongoTemplate.getConverter().read(ResPlaylistDTO.class, doc))
                        .collect(Collectors.toList());
            }

            List<Document> totalList = result.getList("total", Document.class);
            if (totalList != null && !totalList.isEmpty()) {
                totalElements = totalList.get(0).getInteger("count", 0);
            }
        }

        Page<ResPlaylistDTO> playlistPage = new PageImpl<>(playlists, pageable, totalElements);
        ResPaginationDTO res = new ResPaginationDTO();
        ResPaginationDTO.Meta meta = new ResPaginationDTO.Meta();
        meta.setPageNumber(playlistPage.getNumber() + 1);
        meta.setPageSize(playlistPage.getSize());
        meta.setTotalPage(playlistPage.getTotalPages());
        meta.setTotalElement(playlistPage.getTotalElements());

        List<ResPlaylistDTO> resPlaylistDTOs = playlistPage.getContent();

        res.setResult(resPlaylistDTOs);
        res.setMeta(meta);

        return res;
    }

    public Playlist addTrackToPlaylist(String playlistId, String trackId)
            throws IdInvalidException, UserNotAuthenticatedException {
        String userId = SecurityUtils.getCurrentUserLogin()
                .orElseThrow(() -> new UserNotAuthenticatedException("User not authenticated"));

        Playlist playlistDB = this.playlistRepository.findByIdAndIsDeletedFalseAndUser(playlistId, new ObjectId(userId))
                .orElseThrow(() -> new IdInvalidException(
                        "Playlist với id: '" + playlistId
                                + "' không tồn tại hoặc đã bị xóa hoặc không có permission add track vào playlist này"));

        playlistDB.getTracks().add(new ObjectId(trackId));

        return this.playlistRepository.save(playlistDB);
    }

    public List<Playlist> getPlaylistsByUserWithNoJoin() throws UserNotAuthenticatedException {
        String userId = SecurityUtils.getCurrentUserLogin()
                .orElseThrow(() -> new UserNotAuthenticatedException("User not authenticated"));

        List<Playlist> playlists = this.playlistRepository.findAllByUser(new ObjectId(userId));

        return playlists;
    }
}
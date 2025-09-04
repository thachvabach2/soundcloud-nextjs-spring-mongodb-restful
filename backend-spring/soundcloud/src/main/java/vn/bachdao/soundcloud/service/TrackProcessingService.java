package vn.bachdao.soundcloud.service;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Optional;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.event.EventListener;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import vn.bachdao.soundcloud.domain.Track;
import vn.bachdao.soundcloud.service.event.TrackCreatedEvent;
import vn.bachdao.soundcloud.web.rest.errors.IdInvalidException;

@Component
public class TrackProcessingService {

    @Value("${soundcloud.track.hsl}")
    private String HSL_DIR;

    @Value("${soundcloud.upload.upload-file.path}")
    private String UPLOAD_DIR;

    private MongoTemplate mongoTemplate;

    public TrackProcessingService(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    @Async
    @EventListener
    public void handleTrackCreatedAsync(TrackCreatedEvent event) {
        try {
            processTrack(event.getTrackId());
        } catch (Exception e) {
            System.err.println("Error processing track: " + event.getTrackId() + " - " + e.getMessage());
        }
    }

    public void processTrack(String trackId) throws Exception {
        Optional<Track> trackOpt = Optional.ofNullable(
                mongoTemplate.findById(new ObjectId(trackId), Track.class));

        if (trackOpt.isEmpty()) {
            throw new IdInvalidException("Track với id = " + trackId + " không tồn tại");
        }

        Track track = trackOpt.get();
        Path trackPath = Paths.get(UPLOAD_DIR + "/tracks", track.getTrackUrl());

        Path outputPath = Paths.get(HSL_DIR, trackId);
        Files.createDirectories(outputPath);

        ProcessBuilder processBuilder = new ProcessBuilder();
        processBuilder.command(
                "ffmpeg",
                "-i", trackPath.toString(),
                "-c:a", "aac",
                "-b:a", "128k",
                "-vn",
                "-hls_time", "10",
                "-hls_list_size", "0",
                "-hls_segment_filename", outputPath.toString() + "/segment_%03d.ts",
                outputPath.toString() + "/master.m3u8");

        processBuilder.inheritIO();
        Process process = processBuilder.start();
        int exit = process.waitFor();

        if (exit != 0) {
            System.err.println("FFmpeg process failed with exit code: " + exit);
            throw new RuntimeException("Track processing failed!!");
        }
    }
}

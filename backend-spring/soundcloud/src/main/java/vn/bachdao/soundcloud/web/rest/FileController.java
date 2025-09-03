package vn.bachdao.soundcloud.web.rest;

import java.io.IOException;
import java.net.URISyntaxException;
import java.time.Instant;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import vn.bachdao.soundcloud.domain.dto.response.file.ResUploadFileDTO;
import vn.bachdao.soundcloud.service.FileService;
import vn.bachdao.soundcloud.util.annotation.ApiMessage;
import vn.bachdao.soundcloud.web.rest.errors.IdInvalidException;
import vn.bachdao.soundcloud.web.rest.errors.InvalidHeaderFormatException;
import vn.bachdao.soundcloud.web.rest.errors.StorageException;

@RestController
@RequestMapping("/api/v1")
public class FileController {

    @Value("${soundcloud.upload.upload-file.base-uri}")
    private String baseURI;

    private FileService fileService;

    public FileController(FileService fileService) {
        this.fileService = fileService;
    }

    @PostMapping("/files/upload")
    @ApiMessage("Upload single file")
    public ResponseEntity<ResUploadFileDTO> upload(
            @RequestParam(name = "fileUpload", required = false) MultipartFile file,
            @RequestHeader("target_type") String targetType)
            throws URISyntaxException, IOException, StorageException, InvalidHeaderFormatException, IdInvalidException {

        // validate
        if (file == null || file.isEmpty()) {
            throw new StorageException("File is empty. Please upload a file");
        }
        String fileName = file.getOriginalFilename();

        if (targetType.equals("tracks")) {
            List<String> allowedExtensionsTrack = Arrays.asList("mp3", "mp4", "wav", "flac");
            boolean isValidTrack = allowedExtensionsTrack.stream()
                    .anyMatch(item -> fileName.toLowerCase().endsWith(item));

            if (!isValidTrack) {
                throw new StorageException("Invalid file extension. only allows " +
                        allowedExtensionsTrack.toString());
            }
        } else if (targetType.equals("images")) {
            List<String> allowedExtensionsImage = Arrays.asList("jpg", "jpeg", "png");
            boolean isValidImage = allowedExtensionsImage.stream()
                    .anyMatch(item -> fileName.toLowerCase().endsWith(item));

            if (!isValidImage) {
                throw new StorageException("Invalid file extension. only allows " +
                        allowedExtensionsImage.toString());
            }
        } else {
            throw new InvalidHeaderFormatException("Chưa truyền target_type ở header hoặc truyền sai");
        }

        this.fileService.createDirectory(baseURI + "/" + targetType);
        String uploadFile = this.fileService.store(file, targetType);
        ResUploadFileDTO res = new ResUploadFileDTO(uploadFile, Instant.now());
        return ResponseEntity.ok(res);
    }
}

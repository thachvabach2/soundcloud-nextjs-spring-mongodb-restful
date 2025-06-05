package vn.bachdao.soundcloud.web.rest;

import java.io.IOException;
import java.net.URISyntaxException;
import java.time.Instant;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import vn.bachdao.soundcloud.domain.dto.response.file.ResUploadFileDTO;
import vn.bachdao.soundcloud.service.FileService;
import vn.bachdao.soundcloud.util.annotation.ApiMessage;
import vn.bachdao.soundcloud.web.rest.errors.StorageException;

@RestController
@RequestMapping("/api/v1")
public class FileUploadController {

    @Value("${soundcloud.upload.upload-file.base-uri}")
    private String baseURI;

    private FileService fileService;

    public FileUploadController(FileService fileService) {
        this.fileService = fileService;
    }

    @PostMapping("/files")
    @ApiMessage("Upload single file")
    public ResponseEntity<ResUploadFileDTO> upload(
            @RequestParam(name = "fileUpload", required = false) MultipartFile file)
            throws URISyntaxException, IOException, StorageException {

        // validate
        if (file == null || file.isEmpty()) {
            throw new StorageException("File is empty. Please upload a file");
        }
        String fileName = file.getOriginalFilename();
        List<String> allowedExtensions = Arrays.asList("mp3", "mp4", "wav", "flac");
        boolean isValid = allowedExtensions.stream().anyMatch(item -> fileName.toLowerCase().endsWith(item));

        if (!isValid) {
            throw new StorageException("Invalid file extension. only allows " +
                    allowedExtensions.toString());
        }

        // create a directory if not exist
        this.fileService.createDirectory(baseURI);

        // store file
        String uploadFile = this.fileService.store(file);

        ResUploadFileDTO res = new ResUploadFileDTO(uploadFile, Instant.now());

        return ResponseEntity.ok(res);
    }
}

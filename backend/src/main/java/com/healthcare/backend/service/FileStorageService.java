package com.healthcare.backend.service;

import com.healthcare.backend.exception.BadRequestException;
import com.healthcare.backend.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

@Service
public class FileStorageService {

    private static final Set<String> ALLOWED_EXTENSIONS = Set.of("pdf", "png", "jpg", "jpeg");

    private static final Map<String, String> CONTENT_TYPES = Map.of(
            "pdf", "application/pdf",
            "png", "image/png",
            "jpg", "image/jpeg",
            "jpeg", "image/jpeg"
    );

    private final Path rootLocation;

    public FileStorageService(@Value("${app.upload.dir}") String uploadDir) {
        this.rootLocation = Paths.get(uploadDir).toAbsolutePath().normalize();
        try {
            Files.createDirectories(rootLocation);
        } catch (IOException ex) {
            throw new IllegalStateException("Could not create the upload folder", ex);
        }
    }

    public StoredFile store(MultipartFile file) {
        String original = file.getOriginalFilename();
        if (original == null || original.isBlank()) {
            throw new BadRequestException("File name is missing");
        }

        String cleaned = StringUtils.cleanPath(original);
        if (cleaned.contains("..")) {
            throw new BadRequestException("Invalid file name");
        }

        String fileName = cleaned.substring(cleaned.lastIndexOf('/') + 1);
        if (fileName.length() > 200) {
            throw new BadRequestException("File name is too long");
        }

        String extension = getExtension(fileName);
        if (!ALLOWED_EXTENSIONS.contains(extension)) {
            throw new BadRequestException("Only PDF, PNG, JPG and JPEG files are allowed");
        }

        String storedName = UUID.randomUUID() + "." + extension;
        Path target = rootLocation.resolve(storedName).normalize();

        try (InputStream in = file.getInputStream()) {
            Files.copy(in, target, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException ex) {
            throw new IllegalStateException("Could not save the file", ex);
        }

        return new StoredFile(fileName, storedName);
    }

    public Resource load(String storedName) {
        Path file = rootLocation.resolve(storedName).normalize();

        if (!file.startsWith(rootLocation)) {
            throw new ResourceNotFoundException("File not found");
        }

        Resource resource = new FileSystemResource(file);
        if (!resource.exists() || !resource.isReadable()) {
            throw new ResourceNotFoundException("File not found");
        }

        return resource;
    }

    public String getContentType(String fileName) {
        return CONTENT_TYPES.getOrDefault(getExtension(fileName), "application/octet-stream");
    }

    private String getExtension(String fileName) {
        int dot = fileName.lastIndexOf('.');
        if (dot < 0 || dot == fileName.length() - 1) {
            return "";
        }
        return fileName.substring(dot + 1).toLowerCase(Locale.ROOT);
    }

    public record StoredFile(String originalName, String storedName) {
    }
}
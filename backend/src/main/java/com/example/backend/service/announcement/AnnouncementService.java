package com.example.backend.service.announcement;

import com.example.backend.dto.board.AnnFile;
import com.example.backend.dto.board.Announcement;
import com.example.backend.mapper.announcement.AnnouncementMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.ObjectCannedACL;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@Service
@Transactional
@RequiredArgsConstructor
public class AnnouncementService {

    final AnnouncementMapper mapper;
    final S3Client s3;
    @Value("${image.src.prefix}")
    String imageSrcPrefix;

    @Value("${bucket.name}")
    String bucketName;

    public Map<String, Object> listAnnouncement(Integer page) {

        return Map.of("list", mapper.selectAnnouncement((page - 1) * 10),
                "count", mapper.getAnnouncementCount());
    }

    public Announcement getAnnView(int id) {
        Announcement announcement = mapper.selectByAnnId(id);
        List<String> fileNameList = mapper.selectFilesByAnnId(id);
        List<AnnFile> fileSrcList = fileNameList.stream()
                .map(name -> new AnnFile(name, imageSrcPrefix + "/Announcement/" + id + "/" + name)).toList();
        announcement.setFileList(fileSrcList);
        return announcement;
    }

    public boolean addAnn(Announcement announcement, Authentication auth, MultipartFile[] files) {
        announcement.setWriter(auth.getName());

        int cnt = mapper.insertAnn(announcement);

        if (files != null && files.length > 0) {
            for (MultipartFile file : files) {
                String objectKey = "prj241126/Announcement/" + announcement.getId() + "/" + file.getOriginalFilename();
                PutObjectRequest por = PutObjectRequest.builder()
                        .bucket(bucketName)
                        .key(objectKey)
                        .acl(ObjectCannedACL.PUBLIC_READ)
                        .build();

                try {
                    s3.putObject(por, RequestBody.fromInputStream(file.getInputStream(), file.getSize()));
                } catch (IOException e) {
                    throw new RuntimeException(e);
                }
                //file 테이블에 파일명 입력
                mapper.insertAnnFile(announcement.getId(), file.getOriginalFilename());
            }
        }

        return cnt == 1;
    }

    public boolean validateAnn(Announcement announcement) {
        boolean title = !announcement.getTitle().trim().isEmpty();
        boolean content = !announcement.getContent().trim().isEmpty();

        return title && content;
    }

    public boolean hasAccessAnn(Integer id, Authentication auth) {
        Announcement ann = mapper.selectByAnnId(id);
        return ann.getWriter().equals(auth.getName());
    }

    public boolean updateAnn(Announcement announcement, List<String> removeFiles, MultipartFile[] updateFiles) {

        System.out.println(announcement.getId());

        if (removeFiles != null) {
            for (String file : removeFiles) {
                String key = "prj241126/Announcement/" + announcement.getId() + "/" + file;
                DeleteObjectRequest dor = DeleteObjectRequest.builder()
                        .bucket(bucketName)
                        .key(key)
                        .build();
                s3.deleteObject(dor);
                mapper.deleteFileByAnnIdAndName(announcement.getId(), file);
            }
        }

        if (updateFiles != null && updateFiles.length > 0) {
            for (MultipartFile file : updateFiles) {
                String key = "prj241126/Announcement/" + announcement.getId() + "/" + file.getOriginalFilename();
                PutObjectRequest por = PutObjectRequest.builder()
                        .bucket(bucketName)
                        .key(key)
                        .acl(ObjectCannedACL.PUBLIC_READ)
                        .build();

                try {
                    s3.putObject(por, RequestBody.fromInputStream(file.getInputStream(), file.getSize()));
                } catch (IOException e) {
                    throw new RuntimeException(e);
                }
                //file 테이블에 파일명 입력
                mapper.insertAnnFile(announcement.getId(), file.getOriginalFilename());
            }
        }

        int cnt = mapper.updateAnn(announcement);

        return cnt == 1;
    }

    public boolean removeAnn(int id) {
        //게시물 지우기전에
        //첨부파일 지우기

        //실제 파일(s3) 지우기
        //현재파일명 얻어오기
        List<String> fileName = mapper.selectFilesByAnnId(id);
        //서버에서 파일 지우기
        for (String file : fileName) {
            String key = "prj241126/Announcement/" + id + "/" + file;
            DeleteObjectRequest dor = DeleteObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .build();
            s3.deleteObject(dor);
        }

        //db 에서 지우기
        mapper.deleteFileByAnnId(id);
        //게시글 지우기
        int cnt = mapper.deleteByAnnId(id);

        return cnt == 1;
    }
}

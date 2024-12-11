package com.example.backend.service.board;

import com.example.backend.dto.board.Announcement;
import com.example.backend.dto.board.Board;
import com.example.backend.dto.board.BoardFile;
import com.example.backend.mapper.board.BoardMapper;
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
import java.util.Arrays;
import java.util.List;
import java.util.Map;

@Service
@Transactional
@RequiredArgsConstructor
public class BoardService {

    final S3Client s3;
    private final BoardMapper mapper;
    @Value("${image.src.prefix}")
    String imageSrcPrefix;

    @Value("${bucket.name}")
    String bucketName;

    public Map<String, Object> getAllBoards(String search, String type, String site, Integer page) {
        page = (page - 1) * 10;
        return Map.of("list", mapper.findAllBoards(search, type, site, page),
                "count", mapper.countAll());
    }

    public List<Board> getTopBoardsByViews() {
        return mapper.findTopBoardsByViews();
    }

    public void increaseViewCount(Integer number) {
        mapper.updateViewCount(number);
    }

    public boolean add(Board board, MultipartFile[] files, Authentication auth) {
        board.setWriter(auth.getName());

        int cnt = mapper.insert(board);

        if (files != null && files.length > 0) {

            //파일 업로드
            for (MultipartFile file : files) {
                System.out.println("file = " + Arrays.toString(files));
                String objectKey = board.getWriter() + "/" + file.getOriginalFilename();
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

                //board_file 테이블에 파일명 입력
                mapper.insertFile(board.getNumber(), file.getOriginalFilename());

            }
        }

        return cnt == 1;
    }

    public boolean validate(Board board) {
        boolean title = !board.getTitle().trim().isEmpty();
        boolean content = !board.getContent().trim().isEmpty();

        return title && content;
    }

    public Board get(int number) {
        Board board = mapper.selectById(number);
        List<String> fileNameList = mapper.selectFilesByBoardId(number);
        List<BoardFile> fileSrcList = fileNameList
                .stream()
                .map(name -> new BoardFile(name, imageSrcPrefix + "/" + board.getWriter() + "/" + name))
                .toList();

        board.setFileList(fileSrcList);
        return board;
    }

    public boolean hasAccess(int number, Authentication auth) {
        Board board = mapper.selectById(number);
        return board.getWriter().equals(auth.getName());
    }

    public boolean remove(int number) {
        //첨부파일, 실제파일(s3) 지우기
        List<String> fileName = mapper.selectFilesByBoardId(number);
        Board board = mapper.selectById(number);
        for (String file : fileName) {
            String key = imageSrcPrefix + "/" + board.getWriter() + "/" + file;
            DeleteObjectRequest dor = DeleteObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .build();

            s3.deleteObject(dor);
        }

        int cnt = mapper.deleteById(number);
        return cnt == 1;
    }

    public Map<String, Object> listAnnouncement(Integer page) {

        return Map.of("list", mapper.selectAnnouncement((page - 1) * 10),
                "count", mapper.getAnnouncementCount());
    }

    public boolean addAnn(Announcement announcement, Authentication auth, MultipartFile[] files) {
        announcement.setWriter(auth.getName());

        int cnt = mapper.insertAnn(announcement);

        if (files != null && files.length > 0) {
            for (MultipartFile file : files) {
                String objectKey = "prj241126/" + announcement.getWriter() + "/" + file.getOriginalFilename();
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

    public Announcement getAnnView(int id) {
        Announcement announcement = mapper.selectByAnnId(id);
        return announcement;
    }
}

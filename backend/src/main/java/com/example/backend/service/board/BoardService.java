package com.example.backend.service.board;

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
import software.amazon.awssdk.services.s3.model.ObjectCannedACL;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class BoardService {

    private final BoardMapper mapper;
    final S3Client s3;

    @Value("${image.src.prefix}")
    String imageSrcPrefix;

    @Value("${bucket.name}")
    String bucketName;

    public List<Board> getAllBoards(String search, String type, String site) {
        return mapper.findAllBoards(search, type, site);
    }

    public boolean add(Board board, MultipartFile[] files, Authentication auth) {
        board.setWriter(auth.getName());

        int cnt = mapper.insert(board);

        if (files != null && files.length > 0) {

            //파일 업로드
            for (MultipartFile file : files) {
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
}

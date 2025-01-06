package com.example.backend.service.Question;

import com.example.backend.dto.board.QuesFile;
import com.example.backend.dto.board.Question;
import com.example.backend.mapper.comment.QuestionCommentMapper;
import com.example.backend.mapper.question.QuestionMapper;
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
public class QuestionService {

    final QuestionMapper mapper;
    final S3Client s3;
    final QuestionCommentMapper questionCommentMapper;
    @Value("${image.src.prefix}")
    String imageSrcPrefix;
    @Value("${bucket.name}")
    String bucketName;

    public Map<String, Object> listQuestion(Integer page) {
        return Map.of("list", mapper.selectALlQuestion((page - 1) * 10),
                "count", mapper.getQuestionCount());
    }

    public boolean validateQues(Question question) {
        boolean title = !question.getTitle().trim().isEmpty();
        boolean content = !question.getContent().trim().isEmpty();

        return title && content;
    }

    public boolean addQues(Question question, Authentication auth, MultipartFile[] files) {
        question.setWriter(auth.getName());

        int cnt = mapper.insertQues(question);

        if (files != null && files.length > 0) {
            for (MultipartFile file : files) {
                String objectKey = "prj241126/Question/" + question.getId() + "/" + file.getOriginalFilename();
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
                mapper.insertQuesFile(question.getId(), file.getOriginalFilename());
            }
        }

        return cnt == 1;
    }

    public boolean hasAccessQues(Integer id, Authentication auth) {
        Question ann = mapper.selectByQuesId(id);
        return ann.getWriter().equals(auth.getName());
    }

    public boolean removeQues(int id) {
        //게시물 지우기전에
        //첨부파일 지우기

        //실제 파일(s3) 지우기
        //현재파일명 얻어오기
        List<String> fileName = mapper.selectFilesByQuesId(id);
        //서버에서 파일 지우기
        for (String file : fileName) {
            String key = "prj241126/Question/" + id + "/" + file;
            DeleteObjectRequest dor = DeleteObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .build();
            s3.deleteObject(dor);
        }

        //db 에서 지우기
        mapper.deleteFileByQuesId(id);
        //댓글 대댓글 지우기
        questionCommentMapper.deleteByQuesIdChildComments(id);
        questionCommentMapper.deleteByQuesIdComments(id);
        //게시글 지우기
        int cnt = mapper.deleteByQuesId(id);

        return cnt == 1;
    }

    public Question getQuesView(int id) {
        Question question = mapper.selectByQuesId(id);
        List<String> fileNameList = mapper.selectFilesByQuesId(id);
        List<QuesFile> fileSrcList = fileNameList.stream()
                .map(name -> new QuesFile(name, imageSrcPrefix + "/Question/" + id + "/" + name)).toList();
        question.setFileList(fileSrcList);
        return question;
    }

    public boolean updateQues(Question question, List<String> removeFiles, MultipartFile[] updateFiles) {

        if (removeFiles != null) {
            for (String file : removeFiles) {
                String key = "prj241126/Question/" + question.getId() + "/" + file;
                DeleteObjectRequest dor = DeleteObjectRequest.builder()
                        .bucket(bucketName)
                        .key(key)
                        .build();
                s3.deleteObject(dor);
                mapper.deleteFileByQuesIdAndName(question.getId(), file);
            }
        }

        if (updateFiles != null && updateFiles.length > 0) {
            for (MultipartFile file : updateFiles) {
                String key = "prj241126/Question/" + question.getId() + "/" + file.getOriginalFilename();
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
                mapper.insertQuesFile(question.getId(), file.getOriginalFilename());
            }
        }

        int cnt = mapper.updateQuestion(question);

        return cnt == 1;
    }
}

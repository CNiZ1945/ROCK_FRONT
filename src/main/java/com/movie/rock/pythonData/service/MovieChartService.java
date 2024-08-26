package com.movie.rock.pythonData.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

@Service
@Slf4j
public class MovieChartService {

    public void runMoviePythonScript(Long movieId) {
//        String pythonPath = "venv/bin/python";
        String pythonPath = "D:\\project\\ROCK-FORNTEND\\venv\\Scripts\\python.exe";
        String scriptPath = "D:\\project\\ROCK-FORNTEND\\src\\main\\python\\movie_main.py";

        ProcessBuilder processBuilder = new ProcessBuilder(pythonPath, scriptPath, movieId.toString());
        processBuilder.redirectErrorStream(true);// 표준 오류와 표준 출력을 결합

        try {
            // Python 스크립트를 실행
            Process process = processBuilder.start();
            log.info("Python script started successfully.");

            // 프로세스의 표준 출력을 읽기 위한 BufferedReader 생성
            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));

            String line;
            while ((line = reader.readLine()) != null) {
                // 프로세스의 출력을 콘솔에 출력
                log.info(line);
            }

            // 프로세스가 종료될 때까지 대기하고 종료 코드를 반환
            int exitCode = process.waitFor();
            log.info("Python script executed with exit code: " + exitCode);

        }catch (IOException e) {
            e.printStackTrace();
            log.error("Failed to start Python script.", e);
        }catch (InterruptedException e) {
            log.error("InterruptedException occurred while waiting for Python script to finish.", e);
            Thread.currentThread().interrupt(); // Interrupt status를 복구
        }
    }
}

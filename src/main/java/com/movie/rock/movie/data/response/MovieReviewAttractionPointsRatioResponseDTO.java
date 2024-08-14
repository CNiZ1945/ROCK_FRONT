package com.movie.rock.movie.data.response;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class MovieReviewAttractionPointsRatioResponseDTO {

    private double directingPointRatio; //감독 연출
    private double actingPointRatio; //배우견기
    private double visualPointRatio; //영상미
    private double storyPointRatio; //스토리
    private double ostPointRatio; //OST

    @Builder(builderMethodName = "attractionPointsRatioDTOBuilder")
    public MovieReviewAttractionPointsRatioResponseDTO(double directingPointRatio, double actingPointRatio, double visualPointRatio,
                                                       double storyPointRatio, double ostPointRatio) {
        this.directingPointRatio = directingPointRatio;
        this.actingPointRatio = actingPointRatio;
        this.visualPointRatio = visualPointRatio;
        this.storyPointRatio = storyPointRatio;
        this.ostPointRatio = ostPointRatio;
    }
}

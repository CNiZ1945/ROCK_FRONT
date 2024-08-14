package com.movie.rock.movie.data.response;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class MovieReviewEmotionPointsRatioResponseDTO {

    private double stressReliefPointRatio; //스트레스 해소
    private double scaryPointRatio; //무서움
    private double realityPointRatio; //현실감
    private double immersionPointRatio; //몰입감
    private double tensionPointRatio; //긴장감

    @Builder(builderMethodName = "emotionPointsRatioDTOBuilder")
    public MovieReviewEmotionPointsRatioResponseDTO(double stressReliefPointRatio, double scaryPointRatio, double realityPointRatio,
                                                    double immersionPointRatio, double tensionPointRatio) {
        this.stressReliefPointRatio = stressReliefPointRatio;
        this.scaryPointRatio = scaryPointRatio;
        this.realityPointRatio = realityPointRatio;
        this.immersionPointRatio = immersionPointRatio;
        this.tensionPointRatio = tensionPointRatio;
    }
}

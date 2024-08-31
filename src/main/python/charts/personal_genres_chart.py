import matplotlib.pyplot as plt
import numpy as np
from PIL import Image
from wordcloud import WordCloud
import os

def plot_personal_genres_wordcloud(personal_genres_df, mem_num):
    genre_counts = personal_genres_df['genre_name'].value_counts()

    # 한글 폰트 설정
    font_path = 'C:/Windows/Fonts/malgun.ttf'
    if not os.path.exists(font_path):
        raise FileNotFoundError(f"Font not found: {font_path}")

    # 마스크 이미지 로드 및 처리
    masking_image_path = os.path.join(".", "src", "main", "resources", "static", "wordcloud", "film.png")
    mask_image = Image.open(masking_image_path).convert('L')

    # 워드클라우드와 마스크 이미지 크기 설정
    wc_width, wc_height = 800, 800
    mask_image = mask_image.resize((wc_width, wc_height), Image.ANTIALIAS)
    mask = np.array(mask_image)

    # 워드클라우드 생성 (100% 크기로 설정)
    wc = WordCloud(width=wc_width,
                   height=wc_height,
                   font_path=font_path,
                   mask=mask,
                   max_words=20,
                   background_color='#F4F4F4',
                   mode='RGBA',
                   colormap='Set2').generate_from_frequencies(genre_counts)

    # 워드클라우드를 시각화 및 저장
    plt.figure(figsize=(8, 8))
    plt.imshow(wc, interpolation='bilinear')
    plt.axis('off')

    # 파일 경로 설정
    file_path = os.path.join('src', 'main', 'resources', 'static', 'images', f'personal_genres_{mem_num}.png')
    os.makedirs(os.path.dirname(file_path), exist_ok=True)

    # 파일로 저장
    plt.savefig(file_path, format='png', bbox_inches='tight', pad_inches=0, transparent=True)

    plt.close()


# import matplotlib.pyplot as plt
# import numpy as np
# from PIL import Image
# from wordcloud import WordCloud
# import os
#
# def plot_personal_genres_wordcloud(personal_genres_df, mem_num):
#     genre_counts = personal_genres_df['genre_name'].value_counts()
#
#     # 한글 폰트 설정
#     font_path = 'C:/Windows/Fonts/malgun.ttf'
#     if not os.path.exists(font_path):
#         raise FileNotFoundError(f"Font not found: {font_path}")
#
#     # 마스크 이미지 로드 및 처리
#     masking_image_path = os.path.join(".", "src", "main", "resources", "static", "wordcloud", "film.png")
#     mask_image = Image.open(masking_image_path).convert('L')
#
#     # 워드클라우드와 마스크 이미지 크기 설정
#     wc_width, wc_height = 800, 800
#     mask_image = mask_image.resize((wc_width, wc_height), Image.ANTIALIAS)
#     mask = np.array(mask_image)
#
#     # 워드클라우드 생성
#     wc = WordCloud(width=wc_width,
#                    height=wc_height,
#                    font_path=font_path,
#                    mask=mask,
#                    max_words=20,
#                    background_color=None,  # 워드클라우드의 배경색
#                    mode='RGBA',  # 투명 배경을 지원하는 모드
#                    colormap='Set2').generate_from_frequencies(genre_counts)
#
#     # 워드클라우드를 시각화 및 저장
#     plt.figure(figsize=(8, 8))
#     plt.imshow(wc, interpolation='bilinear')
#     plt.axis('off')
#
#     # 파일 경로 설정
#     file_path = os.path.join('src', 'main', 'resources', 'static', 'images', f'personal_genres_{mem_num}.png')
#     os.makedirs(os.path.dirname(file_path), exist_ok=True)
#
#     # 파일로 저장
#     plt.savefig(file_path, format='png', bbox_inches='tight', pad_inches=0, transparent=True)
#
#     plt.close()


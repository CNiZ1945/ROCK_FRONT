import pymysql
import requests
from enum import Enum

# TMDb API key
api_key = 'e715179b147df5adf22f24196eb629dc'

# Establish MySQL database connection
conn = pymysql.connect(
    host='localhost',
    user='root',
    password='0000',
    database='rock_db',
    charset='utf8mb4'
)
c = conn.cursor()

# Create movies table
c.execute('''
            -- Movies 테이블
            CREATE TABLE IF NOT EXISTS movies (
                movie_id BIGINT PRIMARY KEY AUTO_INCREMENT,
                movie_name VARCHAR(255),
                run_time INT,
                open_year INT,
                movie_rating VARCHAR(50),
                movie_description TEXT
            )
        ''')

c.execute('''
            -- Genres 테이블
            CREATE TABLE IF NOT EXISTS genres (
                genre_id BIGINT PRIMARY KEY AUTO_INCREMENT,
                genre_name VARCHAR(100) NOT NULL
            )
        ''')

c.execute('''
            -- Movie_genres 테이블 (다대다 관계)
            CREATE TABLE IF NOT EXISTS movie_genres (
                movie_id BIGINT,
                genre_id BIGINT,
                PRIMARY KEY (movie_id, genre_id),
                FOREIGN KEY (movie_id) REFERENCES movies(movie_id),
                FOREIGN KEY (genre_id) REFERENCES genres(genre_id)
            )
        ''')

c.execute('''
            -- Actors 테이블
            CREATE TABLE IF NOT EXISTS actors (
                actor_id BIGINT PRIMARY KEY AUTO_INCREMENT,
                actor_name VARCHAR(255),
                actor_birth INTEGER
            )
        ''')

c.execute('''
            -- Directors 테이블
            CREATE TABLE IF NOT EXISTS directors (
                director_id BIGINT PRIMARY KEY AUTO_INCREMENT,
                director_name VARCHAR(255),
                director_birth INTEGER
            )
        ''')

c.execute('''
            -- Photos 테이블
            CREATE TABLE IF NOT EXISTS photos (
                photo_id BIGINT PRIMARY KEY AUTO_INCREMENT,
                photo_url VARCHAR(255) NOT NULL,
                photo_type ENUM('ACTOR', 'DIRECTOR') NOT NULL
            )
        ''')

c.execute('''
            -- Actors_photos 테이블
            CREATE TABLE IF NOT EXISTS actors_photos (
                photo_id BIGINT,
                actor_id BIGINT,
                PRIMARY KEY (photo_id, actor_Id),
                FOREIGN KEY (photo_id) REFERENCES photos(photo_id),
                FOREIGN KEY (actor_id) REFERENCES actors(actor_id)
            )
        ''')

c.execute('''
            -- Directors_photos 테이블
            CREATE TABLE IF NOT EXISTS directors_photos (
                photo_id BIGINT,
                director_id BIGINT,
                PRIMARY KEY (photo_id,director_id),
                FOREIGN KEY (photo_id) REFERENCES photos(photo_id),
                FOREIGN KEY (director_id) REFERENCES directors(director_id)
            )
        ''')

c.execute('''
            -- Trailers 테이블
            CREATE TABLE IF NOT EXISTS trailers (
                trailer_id BIGINT PRIMARY KEY AUTO_INCREMENT,
                trailer_url VARCHAR(255) UNIQUE
            );
        ''')

c.execute('''
           CREATE TABLE IF NOT EXISTS posters (
                poster_id BIGINT PRIMARY KEY AUTO_INCREMENT,
                poster_url VARCHAR(255) UNIQUE
            );
        ''')


c.execute('''
            -- Movie_actors 테이블 (다대다 관계)
            CREATE TABLE IF NOT EXISTS movie_actors (
                movie_id BIGINT,
                actor_id BIGINT,
                PRIMARY KEY (movie_id, actor_id),
                FOREIGN KEY (movie_id) REFERENCES movies(movie_id),
                FOREIGN KEY (actor_id) REFERENCES actors(actor_id)
            )
        ''')

c.execute('''
            -- Movie_directors 테이블 (다대다 관계)
            CREATE TABLE IF NOT EXISTS movie_directors (
                movie_id BIGINT,
                director_id BIGINT,
                PRIMARY KEY (movie_id, director_id),
                FOREIGN KEY (movie_id) REFERENCES movies(movie_id),
                FOREIGN KEY (director_id) REFERENCES directors(director_id)
            )
        ''')

c.execute('''
            -- Movie_trailers 테이블 (다대다 관계)
           CREATE TABLE IF NOT EXISTS movie_trailers (
                trailer_id BIGINT,
                movie_id BIGINT,
                PRIMARY KEY (trailer_id, movie_id),
                FOREIGN KEY (trailer_id) REFERENCES trailers(trailer_id),
                FOREIGN KEY (movie_id) REFERENCES movies(movie_id)
            );
        ''')

c.execute('''
            -- Movie_posters 테이블 (다대다 관계)
            CREATE TABLE IF NOT EXISTS movie_posters (
                poster_id BIGINT,
                movie_id BIGINT,
                PRIMARY KEY (poster_id, movie_id),
                FOREIGN KEY (poster_id) REFERENCES posters(poster_id),
                FOREIGN KEY (movie_id) REFERENCES movies(movie_id)
            );
        ''')


# Enum definitions
class PhotoType(Enum):
    ACTOR = 'ACTOR'
    DIRECTOR = 'DIRECTOR'

class PosterType(Enum):
    OFFICIAL = 'OFFICIAL'
    ADDITIONAL = 'ADDITIONAL'

class TrailerType(Enum):
    OFFICIAL_FINAL = 'OFFICIAL_FINAL'
    OFFICIAL = 'OFFICIAL'


# 장르 목록을 가져와서 장르 ID와 이름을 매핑
genre_url = f'https://api.themoviedb.org/3/genre/movie/list?api_key={api_key}&language=ko-KR'
genre_response = requests.get(genre_url).json()
genre_dict = {genre['id']: genre['name'] for genre in genre_response['genres']}

# 장르 정보를 데이터베이스에 삽입
for genre_id, genre_name in genre_dict.items():
    try:
        c.execute('''
        INSERT IGNORE INTO genres (genre_id, genre_name)
        VALUES (%s, %s)
        ''', (genre_id, genre_name))
        conn.commit()
    except Exception as e:
        print(f"Error inserting genre: {e}")
        conn.rollback()

# 특정 키워드를 포함하는 영화를 제외하는 함수
def should_exclude_movie(keywords):
    exclude_keywords = [
        "sexploitation", "softcore", "sex slave", "lesbian sex", 
        "sex", "erotic movie", "pink film"
    ]
    return any(keyword.lower() in exclude_keywords for keyword in keywords)


# 배우 및 감독의 생년 정보와 사진 URL을 가져오는 함수
def fetch_person_info(person_id):
    url = f'https://api.themoviedb.org/3/person/{person_id}?api_key={api_key}&language=ko-KR'
    response = requests.get(url).json()
    birth_date = response.get('birthday', None)
    birth_year = int(birth_date[:4]) if birth_date else None
    profile_path = response.get('profile_path', None)
    profile_url = f"https://image.tmdb.org/t/p/w500{profile_path}" if profile_path else None
    return response.get('name', ''), birth_year, profile_url

# 감독 정보를 가져오는 함수
def fetch_director_info(movie_id):
    url = f'https://api.themoviedb.org/3/movie/{movie_id}/credits?api_key={api_key}&language=ko-KR'
    response = requests.get(url).json()
    return [member for member in response.get('crew', []) if member['job'] == 'Director']

# 배우 정보를 가져오는 함수
def fetch_actor_info(movie_id):
    url = f'https://api.themoviedb.org/3/movie/{movie_id}/credits?api_key={api_key}&language=ko-KR'
    response = requests.get(url).json()
    return response.get('cast', [])[:5]  # 상위 5명의 배우만 반환

# 연령 등급을 확인하는 함수
def get_age_rating(movie_id):
    release_dates_url = f'https://api.themoviedb.org/3/movie/{movie_id}/release_dates?api_key={api_key}'
    release_dates_response = requests.get(release_dates_url).json()
    age_rating = '청소년 관람 가능'  # 기본값

    def is_adult_rating(certification):
        adult_ratings = ['18', 'R', 'NC-17', 'X', 'TV-MA']
        return any(rating in certification for rating in adult_ratings)

    found_rating = False
    for result in release_dates_response.get('results', []):
        if result['iso_3166_1'] == 'KR':  # 한국 등급 우선
            for release_date in result['release_dates']:
                if 'certification' in release_date and release_date['certification']:
                    if is_adult_rating(release_date['certification']):
                        age_rating = '청소년 관람 불가'
                    else:
                        age_rating = '청소년 관람 가능'
                    found_rating = True
                    break
        if found_rating:
            break

    if not found_rating:  # 한국 등급이 없는 경우
        for result in release_dates_response.get('results', []):
            for release_date in result['release_dates']:
                if 'certification' in release_date and release_date['certification']:
                    if is_adult_rating(release_date['certification']):
                        age_rating = '청소년 관람 불가'
                    else:
                        age_rating = '청소년 관람 가능'
                    found_rating = True
                    break
            if found_rating:
                break

    return age_rating

# 트레일러 URL을 가져오는 함수
def fetch_trailer_urls(movie_id):
    url = f'https://api.themoviedb.org/3/movie/{movie_id}/videos?api_key={api_key}&language=ko-KR'
    response = requests.get(url).json()
    trailers = []
    for video in response.get('results', []):
        if video['type'] == 'Trailer' and video['site'] == 'YouTube' and video.get('official', False):
            trailers.append(f"https://www.youtube.com/watch?v={video['key']}")
            if len(trailers) == 3:
                break
    return trailers

# 포스터 URL을 가져오는 함수 (추가 포스터들)
def fetch_poster_urls(movie_id):
    url = f'https://api.themoviedb.org/3/movie/{movie_id}/images?api_key={api_key}&language=ko-KR&include_image_language=ko,null'
    response = requests.get(url).json()
    posters = []
    for poster in response.get('posters', []):
        if poster['iso_639_1'] == 'ko' or poster['iso_639_1'] is None:
            posters.append(f"https://image.tmdb.org/t/p/w500{poster['file_path']}")
            if len(posters) == 2:  # 추가 포스터는 최대 2개만 가져옴
                break
    return posters

# API에서 영화 데이터 가져오기
page = 1
while True:
    discover_url = f'https://api.themoviedb.org/3/discover/movie?api_key={api_key}&language=ko-KR&region=KR&sort_by=popularity.desc&page={page}'
    response = requests.get(discover_url)
    if response.status_code != 200:
        print(f"Failed to fetch data from TMDb API. Status code: {response.status_code}")
        break

    data = response.json()

    for movie in data['results']:
        movie_id = movie['id']
        movie_url = f'https://api.themoviedb.org/3/movie/{movie_id}?api_key={api_key}&language=ko-KR'
        movie_response = requests.get(movie_url).json()

        movie_name = movie_response.get('title', '')
        genres = [genre_dict[genre_id] for genre_id in movie.get('genre_ids', [])]
        runtime = movie_response.get('runtime', 0)
        release_year = int(movie_response.get('release_date', '')[:4]) if movie_response.get('release_date') else None
        overview = movie_response.get('overview', '')
        movie_rating = float(movie_response.get('vote_average', 0))

        # 키워드 정보 추출
        keywords_url = f'https://api.themoviedb.org/3/movie/{movie_id}/keywords?api_key={api_key}&language=ko-KR'
        keywords_response = requests.get(keywords_url).json()
        keywords = [keyword['name'] for keyword in keywords_response.get('keywords', [])]

        # 특정 키워드를 포함하는 영화 제외
        if should_exclude_movie(keywords):
            continue

        # 연령 등급 정보 추출
        age_rating = get_age_rating(movie_id)

        # 데이터베이스에 영화 정보 삽입
        try:
            c.execute('''
            INSERT IGNORE INTO movies (movie_id, movie_name, run_time, open_year, movie_rating, movie_description)
            VALUES (%s, %s, %s, %s, %s, %s)
            ''', (movie_id, movie_name, runtime, release_year, age_rating, overview))
            conn.commit()

            # 장르 정보 삽입
            for genre_id in movie.get('genre_ids', []):
                c.execute('''
                INSERT IGNORE INTO movie_genres (movie_id, genre_id)
                VALUES (%s, %s)
                ''', (movie_id, genre_id))
            conn.commit()

           # 포스터 정보 삽입
            poster_path = movie_response.get('poster_path', '')
            if poster_path:
                poster_url = f"https://image.tmdb.org/t/p/w500{poster_path}"
                try:
                    c.execute('''
                    INSERT IGNORE INTO posters (poster_url)
                    VALUES (%s)
                    ''', (poster_url,))
                    conn.commit()
                    c.execute("SELECT poster_id FROM posters WHERE poster_url = %s", (poster_url,))
                    poster_id = c.fetchone()[0]
                    c.execute('''
                    INSERT IGNORE INTO movie_posters (poster_id, movie_id)
                    VALUES (%s, %s)
                    ''', (poster_id, movie_id))
                    conn.commit()
                except Exception as e:
                    print(f"Error inserting poster data: {e}")
                    conn.rollback()

            # 추가 포스터 URL 삽입
            poster_urls = fetch_poster_urls(movie_id)
            for poster_url in poster_urls:
                try:
                    c.execute('''
                    INSERT IGNORE INTO posters (poster_url)
                    VALUES (%s)
                    ''', (poster_url,))
                    conn.commit()
                    c.execute("SELECT poster_id FROM posters WHERE poster_url = %s", (poster_url,))
                    poster_id = c.fetchone()[0]
                    c.execute('''
                    INSERT IGNORE INTO movie_posters (poster_id, movie_id)
                    VALUES (%s, %s)
                    ''', (poster_id, movie_id))
                    conn.commit()
                except Exception as e:
                    print(f"Error inserting additional poster data: {e}")
                    conn.rollback()

            # 트레일러 정보 삽입
            trailers = fetch_trailer_urls(movie_id)
            for trailer_url in trailers:
                try:
                    c.execute('''
                    INSERT IGNORE INTO trailers (trailer_url)
                    VALUES (%s)
                    ''', (trailer_url,))
                    conn.commit()
                    c.execute("SELECT trailer_id FROM trailers WHERE trailer_url = %s", (trailer_url,))
                    trailer_id = c.fetchone()[0]
                    c.execute('''
                    INSERT IGNORE INTO movie_trailers (trailer_id, movie_id)
                    VALUES (%s, %s)
                    ''', (trailer_id, movie_id))
                    conn.commit()
                except Exception as e:
                    print(f"Error inserting trailer data: {e}")
                    conn.rollback()

            # 감독 정보 삽입
            directors = fetch_director_info(movie_id)
            for director in directors:
                director_id = director['id']
                director_name, director_birth, director_photo = fetch_person_info(director_id)
                c.execute('''
                INSERT IGNORE INTO directors (director_id, director_name, director_birth)
                VALUES (%s, %s, %s)
                ''', (director_id, director_name, director_birth))
                conn.commit()
                c.execute('''
                INSERT IGNORE INTO movie_directors (movie_id, director_id)
                VALUES (%s, %s)
                ''', (movie_id, director_id))
                conn.commit()
                if director_photo:
                    c.execute('''
                    INSERT IGNORE INTO photos (photo_url, photo_type)
                    VALUES (%s, %s)
                    ''', (director_photo, 'DIRECTOR'))
                    conn.commit()
                    photo_id = c.lastrowid
                    c.execute('''
                    INSERT IGNORE INTO directors_photos (photo_id, director_id)
                    VALUES (%s, %s)
                    ''', (photo_id, director_id))
                    conn.commit()

            # 배우 정보 삽입
            actors = fetch_actor_info(movie_id)
            for actor in actors:
                actor_id = actor['id']
                actor_name, actor_birth, actor_photo = fetch_person_info(actor_id)
                c.execute('''
                INSERT IGNORE INTO actors (actor_id, actor_name, actor_birth)
                VALUES (%s, %s, %s)
                ''', (actor_id, actor_name, actor_birth))
                conn.commit()
                c.execute('''
                INSERT IGNORE INTO movie_actors (movie_id, actor_id)
                VALUES (%s, %s)
                ''', (movie_id, actor_id))
                conn.commit()
                if actor_photo:
                    c.execute('''
                    INSERT IGNORE INTO photos (photo_url, photo_type)
                    VALUES (%s, %s)
                    ''', (actor_photo, 'ACTOR'))
                    conn.commit()
                    photo_id = c.lastrowid
                    c.execute('''
                    INSERT IGNORE INTO actors_photos (photo_id, actor_id)
                    VALUES (%s, %s)
                    ''', (photo_id, actor_id))
                    conn.commit()


        except Exception as e:
            print(f"Error inserting movie data: {e}")
            conn.rollback()

    # 다음 페이지로 이동
    page += 1
    if page > data['total_pages']:
        break

# 연결 종료
c.close()
conn.close()
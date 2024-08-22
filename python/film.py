import pymysql

# MySQL 데이터베이스 연결 설정
conn = pymysql.connect(
    host='localhost',
    user='root',
    password='0000',
    database='rock_db',
    charset='utf8mb4'
)

c = conn.cursor()

# movie_films 테이블 생성
c.execute('''
    CREATE TABLE IF NOT EXISTS movie_films (
        film_id BIGINT PRIMARY KEY AUTO_INCREMENT,
        movie_film VARCHAR(255) NOT NULL,
        movie_id BIGINT,
        FOREIGN KEY (movie_id) REFERENCES movies(movie_id)
    );
''')

# movie_id 추출 (movies 테이블에서 추출)
c.execute("SELECT movie_id FROM movies")
movie_ids = c.fetchall()

# 비디오 파일 경로
video_path = 'D:\\project\\ex_movie_film.mp4'

# 데이터 준비
data = []
for movie_id in movie_ids:
    data.append((video_path, movie_id[0]))

# 데이터베이스에 데이터 삽입
c.executemany("INSERT INTO movie_films (movie_film, movie_id) VALUES (%s, %s)", data)
conn.commit()

# 연결 종료
conn.close()

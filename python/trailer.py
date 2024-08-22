import requests
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

# 트레일러 및 영화-트레일러 연결 테이블 생성
c.execute('''
    CREATE TABLE IF NOT EXISTS trailers (
        trailer_id BIGINT PRIMARY KEY AUTO_INCREMENT,
        trailer_url VARCHAR(255) NOT NULL UNIQUE,
        main_trailer BOOLEAN NOT NULL DEFAULT FALSE
    );
''')

c.execute('''
    CREATE TABLE IF NOT EXISTS movie_trailers (
        movie_id BIGINT,
        trailer_id BIGINT,
        PRIMARY KEY (movie_id, trailer_id),
        FOREIGN KEY (movie_id) REFERENCES movies(movie_id),
        FOREIGN KEY (trailer_id) REFERENCES trailers(trailer_id)
    );
''')

# DB에서 모든 movie_id 가져오기
c.execute('SELECT movie_id FROM movies')
movie_ids = [row[0] for row in c.fetchall()]

def get_trailer(movie_id):
    # TMDb API key
    api_key = 'e715179b147df5adf22f24196eb629dc'
    url = f'https://api.themoviedb.org/3/movie/{movie_id}/videos?api_key={api_key}&language=en-US'
    
    response = requests.get(url)
    if response.status_code != 200:
        print(f"Error: Unable to fetch data for movie ID {movie_id}")
        return []
    
    data = response.json()
    trailers = data.get('results', [])

    # 최종 예고편과 공식 예고편 필터링
    final_trailers = [trailer for trailer in trailers if 'final' in trailer.get('name', '').lower() and trailer.get('type') == 'Trailer']
    official_trailers = [trailer for trailer in trailers if 'official' in trailer.get('name', '').lower() and trailer.get('type') == 'Trailer']
    non_final_trailers = [trailer for trailer in trailers if 'final' not in trailer.get('name', '').lower() and 'official' not in trailer.get('name', '').lower() and trailer.get('type') == 'Trailer']

    # 최종 예고편과 공식 예고편을 포함하여 최대 3개의 트레일러 반환
    if final_trailers or official_trailers:
        return (final_trailers[:1] + official_trailers[:1] + non_final_trailers)[:3]
    else:
        return non_final_trailers[:3]

def insert_trailers_into_db(movie_id, trailers):
    for trailer in trailers:
        trailer_url = f"https://www.youtube.com/watch?v={trailer['key']}"
        main_trailer = 'final' in trailer.get('name', '').lower() or 'official' in trailer.get('name', '').lower()
        
        # 트레일러 데이터 삽입
        sql_trailer = "INSERT INTO trailers (trailer_url, main_trailer) VALUES (%s, %s) ON DUPLICATE KEY UPDATE trailer_url = VALUES(trailer_url), main_trailer = VALUES(main_trailer)"
        c.execute(sql_trailer, (trailer_url, main_trailer))
        
        # 삽입된 트레일러 ID 가져오기
        c.execute("SELECT trailer_id FROM trailers WHERE trailer_url = %s", (trailer_url,))
        trailer_id = c.fetchone()[0]
        
        # 영화-트레일러 연결 데이터 삽입
        sql_movie_trailer = "INSERT INTO movie_trailers (movie_id, trailer_id) VALUES (%s, %s) ON DUPLICATE KEY UPDATE movie_id = VALUES(movie_id), trailer_id = VALUES(trailer_id)"
        c.execute(sql_movie_trailer, (movie_id, trailer_id))
        
    conn.commit()

# 전체 프로세스 실행
for movie_id in movie_ids:
    # 트레일러 가져오기
    trailers = get_trailer(movie_id)
    if trailers:
        insert_trailers_into_db(movie_id, trailers)
    else:
        print(f"No trailers found for movie ID {movie_id}")
    
# 연결 종료
conn.close()

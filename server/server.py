from fastapi import FastAPI, Depends
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy import text
from fastapi.middleware.cors import CORSMiddleware

from mysql_db_connection.db_connection import (
    create_mental_disorders_reddit_engine,
    get_mental_disorders_processed_table_conf,
)

table_name = get_mental_disorders_processed_table_conf()["name"]

engine = create_mental_disorders_reddit_engine()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


# Iniciar FastAPI
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Dependencia para obtener la sesión de la base de datos
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/")
def read_root():
    return {"message": "¡Servidor FastAPI funcionando!"}


# 📌 Endpoint: Palabras más comunes
@app.get("/common_words")
def get_common_words(db: Session = Depends(get_db)):
    query = db.execute(
        text(
            f"SELECT most_common_word, COUNT(*) as count FROM {table_name} GROUP BY most_common_word ORDER BY count DESC LIMIT 10"
        )
    ).fetchall()
    return [{"word": row[0], "count": row[1]} for row in query]


# 📌 Endpoint: Emociones por subreddit
@app.get("/emotions_by_subreddit")
def get_emotions_by_subreddit(db: Session = Depends(get_db)):
    query = db.execute(
        text(
            f"""
        SELECT subreddit, nrc_primary_emotion, COUNT(*) as count
        FROM {table_name}
        GROUP BY subreddit, nrc_primary_emotion
        """
        )
    ).fetchall()

    # Crear estructura de datos
    emotion_data = {}
    for row in query:
        subreddit, emotion, count = row
        if subreddit not in emotion_data:
            emotion_data[subreddit] = {}
        emotion_data[subreddit][emotion] = count

    # Convertir a la estructura deseada
    result = [
        {"subreddit": subreddit, **emotions}
        for subreddit, emotions in emotion_data.items()
    ]

    return result


@app.get("/common_words_by_nrc_sentiment")
def get_common_words_by_nrc_sentiment(db: Session = Depends(get_db)):
    emotions = db.execute(
        text(f"SELECT DISTINCT nrc_sentiment FROM {table_name}")
    ).fetchall()

    result = {}
    for emotion in emotions:
        emotion_name = emotion[0]
        query = db.execute(
            text(
                f"""
                SELECT most_common_word, COUNT(*) as count
                FROM {table_name}
                WHERE nrc_sentiment = :emotion
                GROUP BY most_common_word
                ORDER BY count DESC
                LIMIT 3
            """
            ),
            {"emotion": emotion_name},
        ).fetchall()

        result[emotion_name] = [{"word": row[0], "count": row[1]} for row in query]

    return result


@app.get("/common_words_by_vader_sentiment")
def get_common_words_by_vader_sentiment(db: Session = Depends(get_db)):
    sentiments = ["positive", "neutral", "negative"]
    result = {}

    for sentiment in sentiments:
        query = db.execute(
            text(
                f"""
                SELECT most_common_word, COUNT(*) as count
                FROM {table_name}
                WHERE vader_sentiment_label = :sentiment
                GROUP BY most_common_word
                ORDER BY count DESC
                LIMIT 3
            """
            ),
            {"sentiment": sentiment},
        ).fetchall()

        result[sentiment] = [{"word": row[0], "count": row[1]} for row in query]

    return result


# 📌 Endpoint: Distribución detallada de emociones y sentimientos
@app.get("/detailed_emotions_distribution")
def get_detailed_emotions_distribution(db: Session = Depends(get_db)):
    # Obtener emociones únicas de la tabla
    emotions = db.execute(
        text(f"SELECT DISTINCT nrc_primary_emotion FROM {table_name}")
    ).fetchall()

    emotions = [e[0] for e in emotions]

    result = []

    for emotion in emotions:
        data = {"emotion": emotion}

        # Contar las combinaciones de emoción con sentimientos de VADER
        for vader_label in ["positive", "negative", "neutral"]:
            vader_count = db.execute(
                text(
                    f"""
                    SELECT COUNT(*) 
                    FROM {table_name}
                    WHERE nrc_primary_emotion = :emotion
                    AND vader_sentiment_label = :vader_label
                """
                ),
                {"emotion": emotion, "vader_label": vader_label},
            ).fetchone()[0]
            data[f"vader_{vader_label}"] = vader_count

        # Contar las combinaciones de emoción con sentimientos de NRC
        for nrc_label in ["positive", "negative", "neutral"]:
            nrc_count = db.execute(
                text(
                    f"""
                    SELECT COUNT(*) 
                    FROM {table_name}
                    WHERE nrc_primary_emotion = :emotion
                    AND nrc_sentiment = :nrc_label
                """
                ),
                {"emotion": emotion, "nrc_label": nrc_label},
            ).fetchone()[0]
            data[f"nrc_{nrc_label}"] = nrc_count

        result.append(data)

    return result


@app.get("/word_count_per_subreddit")
def get_word_count_per_subreddit(db: Session = Depends(get_db)):
    query = db.execute(
        text(
            f"""
            SELECT subreddit, AVG(word_count) as avg_word_count 
            FROM {table_name} 
            GROUP BY subreddit
            """
        )
    ).fetchall()

    # Retornar los datos sin el campo "fill"
    return [{"subreddit": row[0], "avg_word_count": round(row[1], 2)} for row in query]


@app.get("/emotions_by_month")
def get_all_emotions_by_month(db: Session = Depends(get_db)):
    query = db.execute(
        text(
            f"""
        SELECT month, nrc_primary_emotion, COUNT(*) as count
        FROM {table_name}
        GROUP BY month, nrc_primary_emotion
        ORDER BY month
        """
        )
    ).fetchall()

    result = {}
    for month, emotion, count in query:
        if month not in result:
            result[month] = {}
        result[month][emotion] = count

    formatted_result = [
        {"month": month, **emotions} for month, emotions in result.items()
    ]

    return formatted_result


@app.get("/hourly_sentiment")
def get_hourly_sentiment(db: Session = Depends(get_db)):
    # Consulta única para obtener los conteos de sentimientos por cada hora
    query = db.execute(
        text(
            f"""
        SELECT hour, vader_sentiment_label, COUNT(*) as count
        FROM {table_name}
        GROUP BY hour, vader_sentiment_label
        ORDER BY hour
        """
        )
    ).fetchall()

    # Crear un diccionario para almacenar los resultados de forma más eficiente
    result = [
        {"hour": h, "positive": 0, "negative": 0, "neutral": 0} for h in range(24)
    ]

    # Llenar los valores directamente
    for hour, sentiment, count in query:
        result[hour][sentiment] = count

    return result


# uvicorn server.server:app --reload

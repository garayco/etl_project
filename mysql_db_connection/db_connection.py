from sqlalchemy import create_engine, text
from sqlalchemy.exc import SQLAlchemyError

from mysql_db_connection.load_config import load_config

config = load_config()
db = config["db"]

# Load credentials
db_user = db["credentials"]["user"]
db_password = db["credentials"]["password"]
db_host = db["host"]
db_port = db["port"]


def create_mysql_engine(db_name):
    return create_engine(
        f"mysql+mysqlconnector://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}"
    )


def create_db(db_name):
    engine = create_engine(
        f"mysql+mysqlconnector://{db_user}:{db_password}@{db_host}:{db_port}/"
    )
    try:
        with engine.connect() as conn:
            conn.execute(text(f"CREATE DATABASE {db_name}"))
            print(f"✅ Database '{db_name}' created successfully.")
    except SQLAlchemyError as e:
        error_code = e.orig.args[0]
        if error_code == 1007:
            print(f"⚠️ The database '{db_name}' already exists.")
        else:
            print(f"❌ Error creating database '{db_name}': {e}")
    finally:
        engine.dispose()


def create_mental_disorders_reddit_engine():
    mental_disorders_reddit_db_name = db["schemas"]["mental_disorders_reddit"]["name"]
    return create_mysql_engine(mental_disorders_reddit_db_name)

def get_mental_disorders_table_conf():
    return db["schemas"]["mental_disorders_reddit"]["tables"]["mental_disorders"]
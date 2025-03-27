import pandas as pd
from tqdm import tqdm
from kaggle_tools.dataset_download import dataset_download
from mysql_db_connection.db_connection import (
    create_db,
    create_mental_disorders_reddit_engine,
    get_mental_disorders_reddit_db_name,
    get_mental_disorders_table_conf,
)
from mysql_db_connection.upload_dataset_to_db import clean_df
from utils.sql_utils import table_exists, upload_table_to_db_by_chunks


def extraction():
    print(f"💻 Start Extraction Phase")
    # Download the csv dataset
    dataset_download()

    # Get tables and db_name
    db_name = get_mental_disorders_reddit_db_name()

    # Create the db
    create_db(db_name)

    # Get mental_disorder table name
    mental_disorder_table_name = get_mental_disorders_table_conf()["name"]
    
    # Create engine
    engine = create_mental_disorders_reddit_engine()

    try:
        # Create mental_disorders table and insert dataset to DB
        if not table_exists(engine, mental_disorder_table_name):

            # Read the csv
            file_path = "dataset/mental_disorders_reddit.csv"
            df_chunks = pd.read_csv(file_path, chunksize=10000)

            # Chunk process
            df_list = []
            for chunk in tqdm(df_chunks, desc=f"Reading {file_path}"):
                df_list.append(chunk)

            df = pd.concat(df_list, ignore_index=True)

            # Clean Data Frame
            df = clean_df(df)

            # Upload dataset to DB
            upload_table_to_db_by_chunks(
                df, mental_disorder_table_name, engine, chunk_size=5000
            )
        else:
            print(f"⚠️ Table '{mental_disorder_table_name}' already exists.")
    
    finally:
        # Close Engine
        engine.dispose()

    print("☑️ End of Extraction Phase")

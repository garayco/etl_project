import pandas as pd
from tqdm import tqdm
from kaggle_tools.dataset_download import dataset_download
from mysql_db_connection.upload_dataset_to_db import upload_dataset_to_db
from mysql_db_connection.db_connection import create_db, create_mysql_engine
from mysql_db_connection.load_config import load_config
from utils.sql_utils import table_exists

if __name__ == "__main__":

    # download the csv dataset
    dataset_download()

    # Load YAML config
    config = load_config()
    db = config["db"]
    schemas = db["schemas"]
    mental_disorders_reddit_db = schemas["mental_disorders_reddit"]
    tables = mental_disorders_reddit_db["tables"]
    db_name = mental_disorders_reddit_db["name"]

    # Create the db
    create_db(db_name)

    # Engine creation
    engine = create_mysql_engine(db_name)

    # Create mental_disorders table and insert dataset to DB
    dataset_table_name = tables["mental_disorders"]["name"]
    if not table_exists(engine, dataset_table_name):

        # Cleaning rules
        cleaning_rules = {
            "rules": {
                "columns": {
                    "selftext": {
                        "remove_values": ["[removed]", "[deleted]"],
                        "min_length_char": 10,
                    }
                }
            }
        }

        # Read the csv
        file_path = "dataset/mental_disorders_reddit.csv"
        df_chunks = pd.read_csv(file_path, chunksize=10000)

        # Chunk process
        df_list = []
        for chunk in tqdm(df_chunks, desc=f"Reading {file_path}"):
            df_list.append(chunk)

        df = pd.concat(df_list, ignore_index=True)
        # Upload dataset to DB
        upload_dataset_to_db(engine, df, dataset_table_name, cleaning_rules)
    else:
        print(f"⚠️ Table '{dataset_table_name}' already exists.")

    print("☑️ End of execution")

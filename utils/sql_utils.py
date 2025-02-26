import pandas as pd
from sqlalchemy import inspect, text

types = pd.api.types


def table_exists(engine, table_name):
    return inspect(engine).has_table(table_name)


def create_table(engine, df, table_name):

    if not table_exists(engine, table_name):

        def map_dtype(dtype):
            dtype_mapping = {
                types.is_integer_dtype: "INTEGER",
                types.is_float_dtype: "REAL",
                types.is_bool_dtype: "BOOLEAN",
                types.is_datetime64_any_dtype: "DATETIME",
            }
            return next(
                (sql_type for check, sql_type in dtype_mapping.items() if check(dtype)),
                "TEXT",
            )

        with engine.connect() as conn:
            # Create a table
            print(f"🔨 Creating table: {table_name}")
            columns_def = ", ".join(
                [f"{col} {map_dtype(dtype)}" for col, dtype in df.dtypes.items()]
            )
            sql_create_table = f"CREATE TABLE {table_name} ({columns_def})"
            conn.execute(text(sql_create_table))
            conn.commit()
            print(f"✅ Table {table_name} created successfully.")
            conn.close()

    else:
        print(f"⚠️ Table: '{table_name}' already exists")

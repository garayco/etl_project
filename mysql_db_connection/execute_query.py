from mysql_db_connection import db_connection


def execute_query(db_name, query, params=None):
    conn = db_connection(db_name)
    cursor = conn.cursor()
    try:
        cursor.execute(query, params)
        result = cursor.fetchall()
        return result
    finally:
        cursor.close()
        conn.close()

from extraction import extraction
from mysql_db_connection.db_connection import create_mental_disorders_reddit_engine
from transformation import transformation


if __name__ == "__main__":
    
    # Extraction phase
    extraction()
    
    # Transformation phase
    transformation()
    
    # Load phase
        
    print("☑️ End of execution")

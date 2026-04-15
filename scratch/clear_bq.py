import os
import logging
from google.cloud import bigquery
from dotenv import load_dotenv

load_dotenv()

def clear_bq_tables():
    project_id = "personal-site-492809"
    dataset_id = "jason_ai_system"
    client = bigquery.Client(project=project_id)
    
    tables = ["articles_metadata", "raw_headlines"]
    
    for table_name in tables:
        table_id = f"{project_id}.{dataset_id}.{table_name}"
        # TRUNCATE TABLE is the standard SQL way to clear all data
        query = f"TRUNCATE TABLE `{table_id}`"
        
        logging.info(f"Clearing table: {table_id}...")
        try:
            query_job = client.query(query)
            query_job.result()  # Wait for the job to complete
            logging.info(f"Successfully cleared table: {table_id}")
        except Exception as e:
            logging.error(f"Failed to clear table {table_id}: {e}")

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    confirm = input("Are you sure you want to clear ALL data in BigQuery? (y/n): ")
    if confirm.lower() == 'y':
        clear_bq_tables()
    else:
        print("Operation cancelled.")

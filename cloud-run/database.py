import os
import logging
import datetime
from google.cloud import bigquery
from google.api_core.exceptions import NotFound

class BigQueryManager:
    def __init__(self):
        self.project_id = "personal-site-492809"
        self.dataset_id = "jason_ai_system"
        self.client = bigquery.Client(project=self.project_id)
        
    def init_db(self):
        """Creates dataset and tables if they don't exist."""
        # 1. Create Dataset
        dataset_ref = self.client.dataset(self.dataset_id)
        try:
            self.client.get_dataset(dataset_ref)
        except NotFound:
            dataset = bigquery.Dataset(dataset_ref)
            dataset.location = "asia-east1"
            self.client.create_dataset(dataset)
            logging.info(f"Created dataset {self.dataset_id}")

        # 2. Create articles_metadata table
        meta_table_id = f"{self.project_id}.{self.dataset_id}.articles_metadata"
        schema_meta = [
            bigquery.SchemaField("publish_date", "DATE", mode="REQUIRED"),
            bigquery.SchemaField("slug", "STRING", mode="REQUIRED"),
            bigquery.SchemaField("title", "STRING"),
            bigquery.SchemaField("description", "STRING"),
            bigquery.SchemaField("sentiment", "STRING"),
            bigquery.SchemaField("tags", "STRING"),
            bigquery.SchemaField("full_markdown", "STRING"),
            bigquery.SchemaField("created_at", "TIMESTAMP"),
        ]
        self._ensure_table(meta_table_id, schema_meta, partition_field="publish_date")

        # 3. Create raw_headlines table
        raw_table_id = f"{self.project_id}.{self.dataset_id}.raw_headlines"
        schema_raw = [
            bigquery.SchemaField("publish_date", "DATE", mode="REQUIRED"),
            bigquery.SchemaField("slug", "STRING", mode="REQUIRED"),
            bigquery.SchemaField("source_domain", "STRING"),
            bigquery.SchemaField("headline", "STRING"),
            bigquery.SchemaField("url", "STRING"),
            bigquery.SchemaField("crawled_at", "TIMESTAMP"),
        ]
        self._ensure_table(raw_table_id, schema_raw, partition_field="publish_date")

    def _ensure_table(self, table_id, schema, partition_field=None):
        try:
            self.client.get_table(table_id)
        except NotFound:
            table = bigquery.Table(table_id, schema=schema)
            if partition_field:
                table.time_partitioning = bigquery.TimePartitioning(
                    type_=bigquery.TimePartitioningType.DAY,
                    field=partition_field
                )
            self.client.create_table(table)
            logging.info(f"Created table {table_id}")

    def save_article_metadata(self, metadata):
        """ metadata dict with matching schema keys """
        table_id = f"{self.project_id}.{self.dataset_id}.articles_metadata"
        metadata["created_at"] = datetime.datetime.now().isoformat()
        errors = self.client.insert_rows_json(table_id, [metadata])
        if errors:
            logging.error(f"BQ Metadata Insert Error: {errors}")
        return not errors

    def save_raw_headlines(self, headlines_list):
        """ list of dicts with matching schema keys """
        table_id = f"{self.project_id}.{self.dataset_id}.raw_headlines"
        errors = self.client.insert_rows_json(table_id, headlines_list)
        if errors:
            logging.error(f"BQ Raw Headlines Insert Error: {errors}")
        return not errors

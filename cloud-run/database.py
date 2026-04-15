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
            bigquery.SchemaField("publish_date", "DATE",      mode="REQUIRED"),
            bigquery.SchemaField("slug",         "STRING",    mode="REQUIRED"),
            bigquery.SchemaField("title",        "STRING"),
            bigquery.SchemaField("description",  "STRING"),
            bigquery.SchemaField("sentiment",    "STRING"),
            bigquery.SchemaField("tags",         "STRING"),
            bigquery.SchemaField("full_markdown","STRING"),
            bigquery.SchemaField("created_at",   "TIMESTAMP"),
        ]
        self._ensure_table(meta_table_id, schema_meta, partition_field="publish_date")

        # 3. Create raw_headlines table
        raw_table_id = f"{self.project_id}.{self.dataset_id}.raw_headlines"
        schema_raw = [
            bigquery.SchemaField("publish_date",  "DATE",      mode="REQUIRED"),
            bigquery.SchemaField("slug",          "STRING",    mode="REQUIRED"),
            bigquery.SchemaField("source_domain", "STRING"),
            bigquery.SchemaField("headline",      "STRING"),
            bigquery.SchemaField("url",           "STRING"),
            bigquery.SchemaField("crawled_at",    "TIMESTAMP"),
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

    # ─────────────────────────────────────────────
    # WRITE helpers — both include dedup guards
    # ─────────────────────────────────────────────

    def slug_exists(self, slug: str) -> bool:
        """Check if an article slug already exists in articles_metadata."""
        table_id = f"{self.project_id}.{self.dataset_id}.articles_metadata"
        query = f"""
            SELECT COUNT(1) AS cnt
            FROM `{table_id}`
            WHERE slug = @slug
        """
        job_config = bigquery.QueryJobConfig(
            query_parameters=[bigquery.ScalarQueryParameter("slug", "STRING", slug)]
        )
        try:
            result = list(self.client.query(query, job_config=job_config).result())
            return result[0].cnt > 0
        except Exception as e:
            logging.error(f"BQ slug_exists check error: {e}")
            return False  # Fail open — let it try to insert

    def save_article_metadata(self, metadata: dict) -> bool:
        """
        Insert article metadata. Skips (no-op) if slug already exists.
        Returns True if inserted, False if skipped or error.
        """
        slug = metadata.get("slug", "")
        if slug and self.slug_exists(slug):
            logging.warning(f"BQ: Skipping duplicate article slug '{slug}'")
            return False

        table_id = f"{self.project_id}.{self.dataset_id}.articles_metadata"
        metadata["created_at"] = datetime.datetime.now(datetime.timezone.utc).isoformat()
        errors = self.client.insert_rows_json(table_id, [metadata])
        if errors:
            logging.error(f"BQ Metadata Insert Error: {errors}")
        return not errors

    def save_raw_headlines(self, headlines_list: list) -> bool:
        """
        Insert raw headlines, deduplicating against the full 14-day URL window
        (consistent with the crawler's used_urls blacklist) so the raw_headlines
        table never contains redundant rows across days.
        """
        if not headlines_list:
            return True

        # Use the same 14-day window as the crawler — comprehensive cross-day guard
        existing_urls = self.get_past_headline_urls(days=14)

        fresh = [h for h in headlines_list if h.get("url", "") not in existing_urls]
        if not fresh:
            logging.info("BQ: All headlines already stored — nothing new to insert.")
            return True

        table_id = f"{self.project_id}.{self.dataset_id}.raw_headlines"
        errors = self.client.insert_rows_json(table_id, fresh)
        if errors:
            logging.error(f"BQ Raw Headlines Insert Error: {errors}")
        else:
            logging.info(f"BQ: Inserted {len(fresh)} new headlines (skipped {len(headlines_list) - len(fresh)} duplicates).")
        return not errors

    def _get_urls_for_date(self, date_str: str) -> set:
        """Return URLs already stored in raw_headlines for a given date."""
        if not date_str:
            return set()
        table_id = f"{self.project_id}.{self.dataset_id}.raw_headlines"
        query = f"""
            SELECT url
            FROM `{table_id}`
            WHERE publish_date = '{date_str}'
              AND url IS NOT NULL AND url != ''
        """
        try:
            result = self.client.query(query).result()
            return {row.url for row in result}
        except Exception as e:
            logging.error(f"BQ _get_urls_for_date error: {e}")
            return set()

    # ─────────────────────────────────────────────
    # READ helpers
    # ─────────────────────────────────────────────

    def get_past_article_titles(self, days: int = 21) -> list:
        """
        Returns slug + title of articles published in the last N days from BigQuery.
        Used to inject into AI prompt to prevent topic repetition.
        Returns most-recent first.
        """
        table_id = f"{self.project_id}.{self.dataset_id}.articles_metadata"
        query = f"""
            SELECT title, slug, publish_date
            FROM `{table_id}`
            WHERE publish_date >= DATE_SUB(CURRENT_DATE('Asia/Taipei'), INTERVAL {days} DAY)
            ORDER BY publish_date DESC, created_at DESC
            LIMIT 30
        """
        try:
            result = self.client.query(query).result()
            titles = [row.title for row in result if row.title]
            logging.info(f"BQ: fetched {len(titles)} past article titles for dedup")
            return titles
        except Exception as e:
            logging.error(f"BQ get_past_article_titles error: {e}")
            return []

    def get_past_headline_urls(self, days: int = 14) -> set:
        """
        Returns a set of already-crawled URLs from the last N days.
        Used to filter out previously processed news from the crawler output.
        Extended window to 14 days to better prevent re-crawling.
        """
        table_id = f"{self.project_id}.{self.dataset_id}.raw_headlines"
        query = f"""
            SELECT DISTINCT url
            FROM `{table_id}`
            WHERE publish_date >= DATE_SUB(CURRENT_DATE('Asia/Taipei'), INTERVAL {days} DAY)
              AND url IS NOT NULL AND url != ''
        """
        try:
            result = self.client.query(query).result()
            urls = {row.url for row in result}
            logging.info(f"BQ: fetched {len(urls)} past crawled URLs for dedup")
            return urls
        except Exception as e:
            logging.error(f"BQ get_past_headline_urls error: {e}")
            return set()

    def get_todays_article_count(self, date_str: str) -> int:
        """Returns how many articles have already been published today."""
        table_id = f"{self.project_id}.{self.dataset_id}.articles_metadata"
        query = f"""
            SELECT COUNT(1) AS cnt
            FROM `{table_id}`
            WHERE publish_date = '{date_str}'
        """
        try:
            result = list(self.client.query(query).result())
            return result[0].cnt
        except Exception as e:
            logging.error(f"BQ get_todays_article_count error: {e}")
            return 0

import pyodbc
import psycopg2
import pandas as pd
from django.db import connection
from .models import DataSource


class DataSourceService:
    @staticmethod
    def get_connection_string(source: DataSource):
        if source.engine == DataSource.Engine.MSSQL:
            # Using basic ODBC Driver 17 for SQL Server or generic "SQL Server"
            # TODO: Make driver configurable if needed
            driver = "{ODBC Driver 17 for SQL Server}"
            # Fallback to local SQL Server driver if 17 not present?
            # For now try 17.
            conn_str = f"DRIVER={driver};SERVER={source.host},{source.port};DATABASE={source.database_name};UID={source.username};PWD={source.password}"
            return conn_str
        elif source.engine == DataSource.Engine.POSTGRES:
            return f"host={source.host} port={source.port} dbname={source.database_name} user={source.username} password={source.password}"
        return ""

    def test_connection(self, source: DataSource):
        try:
            if source.engine == DataSource.Engine.MSSQL:
                conn_str = self.get_connection_string(source)
                # print(f"Connecting to MSSQL: {conn_str.replace(source.password, '***')}")
                conn = pyodbc.connect(conn_str, timeout=5)
                conn.close()
            elif source.engine == DataSource.Engine.POSTGRES:
                conn = psycopg2.connect(
                    host=source.host,
                    port=source.port,
                    database=source.database_name,
                    user=source.username,
                    password=source.password,
                    connect_timeout=5,
                )
                conn.close()
            return True, "Connection Successful"
        except Exception as e:
            return False, str(e)

    def list_tables(self, source: DataSource):
        tables = []
        try:
            if source.engine == DataSource.Engine.MSSQL:
                conn_str = self.get_connection_string(source)
                conn = pyodbc.connect(conn_str)
                cursor = conn.cursor()
                # Query to list tables in MSSQL
                cursor.execute(
                    "SELECT TABLE_SCHEMA, TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE='BASE TABLE'"
                )
                for row in cursor.fetchall():
                    tables.append(f"{row.TABLE_SCHEMA}.{row.TABLE_NAME}")
                conn.close()
            elif source.engine == DataSource.Engine.POSTGRES:
                conn = psycopg2.connect(
                    host=source.host,
                    port=source.port,
                    database=source.database_name,
                    user=source.username,
                    password=source.password,
                )
                cursor = conn.cursor()
                cursor.execute(
                    "SELECT table_schema, table_name FROM information_schema.tables WHERE table_schema='public'"
                )
                for row in cursor.fetchall():
                    tables.append(f"{row[0]}.{row[1]}")
                conn.close()
        except Exception as e:
            print(f"Error listing tables: {e}")
        return tables

    def get_data(self, source: DataSource, query: str):
        """
        Executes a query and returns a Pandas DataFrame
        """
        try:
            if source.engine == DataSource.Engine.MSSQL:
                conn_str = self.get_connection_string(source)
                conn = pyodbc.connect(conn_str)
                df = pd.read_sql(query, conn)
                conn.close()
                return df
            elif source.engine == DataSource.Engine.POSTGRES:
                conn_str = f"postgresql://{source.username}:{source.password}@{source.host}:{source.port}/{source.database_name}"
                # Pandas read_sql with postgres
                # We can use psycopg2 connection object too
                conn = psycopg2.connect(
                    host=source.host,
                    port=source.port,
                    database=source.database_name,
                    user=source.username,
                    password=source.password,
                )
                df = pd.read_sql(query, conn)
                conn.close()
                return df
        except Exception as e:
            print(f"Error fetching data: {e}")
            return pd.DataFrame()  # Empty on error

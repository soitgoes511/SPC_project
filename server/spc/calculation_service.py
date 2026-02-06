import pandas as pd
import numpy as np
from typing import Dict, Any, List
from .models import ChartConfig, DataSource
from .services import DataSourceService


class CalculationService:
    def __init__(self):
        self.ds_service = DataSourceService()

    def get_chart_data(
        self, chart_id: int, start_date=None, end_date=None
    ) -> Dict[str, Any]:
        try:
            config = ChartConfig.objects.get(id=chart_id)
        except ChartConfig.DoesNotExist:
            return {"error": "Chart configuration not found"}

        # 1. Construct Query
        # Handle Date filters if provided
        date_filter = ""
        if start_date and end_date:
            pass  # TODO: Add date filtering logic based on engine syntax (MSSQL vs Postgres)

        # Basic query construction
        # IMPORTANT: This is prone to SQL injection if fields are not sanitized.
        # In a real app, rely on parametrized queries or strict validation of column names.
        # Here we assume Admin (who sets up ChartConfig) is trusted.

        query = f"""
            SELECT {config.datetime_column} as timestamp, {config.value_column} as value
            FROM {config.table_name}
            WHERE {config.product_column} = '{config.product_identifier}'
            AND {config.operation_column} = '{config.operation_identifier}'
        """

        # 2. Fetch Data
        df = self.ds_service.get_data(config.data_source, query)

        if df.empty:
            return {"data": [], "statistics": {}}

        # Ensure types
        df["value"] = pd.to_numeric(df["value"], errors="coerce")
        df = df.dropna(subset=["value"])
        # Sort by timestamp? df = df.sort_values(by='timestamp')

        # 3. Aggregate Data
        # Default aggregation: Hourly mean/range? Or just raw points?
        # User requested: "aggregation should be allowed by time such as hour or week, or also could be by number of part"

        if config.aggregation_type == "TIME_HOUR":
            # Need to ensure timestamp is datetime
            df["timestamp"] = pd.to_datetime(df["timestamp"])
            df.set_index("timestamp", inplace=True)
            grouped = df.resample("1h")["value"].agg(
                ["mean", "std", "count", "min", "max"]
            )
            # Reset index to string for JSON
            grouped.reset_index(inplace=True)

            # Calculate Range (Max - Min) for R chart?
            grouped["range"] = grouped["max"] - grouped["min"]

            chart_data = grouped.to_dict(orient="records")
            stats_series = grouped[
                "mean"
            ]  # Calculate global stats on the aggregated means? Or raw? usually Raw for Cpk.

        elif config.aggregation_type == "COUNT":
            # Group by every N records
            n = config.aggregation_size
            df["group_id"] = np.arange(len(df)) // n
            grouped = df.groupby("group_id")["value"].agg(
                ["mean", "std", "count", "min", "max"]
            )
            grouped["range"] = grouped["max"] - grouped["min"]

            # Add a pseudo timestamp (first timestamp of the group)
            # df.groupby('group_id')['timestamp'].first() ...

            chart_data = grouped.to_dict(orient="records")
            stats_series = df["value"]  # Use raw data for Cpk

        else:
            # Raw data
            chart_data = df.to_dict(orient="records")
            stats_series = df["value"]

        # 4. Calculate Statistics (Cpk, etc)
        mu = stats_series.mean()
        sigma = stats_series.std()

        stats = {
            "mean": mu,
            "std_dev": sigma,
            "min": stats_series.min(),
            "max": stats_series.max(),
            "count": len(stats_series),
        }

        # Capability Indices (requires specs)
        if config.upper_spec_limit is not None and config.lower_spec_limit is not None:
            usl = config.upper_spec_limit
            lsl = config.lower_spec_limit

            cp = (usl - lsl) / (6 * sigma) if sigma > 0 else 0
            cpu = (usl - mu) / (3 * sigma) if sigma > 0 else 0
            cpl = (mu - lsl) / (3 * sigma) if sigma > 0 else 0
            cpk = min(cpu, cpl)

            stats.update({"Cp": cp, "Cpk": cpk, "Cpu": cpu, "Cpl": cpl})

        # 5. WECO Rules (Placeholder)
        # TODO: Implement rule checking on the 'chart_data' means

        return {
            "config": {
                "usl": config.upper_spec_limit,
                "lsl": config.lower_spec_limit,
                "target": config.target,
            },
            "data": chart_data,
            "statistics": stats,
        }

from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _


class DataSource(models.Model):
    class Engine(models.TextChoices):
        MSSQL = "MSSQL", _("Microsoft SQL Server")
        POSTGRES = "POSTGRES", _("PostgreSQL")

    name = models.CharField(max_length=100)
    engine = models.CharField(
        max_length=20, choices=Engine.choices, default=Engine.MSSQL
    )
    host = models.CharField(max_length=255)
    port = models.IntegerField(default=1433)
    database_name = models.CharField(max_length=255)
    username = models.CharField(max_length=255)
    password = models.CharField(
        max_length=255, help_text="Stored as plain text for now"
    )  # TODO: Encrypt
    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.engine})"


class ChartConfig(models.Model):
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="charts"
    )
    data_source = models.ForeignKey(
        DataSource, on_delete=models.CASCADE, related_name="charts"
    )

    # Data Mapping
    table_name = models.CharField(max_length=255, default="")
    value_column = models.CharField(
        max_length=255, default="", help_text="Column containing the measurement value"
    )
    datetime_column = models.CharField(
        max_length=255, default="", help_text="Column containing the timestamp"
    )

    # Identifiers to filter data in the external DB
    product_column = models.CharField(
        max_length=255, default="Product", help_text="Column name for Product"
    )
    product_identifier = models.CharField(
        max_length=255, default="", help_text="Value to filter Product column by"
    )

    operation_column = models.CharField(
        max_length=255, default="Operation", help_text="Column name for Operation"
    )
    operation_identifier = models.CharField(
        max_length=255, default="", help_text="Value to filter Operation column by"
    )

    # Optional Display Names
    title = models.CharField(max_length=255, blank=True)

    # Specifications
    upper_spec_limit = models.FloatField(null=True, blank=True)
    lower_spec_limit = models.FloatField(null=True, blank=True)
    target = models.FloatField(null=True, blank=True)

    # Configuration
    aggregation_type = models.CharField(
        max_length=50,
        default="TIME_HOUR",
        choices=[("TIME_HOUR", "Hourly"), ("TIME_DAY", "Daily"), ("COUNT", "By Count")],
    )
    aggregation_size = models.IntegerField(
        default=1, help_text="e.g. 1 Hour or 30 parts"
    )

    weco_rules = models.JSONField(
        default=dict, help_text="Enabled WECO rules configuration"
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title or self.product_identifier} - {self.operation_identifier}"

from django.contrib import admin
from .models import DataSource, ChartConfig


@admin.register(DataSource)
class DataSourceAdmin(admin.ModelAdmin):
    list_display = ["name", "engine", "host", "database_name", "is_active"]
    list_filter = ["engine", "is_active"]
    search_fields = ["name", "host", "database_name"]
    actions = ["test_connection"]

    def test_connection(self, request, queryset):
        from .services import DataSourceService

        service = DataSourceService()
        success_count = 0
        fail_count = 0
        for source in queryset:
            success, message = service.test_connection(source)
            if success:
                success_count += 1
                self.message_user(request, f"{source.name}: Connection Successful")
            else:
                fail_count += 1
                self.message_user(
                    request, f"{source.name}: Failed - {message}", level="error"
                )

        # summary
        if success_count > 0:
            self.message_user(
                request, f"Successfully connected to {success_count} sources."
            )

    test_connection.short_description = "Test Connection to selected Data Sources"


@admin.register(ChartConfig)
class ChartConfigAdmin(admin.ModelAdmin):
    list_display = ["__str__", "owner", "priority_display", "aggregation_type"]
    list_filter = ["aggregation_type", "data_source"]
    search_fields = ["product_identifier", "operation_identifier", "title"]

    def priority_display(self, obj):
        return f"{obj.product_identifier} / {obj.operation_identifier}"

    priority_display.short_description = "Product / Operation"

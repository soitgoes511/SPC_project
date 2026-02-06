from rest_framework import serializers
from .models import ChartConfig, DataSource


class DataSourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = DataSource
        fields = "__all__"


class ChartConfigSerializer(serializers.ModelSerializer):
    data_source_name = serializers.ReadOnlyField(source="data_source.name")

    class Meta:
        model = ChartConfig
        fields = "__all__"
        read_only_fields = ["owner"]

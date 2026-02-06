from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ChartDataView, ChartConfigListCreateView, ChartConfigDetailView, DataSourceViewSet

router = DefaultRouter()
router.register(r'datasources', DataSourceViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('charts/', ChartConfigListCreateView.as_view(), name='chart-list'),
    path('charts/<int:pk>/', ChartConfigDetailView.as_view(), name='chart-detail'),
    path('charts/<int:pk>/data/', ChartDataView.as_view(), name='chart-data'),
]

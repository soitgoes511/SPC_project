from rest_framework import generics, views, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import ChartConfig
from .calculation_service import CalculationService

class ChartDataView(views.APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        # Service handles fetching logic
        service = CalculationService()
        data = service.get_chart_data(pk)
        
        if "error" in data:
            return Response(data, status=status.HTTP_404_NOT_FOUND)
            
        return Response(data)

# Also need basic CRUD for ChartConfig if not using Admin Panel for everything
# But user said "user with create access... should be able to setup an SPC chart"
# So we DO need an API for creating ChartConfig from Frontend.

from .serializers import ChartConfigSerializer

class ChartConfigListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ChartConfigSerializer

    def get_queryset(self):
        return ChartConfig.objects.filter(owner=self.request.user) # Or all?
    
    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

class ChartConfigDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ChartConfigSerializer
    queryset = ChartConfig.objects.all()

from rest_framework import viewsets
from rest_framework.decorators import action
from .models import DataSource
from .serializers import DataSourceSerializer
from .services import DataSourceService

class DataSourceViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated] # Todo: Restrict to Admin
    serializer_class = DataSourceSerializer
    queryset = DataSource.objects.all()

    @action(detail=True, methods=['post'])
    def test_connection(self, request, pk=None):
        source = self.get_object()
        service = DataSourceService()
        success, message = service.test_connection(source)
        return Response({'success': success, 'message': message})


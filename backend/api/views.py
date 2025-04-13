from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import FormField
from .serializers import FormFieldSerializer, UserDataSerializer

class FormFieldList(APIView):
    def get(self, request):
        fields = FormField.objects.all()
        serializer = FormFieldSerializer(fields, many=True)
        return Response(serializer.data)

class AddFormField(APIView):
    def post(self, request):
        serializer = FormFieldSerializer(data=request.data)
        if serializer.is_valid():
            field = serializer.save()
            return Response(FormFieldSerializer(field).data, status=201)
        return Response(serializer.errors, status=400)

class SubmitUserData(APIView):
    def post(self, request):
        serializer = UserDataSerializer(data={'data': request.data})
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Data submitted!"}, status=201)
        return Response(serializer.errors, status=400)

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import FormField, UserData
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

class FormDataList(APIView):
    def get(self, request):
        data = UserData.objects.all()
        serializer = UserDataSerializer(data, many=True)
        for i in serializer.data:
            print(i)
        return Response(serializer.data)

class FormDataDetail(APIView):
    def get_object(self, id):
        try:
            return UserData.objects.get(id=id)
        except UserData.DoesNotExist:
            return None

    def delete(self, request, id):
        data = UserData.objects.get(id=id)
        data.delete()
        return Response({"message": "Data deleted!"}, status=200)
    
    def put(self, request, id):
        instance = self.get_object(id)
        if not instance:
            return Response({"error": "Not found"}, status=status.HTTP_404_NOT_FOUND)

        # Prepare the data for update
        update_data = {
            'data': request.data.get('data', {})
        }
        
        serializer = UserDataSerializer(instance, data=update_data, partial=True)
        if serializer.is_valid():
            updated_instance = serializer.save()
            return Response(UserDataSerializer(updated_instance).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


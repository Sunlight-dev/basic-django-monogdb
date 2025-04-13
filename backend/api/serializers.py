from rest_framework import serializers
from .models import FormField, UserData

class FormFieldSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    name = serializers.CharField()
    label = serializers.CharField()
    type = serializers.ChoiceField(choices=["text", "number", "select"])
    required = serializers.BooleanField()
    options = serializers.ListField(
        child=serializers.CharField(), required=False, allow_null=True
    )

    def create(self, validated_data):
        return FormField(**validated_data).save()

class UserDataSerializer(serializers.Serializer):
    data = serializers.DictField()

    def create(self, validated_data):
        return UserData(**validated_data).save()

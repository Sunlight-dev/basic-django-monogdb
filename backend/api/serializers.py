from rest_framework import serializers
from .models import FormField, UserData
from .fields import ObjectIdField

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
    id = ObjectIdField(read_only=True)

    def create(self, validated_data):
        return UserData(**validated_data).save()

    def update(self, instance, validated_data):
        # Update the data field
        instance.data = validated_data.get('data', instance.data)
        instance.save()
        return instance

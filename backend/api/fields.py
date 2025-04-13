from rest_framework import serializers
from bson import ObjectId

class ObjectIdField(serializers.Field):
    def to_representation(self, value):
        return str(value) if isinstance(value, ObjectId) else value

    def to_internal_value(self, data):
        try:
            return ObjectId(str(data))
        except Exception:
            raise serializers.ValidationError("Invalid ObjectId format")

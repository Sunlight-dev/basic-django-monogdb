from mongoengine import Document, StringField, BooleanField, ListField, DictField

class FormField(Document):
    name = StringField(required=True, unique=True)
    label = StringField(required=True)
    type = StringField(choices=["text", "number", "select"], default="text")
    required = BooleanField(default=False)
    options = ListField(StringField())

class UserData(Document):
    data = DictField()  # Store arbitrary user form data

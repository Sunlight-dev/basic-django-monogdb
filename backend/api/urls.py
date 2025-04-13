from django.urls import path
from .views import FormFieldList, AddFormField, SubmitUserData

urlpatterns = [
    path('form-fields/', FormFieldList.as_view()),
    path('add-form-fields/', AddFormField.as_view()),
    path('submit-data/', SubmitUserData.as_view()),
]

from django.urls import path
from .views import FormFieldList, AddFormField, SubmitUserData, FormDataList, FormDataDetail

urlpatterns = [
    path('form-fields/', FormFieldList.as_view()),
    path('add-form-fields/', AddFormField.as_view()),
    path('submit-data/', SubmitUserData.as_view()),
    path('form-data/', FormDataList.as_view()),
    path('form-data/<str:id>/', FormDataDetail.as_view()),
    path('form-data/<str:id>/', FormDataDetail.as_view()),
]

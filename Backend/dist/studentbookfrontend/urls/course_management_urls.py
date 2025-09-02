from django.urls import path
from studentbookfrontend.views.course_management_views import *


urlpatterns = [
    # path("subject-list", SubjectListCreateView.as_view()),
    # path("subject-detail/<int:pk>", SubjectDetailView.as_view()),
     path("contentdata", MainContentView.as_view()),
    path("subject-list/<int:class_id>", SubjectList.as_view()),
]

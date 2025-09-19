# views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status,permissions
from rest_framework import generics
from studentbookfrontend.models import *
from studentbookfrontend.serializers.course_management_serilizers import *
from studentbookfrontend.helper.api_response import api_response
from django.shortcuts import get_object_or_404
from django.db.models import Sum, F, ExpressionWrapper, DurationField
from django.db.models.functions import Cast



#Main Content View

class MainContentView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def get(self,request,student_id,class_id):

        student_class = get_object_or_404(Class, id=class_id)
        if not student_class:
            return api_response(
                message="Class not found",
                message_type="error",
                status_code=status.HTTP_404_NOT_FOUND
                        )
        try:
            student = Student.objects.get(id=student_id, student_class=class_id)
        except Student.DoesNotExist:
            student = None
        if not student:
            return api_response(
                message="Student not found",
                message_type="error",
                status_code=status.HTTP_404_NOT_FOUND
                        )
      
        data = []
        general_contents = GeneralContent.objects.all()

        for content in general_contents:
            content_data = {
                'name': content.title,
                'image': (content.image.url) if content.image else None,
                'description': content.description if content.description else None,
                'sub_title': content.sub_title if content.sub_title else None,
                 
            }
            if content.title == "My Subjects":
                # content_data['class_id'] = student_class.id
                content_data['sub_title'] = student_class.name
                
                data.insert(0, content_data)  # Insert at the beginning
                # data.append
            else:
                data.append(content_data)
        # data['class'] = student_class.name
        responce = {
            'class': student_class.name,
            'content': data
        }
        
        return api_response(
                message="Content data fetched successfully",
                message_type="success",
                status_code=status.HTTP_200_OK,
                data = responce
            )


class SubjectList(APIView):
    # permission_classes = [permissions.IsAuthenticated]
    def get(self, request,student_id,class_id):
        student_class = get_object_or_404(Class, id=class_id)
        if not student_class:
            return api_response(
                message="Class not found",
                message_type="error",
                status_code=status.HTTP_404_NOT_FOUND
                        )
        try:
            student = Student.objects.get(id=student_id, student_class=class_id)
        except Student.DoesNotExist:
            return api_response(
                message="Student not found",
                message_type="error",
                status_code=status.HTTP_404_NOT_FOUND
            )

        # 1️⃣ Fetch all subjects for the class in one query
        subjects = Subject.objects.filter(course_id=class_id).order_by("id")

        # 2️⃣ Aggregate watched duration for all subjects in one query
        watched_durations = (
            VideoTrackingLog.objects.filter(student=student)
            .values("subchapter__chapter__subject_id")
            .annotate(total_watched=Sum("watched_duration"))
        )
        watched_map = {
            wd["subchapter__chapter__subject_id"]: wd["total_watched"]
            for wd in watched_durations
        }

        # 3️⃣ Aggregate total video durations for all subchapters in one query
        subchapter_durations = (
            Subchapter.objects.filter(subject__in=subjects)
            .values("subject_id")
            .annotate(
                total_duration=Sum(
                    ExpressionWrapper(
                        Cast("vedio_duration", DurationField()), DurationField()
                    )
                )
            )
        )
        total_map = {
            sd["subject_id"]: sd["total_duration"] for sd in subchapter_durations
        }

        # 4️⃣ Build final response (no extra queries inside loop)
        data = []
        for subject in subjects:
            watched_time = watched_map.get(subject.id, timedelta(0)) or timedelta(0)
            total_time = total_map.get(subject.id, timedelta(0)) or timedelta(0)

            watched_seconds = watched_time.total_seconds()
            total_seconds = total_time.total_seconds()

            completion_percentage = (
                (watched_seconds / total_seconds) * 100 if total_seconds > 0 else 0
            )

            data.append({
                "id": subject.id,
                "name": subject.name,
                "class_id": student_class.id,
                "class_name": student_class.name,
                "icon": request.build_absolute_uri(subject.icon.url) if subject.icon else None,
                # "total_hours": str(timedelta(seconds=int(watched_seconds))),
                "progress_percentage": round(completion_percentage, 2),
            })

        return api_response(
            message="Subjects fetched successfully",
            message_type="success",
            status_code=status.HTTP_200_OK,
            data=data,
        )
 


class ClassWIthSubjectsView(APIView):
    # permission_classes = [permissions.IsAuthenticated]
    def get(self, request, student_id,class_id):
        classes = Class.objects.all().order_by('id')
        data = []
        for cls in classes:
            subjects = Subject.objects.filter(course=cls.id).order_by('id')
            subject_data = []
            for subject in subjects:
                subject_data.append({
                    'subject_id': subject.id,
                    'subject_name': subject.name,
                    # 'subject_image': subject.image.url if subject.image else None
                })
            # subject_serializer = SubjectSerializer(subjects, many=True)

            class_data = {
                'class_id': cls.id,
                'class_name': cls.name,
                'subjects': subject_data
            }
            data.append(class_data)
        
        return api_response(
            message="Classes with subjects fetched successfully",
            message_type="success",
            status_code=status.HTTP_200_OK,
            data=data
        )

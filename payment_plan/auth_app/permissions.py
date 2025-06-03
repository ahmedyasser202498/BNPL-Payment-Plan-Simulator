from rest_framework.permissions import BasePermission

class IsOwner(BasePermission):
    def has_object_permission(self, request, view, obj):
        return request.user.is_merchant == False
    

class IsPlanUser(BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.user == request.user
    


class IsInstallmentUser(BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.plan.user == request.user

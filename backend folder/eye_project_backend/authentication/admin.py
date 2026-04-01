from django.contrib import admin
from .models import User

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
	list_display = ('email', 'username', 'mobile', 'address', 'is_active', 'is_staff')
	search_fields = ('email', 'username', 'mobile')

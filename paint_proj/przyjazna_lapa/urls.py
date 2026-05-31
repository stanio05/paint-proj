from django.contrib import admin
from django.urls import path
from core import views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin-panel-django/', admin.site.urls),
    path('', views.home, name='home'),
    path('zwierzeta/', views.animal_list, name='animals_list'),
    path('szczegoly/', views.animal_details, name='animal_details'),
    path('adopcja/', views.adoption_form_view, name='adoption_form'),
    path('kontakt/', views.contact_view, name='contact_form'),
    path('logowanie/', views.login_register_view, name='login'),
    path('wyloguj/', views.logout_view, name='logout'),
    path('admin-app/', views.admin_panel_view, name='admin_panel'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

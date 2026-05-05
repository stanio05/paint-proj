from django.db import models
from django.contrib.auth.models import User

# --- MODELE ZWIERZĄT ---
class Shelter(models.Model):
    name = models.CharField(max_length=255, verbose_name="Nazwa schroniska")
    city = models.CharField(max_length=100, verbose_name="Miasto")
    address = models.TextField(verbose_name="Adres")

    def __str__(self):
        return f"{self.name} ({self.city})"

class Animal(models.Model):
    STATUS_CHOICES = [('available', 'Dostępny'), ('pending', 'W trakcie adopcji'), ('adopted', 'Adoptowany')]
    SPECIES_CHOICES = [('pies', 'Pies'), ('kot', 'Kot')]
    SIZE_CHOICES = [('mały', 'Mały'), ('średni', 'Średni'), ('duży', 'Duży')]

    name = models.CharField(max_length=100, verbose_name="Imię")
    species = models.CharField(max_length=10, choices=SPECIES_CHOICES, verbose_name="Gatunek")
    age = models.PositiveIntegerField(verbose_name="Wiek (w latach)")
    size = models.CharField(max_length=10, choices=SIZE_CHOICES, verbose_name="Wielkość")
    description = models.TextField(verbose_name="Opis")
    shelter = models.ForeignKey(Shelter, on_delete=models.CASCADE, related_name='animals', verbose_name="Schronisko")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='available', verbose_name="Status")
    image = models.ImageField(upload_to='animals/', blank=True, null=True, verbose_name="Zdjęcie")
    
    def __str__(self):
        return self.name

# --- MODELE ADOPCJI ---
class AdoptionApplication(models.Model):
    STATUS_CHOICES = [('new', 'Nowe zgłoszenie'), ('review', 'W analizie'), ('approved', 'Zatwierdzone'), ('rejected', 'Odrzucone')]
    animal = models.ForeignKey(Animal, on_delete=models.CASCADE, related_name='applications', verbose_name="Zwierzę")
    applicant = models.ForeignKey(User, on_delete=models.CASCADE, related_name='applications', verbose_name="Aplikujący")
    phone_number = models.CharField(max_length=20, verbose_name="Numer telefonu")
    experience = models.TextField(verbose_name="Doświadczenie ze zwierzętami", blank=True)
    living_conditions = models.TextField(verbose_name="Warunki mieszkaniowe", blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='new', verbose_name="Status wniosku")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Wniosek - {self.animal.name} od {self.applicant.username}"

# --- MODELE KONTAKTU ---
class ContactMessage(models.Model):
    name = models.CharField(max_length=150, verbose_name="Imię i nazwisko")
    email = models.EmailField(verbose_name="Adres e-mail")
    subject = models.CharField(max_length=200, verbose_name="Temat")
    message = models.TextField(verbose_name="Treść wiadomości")
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False, verbose_name="Przeczytane")

    def __str__(self):
        return f"Wiadomość od {self.name} - {self.subject}"

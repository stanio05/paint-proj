import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'przyjazna_lapa.settings')
django.setup()

from core.models import Shelter, Animal
from django.contrib.auth.models import User

def seed():
    # Superuser
    if not User.objects.filter(username='admin').exists():
        User.objects.create_superuser('admin', 'admin@example.com', 'admin123')
        print("Superużytkownik dodany.")

    shelter_krakow, _ = Shelter.objects.get_or_create(name="Schronisko Kraków", city="kraków", address="ul. Psia 1, Kraków")
    shelter_warszawa, _ = Shelter.objects.get_or_create(name="Schronisko Warszawa", city="warszawa", address="ul. Kocia 2, Warszawa")

    animals_data = [
        {
            "name": "Burek", "species": "pies", "age": 4, "size": "średni", "status": "available", "shelter": shelter_krakow,
            "description": "Energiczny i przyjazny pies, który uwielbia spacery."
        },
        {
            "name": "Luna", "species": "kot", "age": 2, "size": "mały", "status": "available", "shelter": shelter_krakow,
            "description": "Spokojna kotka lubiąca ciche miejsca."
        },
        {
            "name": "Rex", "species": "pies", "age": 7, "size": "duży", "status": "available", "shelter": shelter_warszawa,
            "description": "Wierny i opanowany pies."
        }
    ]

    for data in animals_data:
        Animal.objects.get_or_create(**data)

    print("Dane testowe zostały dodane (bez zdjęć - dodaj je ręcznie w panelu).")

if __name__ == "__main__":
    seed()

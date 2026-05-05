from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import login, logout
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib.auth.decorators import user_passes_test
from django.contrib import messages
from .models import Animal, Shelter, AdoptionApplication, ContactMessage

# --- WIDOKI OGÓLNE ---
def home(request):
    featured_animals = Animal.objects.filter(status='available')[:3]
    return render(request, 'index.html', {'featured_animals': featured_animals})

def animal_list(request):
    animals = Animal.objects.all()
    search = request.GET.get('search')
    species = request.GET.get('species')
    age = request.GET.get('age')
    shelter = request.GET.get('shelter')
    size = request.GET.get('size')

    if search: animals = animals.filter(name__icontains=search)
    if species and species != 'all': animals = animals.filter(species=species)
    if size and size != 'all': animals = animals.filter(size=size)
    if shelter and shelter != 'all': animals = animals.filter(shelter__city=shelter)
    if age:
        if age == 'young': animals = animals.filter(age__lte=3)
        elif age == 'adult': animals = animals.filter(age__gte=4, age__lte=8)
        elif age == 'senior': animals = animals.filter(age__gte=9)

    shelters = Shelter.objects.values_list('city', flat=True).distinct()
    return render(request, 'animals/zwierzeta.html', {'animals': animals, 'shelters': shelters, 'count': animals.count()})

def animal_details(request):
    animal_name = request.GET.get('animal')
    animal = get_object_or_404(Animal, name=animal_name)
    return render(request, 'animals/szczegoly.html', {'animal': animal})

# --- WIDOKI UŻYTKOWNIKA ---
def login_register_view(request):
    if request.method == 'POST':
        if 'register' in request.POST:
            form = UserCreationForm(request.POST)
            if form.is_valid():
                user = form.save()
                login(request, user)
                messages.success(request, "Konto zostało utworzone.")
                return redirect('home')
            else:
                for error in form.errors.values(): messages.error(request, error)
        else:
            form = AuthenticationForm(request, data=request.POST)
            if form.is_valid():
                user = form.get_user()
                login(request, user)
                return redirect('home')
            else:
                messages.error(request, "Błędny login lub hasło.")
    return render(request, 'users/logowanie.html')

def logout_view(request):
    logout(request)
    return redirect('home')

# --- WIDOKI FORMULARZY ---
def adoption_form_view(request):
    animal_name = request.GET.get('animal')
    animal = Animal.objects.filter(name=animal_name).first() if animal_name else None

    if request.method == 'POST':
        if not request.user.is_authenticated:
            messages.error(request, "Zaloguj się, aby wysłać wniosek.")
            return redirect('login')
        animal_id = request.POST.get('animal_id')
        animal_obj = get_object_or_404(Animal, id=animal_id)
        AdoptionApplication.objects.create(
            animal=animal_obj, applicant=request.user, phone_number=request.POST.get('phone'),
            experience=request.POST.get('experience'), living_conditions=request.POST.get('living_conditions')
        )
        messages.success(request, "Wniosek został wysłany.")
        return redirect('home')
    return render(request, 'adoptions/adopcja.html', {'animal': animal})

def contact_view(request):
    if request.method == 'POST':
        ContactMessage.objects.create(
            name=request.POST.get('name'), email=request.POST.get('email'),
            subject=request.POST.get('subject'), message=request.POST.get('message')
        )
        messages.success(request, "Wiadomość została wysłana.")
        return redirect('contact_form')
    animal_name = request.GET.get('animal')
    subject = f"Zapytanie o zwierzę: {animal_name}" if animal_name else ""
    return render(request, 'contact/kontakt.html', {'subject': subject})

# --- WIDOK ADMINISTRATORA ---
@user_passes_test(lambda u: u.is_staff)
def admin_panel_view(request):
    if request.method == 'POST':
        shelter_city = request.POST.get('shelter')
        shelter, _ = Shelter.objects.get_or_create(city=shelter_city.lower(), defaults={'name': f"Schronisko {shelter_city}", 'address': 'Zmień adres'})
        Animal.objects.create(
            name=request.POST.get('name'), species=request.POST.get('species').lower(), age=request.POST.get('age'),
            status='available', shelter=shelter, 
            image=request.FILES.get('image'), # Zmienione na FILES
            description=request.POST.get('description'), size='średni'
        )
        messages.success(request, "Dodano ogłoszenie.")
        return redirect('admin_panel')
    return render(request, 'users/admin.html', {
        'animals': Animal.objects.all().order_by('-id'),
        'applications': AdoptionApplication.objects.all().order_by('-created_at')
    })

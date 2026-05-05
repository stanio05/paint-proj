# Przyjazna Lapa - System Adopcji Zwierzat

Przyjazna Lapa to aplikacja webowa oparta na frameworku Django, sluzaca jako baza do budowy systemow zarzadzania schroniskami dla zwierzat oraz procesami adopcyjnymi.

## Funkcje systemu

- Katalog zwierzat z mozliwoscia przegladania szczegolow.
- System skladania wnioskow adopcyjnych.
- Formularz kontaktowy.
- Autentykacja i autoryzacja uzytkownikow.
- Panel administracyjny do zarzadzania zasobami bazy danych.
- Skrypt inicjalizacyjny (seed) do celow deweloperskich.

## Wymagania techniczne

- Python 3.12 lub nowszy
- Django 6.0.4
- Pillow (biblioteka przetwarzania obrazow)
- SQLite (domyslny silnik bazy danych)

## Instrukcja instalacji

1. Pobranie repozytorium:
   ```bash
   git clone <url-repozytorium>
   cd przyjazna_lapa
   ```

2. Konfiguracja srodowiska wirtualnego:
   ```bash
   python -m venv venv
   source venv/bin/activate  # Linux/macOS
   # lub
   venv\Scripts\activate     # Windows
   ```

3. Instalacja zaleznosci:
   ```bash
   pip install -r requirements.txt
   ```

4. Wykonanie migracji bazy danych:
   ```bash
   python manage.py migrate
   ```

5. Inicjalizacja danych testowych:
   ```bash
   python seed_data.py
   ```
   Domyslne dane logowania administratora:
   - Login: admin
   - Haslo: admin123

6. Uruchomienie serwera:
   ```bash
   python manage.py runserver
   ```

## Struktura projektu

- core/ - Logika biznesowa, modele danych i widoki aplikacji.
- przyjazna_lapa/ - Pliki konfiguracyjne projektu Django.
- static/ - Zasoby statyczne (CSS, JavaScript).
- templates/ - Szablony HTML.
- seed_data.py - Skrypt automatyzujacy wypelnianie bazy danych.

## Uwagi

Plik bazy danych db.sqlite3 oraz katalog media/ sa domyslnie ignorowane przez system kontroli wersji zgodnie z plikiem .gitignore. Po instalacji nalezy przeprowadzic migracje oraz manualnie dodac pliki graficzne przez panel administracyjny.

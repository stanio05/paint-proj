
window.onload = function () {
    ustawRok();
    menuMobilne();
    filtryZwierzat();
    wpiszZwierzeZAdresu();
    wyborLogowania();
    walidacjaFormularzy();
    panelAdmina();
    pokazHaslo();
};

function ustawRok() {
    var pola = document.querySelectorAll('[data-current-year]');
    var rok = new Date().getFullYear();

    for (var i = 0; i < pola.length; i++) {
        pola[i].innerHTML = rok;
    }
}

function menuMobilne() {
    var przycisk = document.querySelector('[data-nav-toggle]');
    var menu = document.querySelector('[data-main-nav]');
    var akcje = document.querySelector('[data-nav-actions]');

    if (przycisk == null || menu == null) {
        return;
    }

    przycisk.onclick = function () {
        if (menu.className.indexOf('is-open') === -1) {
            menu.className += ' is-open';
            if (akcje != null) {
                akcje.className += ' is-open';
            }
            przycisk.setAttribute('aria-expanded', 'true');
        } else {
            menu.className = menu.className.replace(' is-open', '');
            if (akcje != null) {
                akcje.className = akcje.className.replace(' is-open', '');
            }
            przycisk.setAttribute('aria-expanded', 'false');
        }
    };
}

function filtryZwierzat() {
    var formularz = document.querySelector('[data-animal-filter-form]');
    var karty = document.querySelectorAll('[data-animal-card]');
    var licznik = document.querySelector('[data-results-count]');
    var reset = document.querySelector('[data-reset-filters]');

    if (formularz == null || karty.length === 0) {
        return;
    }

    function filtruj() {
        var szukaj = tekst(formularz.search.value);
        var gatunek = tekst(formularz.species.value);
        var wiek = formularz.age.value;
        var schronisko = tekst(formularz.shelter.value);
        var wielkosc = tekst(formularz.size.value);
        var ileWidac = 0;

        for (var i = 0; i < karty.length; i++) {
            var karta = karty[i];
            var nazwaKarty = tekst(karta.getAttribute('data-name'));
            var gatunekKarty = tekst(karta.getAttribute('data-species'));
            var wiekKarty = parseInt(karta.getAttribute('data-age'), 10);
            var schroniskoKarty = tekst(karta.getAttribute('data-shelter'));
            var wielkoscKarty = tekst(karta.getAttribute('data-size'));

            var pasujeNazwa = szukaj === '' || nazwaKarty.indexOf(szukaj) !== -1;
            var pasujeGatunek = gatunek === 'all' || gatunek === gatunekKarty;
            var pasujeWiek = sprawdzWiek(wiekKarty, wiek);
            var pasujeSchronisko = schronisko === 'all' || schronisko === schroniskoKarty;
            var pasujeWielkosc = wielkosc === 'all' || wielkosc === wielkoscKarty;

            if (pasujeNazwa && pasujeGatunek && pasujeWiek && pasujeSchronisko && pasujeWielkosc) {
                karta.hidden = false;
                ileWidac++;
            } else {
                karta.hidden = true;
            }
        }

        if (licznik != null) {
            if (ileWidac === 1) {
                licznik.innerHTML = '1 wynik';
            } else {
                licznik.innerHTML = ileWidac + ' wyników';
            }
        }
    }

    formularz.oninput = filtruj;
    formularz.onchange = filtruj;
    formularz.onsubmit = function (event) {
        event.preventDefault();
        filtruj();
    };

    if (reset != null) {
        reset.onclick = function () {
            formularz.reset();
            filtruj();
        };
    }

    filtruj();
}

function sprawdzWiek(wiek, zakres) {
    if (zakres === 'young') {
        return wiek <= 3;
    }
    if (zakres === 'adult') {
        return wiek >= 4 && wiek <= 8;
    }
    if (zakres === 'senior') {
        return wiek >= 9;
    }
    return true;
}

function tekst(wartosc) {
    if (wartosc == null) {
        return '';
    }
    return String(wartosc).toLowerCase().trim();
}

function wpiszZwierzeZAdresu() {
    var pole = document.querySelector('[name="animal_name"]');
    if (pole == null) {
        return;
    }

    var adres = new URLSearchParams(window.location.search);
    var zwierze = adres.get('animal');

    if (zwierze != null && zwierze !== '') {
        pole.value = zwierze;
    }
}

function wyborLogowania() {
    var wybory = document.querySelectorAll('[data-auth-choice]');
    var panele = document.querySelectorAll('[data-auth-panel]');
    var etykiety = document.querySelectorAll('[data-auth-label]');

    if (wybory.length === 0 || panele.length === 0) {
        return;
    }

    function pokazPanel(wartosc) {
        for (var i = 0; i < panele.length; i++) {
            if (panele[i].getAttribute('data-auth-panel') === wartosc) {
                panele[i].className = panele[i].className.replace(' hidden', '');
            } else {
                if (panele[i].className.indexOf('hidden') === -1) {
                    panele[i].className += ' hidden';
                }
            }
        }

        for (var j = 0; j < etykiety.length; j++) {
            if (etykiety[j].getAttribute('data-auth-label') === wartosc) {
                if (etykiety[j].className.indexOf('active') === -1) {
                    etykiety[j].className += ' active';
                }
            } else {
                etykiety[j].className = etykiety[j].className.replace(' active', '');
            }
        }
    }

    for (var k = 0; k < wybory.length; k++) {
        wybory[k].onchange = function () {
            pokazPanel(this.value);
        };
    }
}

function walidacjaFormularzy() {
    var formularze = document.querySelectorAll('form[data-validate]');

    for (var i = 0; i < formularze.length; i++) {
        formularze[i].onsubmit = function (event) {
            usunKomunikat(this);

            var blad = sprawdzFormularz(this);
            if (blad !== '') {
                event.preventDefault();
                pokazKomunikat(this, blad, 'error');
                return false;
            }

            if (this.getAttribute('data-demo-submit') === 'true') {
                event.preventDefault();
                pokazKomunikat(this, 'Formularz został poprawnie wypełniony.', 'success');
                this.reset();
                return false;
            }
        };
    }
}

function sprawdzFormularz(formularz) {
    var wymagane = formularz.querySelectorAll('[required]');

    for (var i = 0; i < wymagane.length; i++) {
        var pole = wymagane[i];

        if (pole.type === 'checkbox') {
            if (pole.checked === false) {
                return 'Zaznacz wymagane oświadczenie.';
            }
        } else {
            if (pole.value.trim() === '') {
                return 'Uzupełnij pole: ' + etykietaPola(pole) + '.';
            }
        }
    }

    var emaile = formularz.querySelectorAll('input[type="email"]');
    for (var j = 0; j < emaile.length; j++) {
        if (emaile[j].value.trim() !== '' && poprawnyEmail(emaile[j].value) === false) {
            return 'Podaj poprawny adres e-mail.';
        }
    }

    var haslo = formularz.querySelector('[name="password"]');
    var haslo2 = formularz.querySelector('[name="password_repeat"]');
    if (haslo != null && haslo2 != null && haslo.value !== haslo2.value) {
        return 'Hasła muszą być takie same.';
    }

    var telefon = formularz.querySelector('[name="phone"]');
    if (telefon != null && telefon.value.trim() !== '' && poprawnyTelefon(telefon.value) === false) {
        return 'Podaj poprawny numer telefonu.';
    }

    return '';
}

function poprawnyEmail(email) {
    var wzor = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return wzor.test(email.trim());
}

function poprawnyTelefon(telefon) {
    var wzor = /^[0-9+\-\s]{7,20}$/;
    return wzor.test(telefon.trim());
}

function etykietaPola(pole) {
    var rodzic = pole.parentNode;
    if (rodzic != null) {
        var label = rodzic.querySelector('label');
        if (label != null) {
            return label.innerHTML.replace('*', '').trim();
        }
    }
    return pole.name;
}

function pokazKomunikat(formularz, tekstKomunikatu, typ) {
    var komunikat = document.createElement('div');
    komunikat.className = 'form-message ' + typ;
    komunikat.innerHTML = tekstKomunikatu;
    formularz.insertBefore(komunikat, formularz.firstChild);
}

function usunKomunikat(formularz) {
    var komunikat = formularz.querySelector('.form-message');
    if (komunikat != null) {
        formularz.removeChild(komunikat);
    }
}

function panelAdmina() {
    var formularz = document.querySelector('[data-admin-animal-form]');
    var lista = document.querySelector('[data-admin-list]');

    if (formularz == null || lista == null) {
        return;
    }

    formularz.onsubmit = function (event) {
        if (formularz.getAttribute('data-demo-submit') !== 'true') {
            return true;
        }

        event.preventDefault();
        usunKomunikat(formularz);

        var blad = sprawdzFormularz(formularz);
        if (blad !== '') {
            pokazKomunikat(formularz, blad, 'error');
            return false;
        }

        var nazwa = formularz.name.value;
        var gatunek = formularz.species.value;
        var status = formularz.status.value;

        var element = document.createElement('article');
        element.className = 'admin-item';
        element.innerHTML = '<div><h4>' + bezpiecznyTekst(nazwa) + '</h4><p><strong>Gatunek:</strong> ' + bezpiecznyTekst(gatunek) + '</p><p><strong>Status:</strong> ' + bezpiecznyTekst(status) + '</p></div><div class="card-buttons"><button type="button" class="btn btn-light small-btn">Edytuj</button><button type="button" class="btn btn-danger small-btn" data-delete-demo>Usuń</button></div>';

        lista.insertBefore(element, lista.firstChild);
        formularz.reset();
        pokazKomunikat(formularz, 'Ogłoszenie zostało dodane do listy.', 'success');
        return false;
    };

    lista.onclick = function (event) {
        var klikniety = event.target;

        if (klikniety.getAttribute('data-delete-demo') != null) {
            var element = klikniety.parentNode.parentNode;
            lista.removeChild(element);
        }
    };
}

function pokazHaslo() {
    var przyciski = document.querySelectorAll('[data-password-button]');

    for (var i = 0; i < przyciski.length; i++) {
        przyciski[i].onclick = function () {
            var idPola = this.getAttribute('data-password-button');
            var pole = document.querySelector(idPola);

            if (pole == null) {
                return;
            }

            if (pole.type === 'password') {
                pole.type = 'text';
                this.innerHTML = 'Ukryj';
            } else {
                pole.type = 'password';
                this.innerHTML = 'Pokaż';
            }
        };
    }
}

function bezpiecznyTekst(wartosc) {
    var div = document.createElement('div');
    div.innerText = wartosc;
    return div.innerHTML;
}

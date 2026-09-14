const dateArretCigarette = new Date('2026-08-17');

// Éléments Navigation
const navAccueil = document.getElementById('nav-accueil');
const navRecettes = document.getElementById('nav-recettes');
const navObjectifs = document.getElementById('nav-objectifs');

const ecranAccueil = document.getElementById('ecran-accueil');
const ecranRecettes = document.getElementById('ecran-recettes');
const ecranAjout = document.getElementById('ecran-ajout');
const ecranObjectifs = document.getElementById('ecran-objectifs');

// Éléments Accueil
const nomLiquideEl = document.getElementById('nom-liquide');
const detailsNicotineEl = document.getElementById('details-nicotine');
const detailsFlaconEl = document.getElementById('details-flacon');
const btnTerminer = document.getElementById('btn-terminer');
const btnOuvrirAjout = document.getElementById('btn-ouvrir-ajout');
const listeHistoriqueEl = document.getElementById('liste-historique');

// Éléments Formulaire Flacon
const formFlacon = document.getElementById('form-flacon');
const btnAnnuler = document.getElementById('btn-annuler');
const inputDateOuverture = document.getElementById('date-ouverture');
const selectRecette = document.getElementById('select-recette');

// Éléments Écran Recettes
const btnOuvrirAjoutRecette = document.getElementById('btn-ouvrir-ajout-recette');
const formRecette = document.getElementById('form-recette');
const btnAnnulerRecette = document.getElementById('btn-annuler-recette');
const listeRecettesEl = document.getElementById('liste-recettes');

// Éléments Écran Objectifs
const btnOuvrirAjoutObjectif = document.getElementById('btn-ouvrir-ajout-objectif');
const formObjectif = document.getElementById('form-objectif');
const btnAnnulerObjectif = document.getElementById('btn-annuler-objectif');
const listeObjectifsEl = document.getElementById('liste-objectifs');

// 1. Calcul des jours sans tabac
function calculerJoursSansTabac() {
    const aujourdhui = new Date();
    const differenceTemps = aujourdhui - dateArretCigarette;
    const jours = Math.floor(differenceTemps / (1000 * 3600 * 24));
    document.getElementById('compteur-jours').textContent = jours;
}

// 2. Gestion de la navigation
function basculerEcran(ecranAFFICHER) {
    [ecranAccueil, ecranRecettes, ecranAjout, ecranObjectifs].forEach(e => e.classList.add('masque'));
    ecranAFFICHER.classList.remove('masque');
}

navAccueil.addEventListener('click', () => {
    [navAccueil, navRecettes, navObjectifs].forEach(b => b.classList.remove('actif'));
    navAccueil.classList.add('actif');
    basculerEcran(ecranAccueil);
});

navRecettes.addEventListener('click', () => {
    [navAccueil, navRecettes, navObjectifs].forEach(b => b.classList.remove('actif'));
    navRecettes.classList.add('actif');
    basculerEcran(ecranRecettes);
    afficherRecettes();
});

navObjectifs.addEventListener('click', () => {
    [navAccueil, navRecettes, navObjectifs].forEach(b => b.classList.remove('actif'));
    navObjectifs.classList.add('actif');
    basculerEcran(ecranObjectifs);
    afficherObjectifs();
});

// 3. Affichage global
function afficherTout() {
    const flaconActif = JSON.parse(localStorage.getItem('flaconActif'));
    const historique = JSON.parse(localStorage.getItem('historiqueFlacons')) || [];

    if (flaconActif) {
        const dateDebut = new Date(flaconActif.dateOuverture);
        const dateFormatee = dateDebut.toLocaleDateString('fr-FR', {
            day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
        });

        nomLiquideEl.textContent = flaconActif.nom;
        detailsNicotineEl.textContent = `${flaconActif.nicotine} mg/ml ${flaconActif.type === 'DIY' ? `• DIY ${flaconActif.arome}%` : ''}`;
        detailsFlaconEl.textContent = `${flaconActif.volume} ml au départ • Entamé le ${dateFormatee}`;
        
        btnTerminer.style.display = 'block';
        btnOuvrirAjout.style.display = 'none';
    } else {
        nomLiquideEl.textContent = 'Aucun flacon actif';
        detailsNicotineEl.textContent = '';
        detailsFlaconEl.textContent = '';
        btnTerminer.style.display = 'none';
        btnOuvrirAjout.style.display = 'block';
    }

    if (historique.length === 0) {
        listeHistoriqueEl.innerHTML = '<p class="texte-vide">Aucun flacon terminé pour le moment.</p>';
    } else {
        listeHistoriqueEl.innerHTML = historique.map(item => `
            <div class="carte carte-historique">
                <strong>${item.nom}</strong> (${item.nicotine} mg/ml)
                <br>
                <span>Durée : ${item.dureeJours} jour(s) • Moyenne : <strong>${item.consommationMoyenne} ml/jour</strong></span>
            </div>
        `).join('');
    }
}

// 4. Gestion des Recettes
function afficherRecettes() {
    const recettes = JSON.parse(localStorage.getItem('recettesLiquides')) || [];

    if (recettes.length === 0) {
        listeRecettesEl.innerHTML = '<p class="texte-vide">Aucun liquide enregistré.</p>';
    } else {
        listeRecettesEl.innerHTML = recettes.map(r => `
            <div class="carte">
                <strong>${r.nom}</strong> — ${r.nicotine} mg/ml (${r.type}${r.arome ? ` ${r.arome}%` : ''})
            </div>
        `).join('');
    }

    selectRecette.innerHTML = '<option value="">-- Saisie libre --</option>' + 
        recettes.map(r => `<option value="${r.id}">${r.nom} (${r.nicotine} mg/ml)</option>`).join('');
}

btnOuvrirAjoutRecette.addEventListener('click', () => {
    formRecette.classList.remove('masque');
    btnOuvrirAjoutRecette.classList.add('masque');
});

btnAnnulerRecette.addEventListener('click', () => {
    formRecette.classList.add('masque');
    btnOuvrirAjoutRecette.classList.remove('masque');
});

formRecette.addEventListener('submit', (e) => {
    e.preventDefault();
    const recettes = JSON.parse(localStorage.getItem('recettesLiquides')) || [];

    const nouvelleRecette = {
        id: Date.now(),
        nom: document.getElementById('recette-nom').value,
        type: document.getElementById('recette-type').value,
        nicotine: parseFloat(document.getElementById('recette-nicotine').value),
        arome: document.getElementById('recette-arome').value ? parseFloat(document.getElementById('recette-arome').value) : null
    };

    recettes.push(nouvelleRecette);
    localStorage.setItem('recettesLiquides', JSON.stringify(recettes));

    formRecette.reset();
    formRecette.classList.add('masque');
    btnOuvrirAjoutRecette.classList.remove('masque');
    afficherRecettes();
});

selectRecette.addEventListener('change', () => {
    const recettes = JSON.parse(localStorage.getItem('recettesLiquides')) || [];
    const recetteTrouvee = recettes.find(r => r.id == selectRecette.value);

    if (recetteTrouvee) {
        document.getElementById('nom').value = recetteTrouvee.nom;
        document.getElementById('type').value = recetteTrouvee.type;
        document.getElementById('nicotine').value = recetteTrouvee.nicotine;
        document.getElementById('arome').value = recetteTrouvee.arome || '';
    }
});

// 5. Gestion des Objectifs
function afficherObjectifs() {
    let objectifs = JSON.parse(localStorage.getItem('objectifsVape'));

    // Objectifs par défaut si la liste est vide
    if (!objectifs || objectifs.length === 0) {
        objectifs = [
            { id: 1, date: '2026-08-17', titre: 'Arrêt de la cigarette 🚭' },
            { id: 2, date: '2026-09-21', titre: 'Objectif zéro tabac fumé ✨' },
            { id: 3, date: '2027-09-01', titre: 'Objectif 0 mg/ml nicotine 🎯' }
        ];
        localStorage.setItem('objectifsVape', JSON.stringify(objectifs));
    }

    // Tri par date
    objectifs.sort((a, b) => new Date(a.date) - new Date(b.date));

    listeObjectifsEl.innerHTML = objectifs.map(o => {
        const dateFmt = new Date(o.date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
        return `
            <div class="carte item-objectif">
                <div>
                    <strong>${dateFmt}</strong>
                    <div>${o.titre}</div>
                </div>
                <button class="btn-suppr" onclick="supprimerObjectif(${o.id})">✕</button>
            </div>
        `;
    }).join('');
}

window.supprimerObjectif = function(id) {
    let objectifs = JSON.parse(localStorage.getItem('objectifsVape')) || [];
    objectifs = objectifs.filter(o => o.id !== id);
    localStorage.setItem('objectifsVape', JSON.stringify(objectifs));
    afficherObjectifs();
};

btnOuvrirAjoutObjectif.addEventListener('click', () => {
    formObjectif.classList.remove('masque');
    btnOuvrirAjoutObjectif.classList.add('masque');
});

btnAnnulerObjectif.addEventListener('click', () => {
    formObjectif.classList.add('masque');
    btnOuvrirAjoutObjectif.classList.remove('masque');
});

formObjectif.addEventListener('submit', (e) => {
    e.preventDefault();
    const objectifs = JSON.parse(localStorage.getItem('objectifsVape')) || [];

    const nouvelObj = {
        id: Date.now(),
        date: document.getElementById('obj-date').value,
        titre: document.getElementById('obj-titre').value
    };

    objectifs.push(nouvelObj);
    localStorage.setItem('objectifsVape', JSON.stringify(objectifs));

    formObjectif.reset();
    formObjectif.classList.add('masque');
    btnOuvrirAjoutObjectif.classList.remove('masque');
    afficherObjectifs();
});

// 6. Actions Flacon
btnOuvrirAjout.addEventListener('click', () => {
    basculerEcran(ecranAjout);
    afficherRecettes();
    const maintenant = new Date();
    maintenant.setMinutes(maintenant.getMinutes() - maintenant.getTimezoneOffset());
    inputDateOuverture.value = maintenant.toISOString().slice(0, 16);
});

btnAnnuler.addEventListener('click', () => basculerEcran(ecranAccueil));

btnTerminer.addEventListener('click', () => {
    const flaconActif = JSON.parse(localStorage.getItem('flaconActif'));
    if (!flaconActif) return;

    const dateDebut = new Date(flaconActif.dateOuverture);
    const dateFin = new Date();
    const dureeJours = Math.max(0.1, (dateFin - dateDebut) / (1000 * 3600 * 24));
    const moyenneMlJour = (flaconActif.volume / dureeJours).toFixed(2);

    const flaconTermine = {
        ...flaconActif,
        dateFin: dateFin.toISOString(),
        dureeJours: dureeJours.toFixed(1),
        consommationMoyenne: moyenneMlJour
    };

    const historique = JSON.parse(localStorage.getItem('historiqueFlacons')) || [];
    historique.unshift(flaconTermine);
    localStorage.setItem('historiqueFlacons', JSON.stringify(historique));
    localStorage.removeItem('flaconActif');

    afficherTout();
});

formFlacon.addEventListener('submit', (e) => {
    e.preventDefault();
    const nouveauFlacon = {
        id: Date.now(),
        nom: document.getElementById('nom').value,
        type: document.getElementById('type').value,
        volume: parseFloat(document.getElementById('volume').value),
        nicotine: parseFloat(document.getElementById('nicotine').value),
        arome: document.getElementById('arome').value ? parseFloat(document.getElementById('arome').value) : null,
        dateOuverture: document.getElementById('date-ouverture').value
    };

    localStorage.setItem('flaconActif', JSON.stringify(nouveauFlacon));
    formFlacon.reset();
    basculerEcran(ecranAccueil);
    afficherTout();
});

// Initialisation
calculerJoursSansTabac();
afficherTout();

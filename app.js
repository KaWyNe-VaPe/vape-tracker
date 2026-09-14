const dateArretCigarette = new Date('2026-08-17');

// Navigation & Écrans
const navAccueil = document.getElementById('nav-accueil');
const navRecettes = document.getElementById('nav-recettes');
const navSante = document.getElementById('nav-sante');
const navFinances = document.getElementById('nav-finances');
const navObjectifs = document.getElementById('nav-objectifs');

const ecranAccueil = document.getElementById('ecran-accueil');
const ecranRecettes = document.getElementById('ecran-recettes');
const ecranSante = document.getElementById('ecran-sante');
const ecranFinances = document.getElementById('ecran-finances');
const ecranAjout = document.getElementById('ecran-ajout');
const ecranObjectifs = document.getElementById('ecran-objectifs');

// Éléments Formulaires
const formConfigTabac = document.getElementById('form-config-tabac');
const formDepense = document.getElementById('form-depense');
const btnOuvrirDepense = document.getElementById('btn-ouvrir-depense');
const btnAnnulerDepense = document.getElementById('btn-annuler-depense');

function getJoursEcoules() {
    const aujourdhui = new Date();
    const diff = aujourdhui - dateArretCigarette;
    return Math.max(0, Math.floor(diff / (1000 * 3600 * 24)));
}

function calculerJoursSansTabac() {
    document.getElementById('compteur-jours').textContent = getJoursEcoules();
}

// -------------------------------------------------------------
// CERISIER JAPONAIS HD & ÉVOLUTIF (IMAGES HD & PARTICULES)
// -------------------------------------------------------------
const imagesCerisierHD = {
    stade1: 'https://images.fineartamerica.com/images/artworkimages/mediumlarge/3/japanese-cherry-blossom-sprout-transparent-png.png',
    stade2: 'https://images.fineartamerica.com/images/artworkimages/mediumlarge/3/japanese-bonsai-tree-transparent-png.png',
    stade3: 'https://images.fineartamerica.com/images/artworkimages/mediumlarge/3/japanese-sakura-tree-branches-transparent-png.png',
    stade4: 'https://images.fineartamerica.com/images/artworkimages/mediumlarge/3/blooming-cherry-blossom-tree-transparent-png.png'
};

function mettreAJourCerisierHD() {
    const jours = getJoursEcoules();
    const badge = document.getElementById('nom-stade-arbre');
    const imgEl = document.getElementById('image-cerisier-hd');

    let nomStade = '';
    let urlHD = '';

    if (jours < 4) {
        nomStade = 'Stade 1 : Jeune pousse 🌿';
        urlHD = imagesCerisierHD.stade1;
    } else if (jours < 11) {
        nomStade = 'Stade 2 : Petit arbre 🪴';
        urlHD = imagesCerisierHD.stade2;
    } else if (jours < 21) {
        nomStade = 'Stade 3 : Branchement 🪵';
        urlHD = imagesCerisierHD.stade3;
    } else {
        nomStade = 'Stade 4 : Cerisier en floraison 🌸✨';
        urlHD = imagesCerisierHD.stade4;
    }

    if (imgEl) {
        imgEl.src = urlHD;
    }
    if (badge) {
        badge.textContent = nomStade;
    }

    genererParticules();
}

function genererParticules() {
    const conteneur = document.getElementById('particules');
    if (!conteneur) return;
    conteneur.innerHTML = '';

    for (let i = 0; i < 15; i++) {
        const petale = document.createElement('div');
        petale.className = 'petale-lumineux';
        
        const taille = Math.random() * 6 + 4;
        petale.style.width = `${taille}px`;
        petale.style.height = `${taille * 1.2}px`;
        
        petale.style.left = `${Math.random() * 100}%`;
        petale.style.animationDuration = `${Math.random() * 4 + 4}s`;
        petale.style.animationDelay = `${Math.random() * 5}s`;

        conteneur.appendChild(petale);
    }
}

// -------------------------------------------------------------
// NAVIGATION
// -------------------------------------------------------------
function basculerEcran(ecranAFFICHER) {
    [ecranAccueil, ecranRecettes, ecranSante, ecranFinances, ecranAjout, ecranObjectifs].forEach(e => e.classList.add('masque'));
    ecranAFFICHER.classList.remove('masque');
}

const navs = [
    { btn: navAccueil, ecran: ecranAccueil },
    { btn: navRecettes, ecran: ecranRecettes, action: () => afficherRecettes() },
    { btn: navSante, ecran: ecranSante, action: () => afficherSante() },
    { btn: navFinances, ecran: ecranFinances, action: () => afficherFinances() },
    { btn: navObjectifs, ecran: ecranObjectifs, action: () => afficherObjectifs() }
];

navs.forEach(item => {
    item.btn.addEventListener('click', () => {
        navs.forEach(n => n.btn.classList.remove('actif'));
        item.btn.classList.add('actif');
        basculerEcran(item.ecran);
        if (item.action) item.action();
    });
});

// -------------------------------------------------------------
// ÉCONOMIES
// -------------------------------------------------------------
function calculerEconomies() {
    const jours = getJoursEcoules();
    const config = JSON.parse(localStorage.getItem('configTabac')) || { cigsJour: 15, prixPaquet: 12.5, cigsPaquet: 20 };
    
    const coutParCig = config.prixPaquet / config.cigsPaquet;
    const tabacEvite = jours * config.cigsJour * coutParCig;

    const depenses = JSON.parse(localStorage.getItem('depensesVape')) || [];
    const totalDepenses = depenses.reduce((sum, d) => sum + d.montant, 0);

    const economieNette = tabacEvite - totalDepenses;

    document.getElementById('economie-accueil').textContent = `${economieNette.toFixed(2)} €`;
    document.getElementById('tabac-evite-total').textContent = `${tabacEvite.toFixed(2)} €`;
    document.getElementById('dépenses-vape-total').textContent = `${totalDepenses.toFixed(2)} €`;
    document.getElementById('economie-nette-detail').textContent = `${economieNette.toFixed(2)} €`;

    document.getElementById('cigs-jour').value = config.cigsJour;
    document.getElementById('prix-paquet').value = config.prixPaquet;
    document.getElementById('cigs-paquet').value = config.cigsPaquet;
}

formConfigTabac.addEventListener('submit', (e) => {
    e.preventDefault();
    const config = {
        cigsJour: parseFloat(document.getElementById('cigs-jour').value) || 0,
        prixPaquet: parseFloat(document.getElementById('prix-paquet').value) || 0,
        cigsPaquet: parseFloat(document.getElementById('cigs-paquet').value) || 20
    };
    localStorage.setItem('configTabac', JSON.stringify(config));
    calculerEconomies();
});

btnOuvrirDepense.addEventListener('click', () => formDepense.classList.remove('masque'));
btnAnnulerDepense.addEventListener('click', () => formDepense.classList.add('masque'));

formDepense.addEventListener('submit', (e) => {
    e.preventDefault();
    const depenses = JSON.parse(localStorage.getItem('depensesVape')) || [];
    const nouvelleDepense = {
        id: Date.now(),
        cat: document.getElementById('dep-cat').value,
        montant: parseFloat(document.getElementById('dep-montant').value),
        nom: document.getElementById('dep-nom').value || 'Achat Vape',
        date: new Date().toLocaleDateString('fr-FR')
    };
    depenses.unshift(nouvelleDepense);
    localStorage.setItem('depensesVape', JSON.stringify(depenses));
    formDepense.reset();
    formDepense.classList.add('masque');
    afficherFinances();
});

function afficherFinances() {
    calculerEconomies();
    const depenses = JSON.parse(localStorage.getItem('depensesVape')) || [];
    const listeEl = document.getElementById('liste-depenses');

    if (depenses.length === 0) {
        listeEl.innerHTML = '<p class="texte-vide">Aucune dépense enregistrée.</p>';
    } else {
        listeEl.innerHTML = depenses.map(d => `
            <div class="carte item-objectif">
                <div>
                    <strong>${d.nom}</strong> (${d.cat})
                    <br><span style="font-size: 0.8rem; color: #8b949e;">${d.date}</span>
                </div>
                <div>
                    <strong>-${d.montant.toFixed(2)} €</strong>
                    <button class="btn-suppr" onclick="supprimerDepense(${d.id})">✕</button>
                </div>
            </div>
        `).join('');
    }
}

window.supprimerDepense = function(id) {
    let depenses = JSON.parse(localStorage.getItem('depensesVape')) || [];
    depenses = depenses.filter(d => d.id !== id);
    localStorage.setItem('depensesVape', JSON.stringify(depenses));
    afficherFinances();
};

// -------------------------------------------------------------
// JALONS SANTÉ
// -------------------------------------------------------------
const jalonsSanteData = [
    { jours: 1, titre: '24 Heures', desc: 'Le monoxyde de carbone est totalement éliminé de l\'organisme.' },
    { jours: 2, titre: '48 Heures', desc: 'Le goût et l\'odorat s\'améliorent. Les terminaisons nerveuses se régénèrent.' },
    { jours: 14, titre: '2 Semaines', desc: 'La respiration devient plus aisée. Le souffle s\'améliore à l\'effort.' },
    { jours: 30, titre: '1 Mois', desc: 'La toux et l\'essoufflement diminuent. Vous regagnez en énergie générale.' },
    { jours: 90, titre: '3 Mois', desc: 'La fonction pulmonaire s\'améliore nettement. Circulation sanguine normalisée.' },
    { jours: 365, titre: '1 An', desc: 'Le risque de maladie cardiovasculaire est réduit de moitié par rapport à un fumeur.' }
];

function afficherSante() {
    const joursActuels = getJoursEcoules();
    const container = document.getElementById('timeline-sante');

    container.innerHTML = jalonsSanteData.map(j => {
        const atteint = joursActuels >= j.jours;
        return `
            <div class="carte jalon-sante ${atteint ? 'atteint' : ''}">
                <h4>${atteint ? '✅' : '⏳'} ${j.titre}</h4>
                <p>${j.desc}</p>
            </div>
        `;
    }).join('');
}

// -------------------------------------------------------------
// RECETTES & FLACONS (AFFICHER & GÉRER)
// -------------------------------------------------------------
function afficherTout() {
    const flaconActif = JSON.parse(localStorage.getItem('flaconActif'));
    const historique = JSON.parse(localStorage.getItem('historiqueFlacons')) || [];

    const nomLiquideEl = document.getElementById('nom-liquide');
    const detailsNicotineEl = document.getElementById('details-nicotine');
    const detailsFlaconEl = document.getElementById('details-flacon');
    const btnTerminer = document.getElementById('btn-terminer');
    const btnOuvrirAjout = document.getElementById('btn-ouvrir-ajout');
    const listeHistoriqueEl = document.getElementById('liste-historique');

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
                <span style="font-size:0.85rem; color:#8b949e;">Durée : ${item.dureeJours} jour(s) • Moyenne : <strong>${item.consommationMoyenne} ml/jour</strong></span>
            </div>
        `).join('');
    }
}

function afficherRecettes() {
    const recettes = JSON.parse(localStorage.getItem('recettesLiquides')) || [];
    const listeRecettesEl = document.getElementById('liste-recettes');
    const selectRecette = document.getElementById('select-recette');

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

// Initialisation
window.onload = function() {
    calculerJoursSansTabac();
    mettreAJourCerisierHD();
    calculerEconomies();
    afficherTout();
};

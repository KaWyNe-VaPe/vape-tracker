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

// Éléments Économies
const formConfigTabac = document.getElementById('form-config-tabac');
const formDepense = document.getElementById('form-depense');
const btnOuvrirDepense = document.getElementById('btn-ouvrir-depense');
const btnAnnulerDepense = document.getElementById('btn-annuler-depense');

// 1. Calcul du nombre de jours
function getJoursEcoules() {
    const aujourdhui = new Date();
    const diff = aujourdhui - dateArretCigarette;
    return Math.max(0, Math.floor(diff / (1000 * 3600 * 24)));
}

function calculerJoursSansTabac() {
    document.getElementById('compteur-jours').textContent = getJoursEcoules();
}

// 2. Cerisier SVG Interactif & Animé
function dessinerCerisier() {
    const jours = getJoursEcoules();
    const conteneur = document.getElementById('conteneur-arbre');
    const badge = document.getElementById('nom-stade-arbre');

    let svgContent = '';
    let nomStade = '';

    if (jours < 4) {
        nomStade = 'Stade 1 : Jeune pousse 🌿';
        svgContent = `
            <svg width="120" height="120" viewBox="0 0 100 100">
                <path d="M50 95 Q 50 75 50 65" stroke="#8d6e63" stroke-width="4" fill="none" />
                <path d="M50 65 Q 40 55 35 60 Q 45 70 50 65" fill="#81c784" />
                <path d="M50 65 Q 60 55 65 60 Q 55 70 50 65" fill="#a5d6a7" />
            </svg>`;
    } else if (jours < 11) {
        nomStade = 'Stade 2 : Petit tronc 🪴';
        svgContent = `
            <svg width="130" height="130" viewBox="0 0 100 100">
                <g class="vent-branches">
                    <path d="M50 95 Q 48 60 50 45" stroke="#6d4c41" stroke-width="6" stroke-linecap="round" fill="none" />
                    <path d="M50 55 Q 35 45 30 48" stroke="#6d4c41" stroke-width="3" fill="none" />
                    <circle cx="30" cy="48" r="6" fill="#81c784" />
                    <circle cx="50" cy="40" r="8" fill="#a5d6a7" />
                </g>
            </svg>`;
    } else if (jours < 21) {
        nomStade = 'Stade 3 : Branches & Feuillage 🌿';
        svgContent = `
            <svg width="140" height="140" viewBox="0 0 100 100">
                <g class="vent-branches">
                    <path d="M50 95 Q 47 50 50 30" stroke="#5d4037" stroke-width="8" stroke-linecap="round" fill="none" />
                    <path d="M50 60 Q 30 45 20 48" stroke="#5d4037" stroke-width="4" fill="none" />
                    <path d="M50 50 Q 70 35 75 40" stroke="#5d4037" stroke-width="4" fill="none" />
                    <circle cx="20" cy="48" r="10" fill="#66bb6a" />
                    <circle cx="75" cy="40" r="12" fill="#81c784" />
                    <circle cx="50" cy="25" r="14" fill="#a5d6a7" />
                </g>
            </svg>`;
    } else if (jours < 36) {
        nomStade = 'Stade 4 : Premiers bourgeons 🌺';
        svgContent = `
            <svg width="150" height="150" viewBox="0 0 100 100">
                <g class="vent-branches">
                    <path d="M50 95 Q 45 50 50 25" stroke="#4e342e" stroke-width="9" stroke-linecap="round" fill="none" />
                    <path d="M50 65 Q 25 50 15 55" stroke="#4e342e" stroke-width="4" fill="none" />
                    <path d="M50 45 Q 75 30 80 35" stroke="#4e342e" stroke-width="4" fill="none" />
                    <circle cx="15" cy="55" r="12" fill="#81c784" />
                    <circle cx="80" cy="35" r="14" fill="#a5d6a7" />
                    <circle cx="50" cy="20" r="16" fill="#81c784" />
                    <!-- Bourgeons -->
                    <circle cx="20" cy="50" r="4" fill="#ff80ab" />
                    <circle cx="75" cy="30" r="4" fill="#ff4081" />
                    <circle cx="45" cy="15" r="5" fill="#ff80ab" />
                </g>
            </svg>`;
    } else if (jours < 61) {
        nomStade = 'Stade 5 : Premières fleurs 🌸';
        svgContent = `
            <svg width="160" height="160" viewBox="0 0 100 100">
                <g class="vent-branches">
                    <path d="M50 95 Q 45 50 50 20" stroke="#3e2723" stroke-width="10" stroke-linecap="round" fill="none" />
                    <path d="M50 65 Q 20 45 10 50" stroke="#3e2723" stroke-width="5" fill="none" />
                    <path d="M50 45 Q 80 25 85 30" stroke="#3e2723" stroke-width="5" fill="none" />
                    <!-- Feuillage & Fleurs -->
                    <circle cx="10" cy="50" r="14" fill="#ff80ab" opacity="0.8" />
                    <circle cx="85" cy="30" r="16" fill="#ffb7c5" opacity="0.9" />
                    <circle cx="50" cy="15" r="20" fill="#ff80ab" opacity="0.85" />
                    <circle cx="30" cy="30" r="12" fill="#ffcdd2" />
                    <!-- Pétale volant -->
                    <circle class="petale" cx="70" cy="40" r="3" fill="#ff4081" />
                </g>
            </svg>`;
    } else {
        nomStade = 'Stade 6 : Cerisier en pleine floraison 🌸✨';
        svgContent = `
            <svg width="160" height="160" viewBox="0 0 100 100">
                <g class="vent-branches">
                    <path d="M50 95 Q 45 50 50 20" stroke="#3e2723" stroke-width="10" stroke-linecap="round" fill="none" />
                    <path d="M50 65 Q 20 45 10 50" stroke="#3e2723" stroke-width="5" fill="none" />
                    <path d="M50 45 Q 80 25 85 30" stroke="#3e2723" stroke-width="5" fill="none" />
                    <!-- Grosse frondaison rose -->
                    <circle cx="50" cy="20" r="25" fill="#ffb7c5" />
                    <circle cx="20" cy="40" r="20" fill="#ff80ab" />
                    <circle cx="80" cy="30" r="22" fill="#ffcdd2" />
                    <circle cx="35" cy="25" r="18" fill="#f8bbd0" />
                    <circle cx="65" cy="20" r="19" fill="#ff4081" opacity="0.7" />
                    <!-- Pétales volants -->
                    <circle class="petale" cx="60" cy="30" r="3.5" fill="#ff4081" />
                    <circle class="petale" cx="40" cy="45" r="2.5" fill="#ff80ab" style="animation-delay: 2s;" />
                </g>
            </svg>`;
    }

    conteneur.innerHTML = svgContent;
    badge.textContent = nomStade;
}

// 3. Navigation
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

// 4. Calcul & Gestion Économies
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

    // Pré-remplir le formulaire budget
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
                    <br><span style="font-size: 0.8rem; color: #7f8c8d;">${d.date}</span>
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

// 5. Jalons Santé (Sources SPF / OMS)
const jalonsSanteData = [
    { jours: 1, titre: '24 Heures', desc: 'Le monoxyde de carbone est totalement éliminé de l\'organisme. Les poumons commencent à éliminer les résidus de fumée.' },
    { jours: 2, titre: '48 Heures', desc: 'Le goût et l\'odorat s\'améliorent nettement. Les terminaisons nerveuses gustatives commencent à se régénérer.' },
    { jours: 14, titre: '2 Semaines', desc: 'La respiration devient plus aisée. Le souffle s\'améliore lors des efforts physiques.' },
    { jours: 30, titre: '1 Mois', desc: 'La toux et l\'essoufflement diminuent. Vous regagnez en énergie générale au quotidien.' },
    { jours: 90, titre: '3 Mois', desc: 'La fonction pulmonaire continue de s\'améliorer nettement. La circulation sanguine générale s\'est normalisée.' },
    { jours: 365, titre: '1 An', desc: 'Le risque de maladie cardiovasculaire (AVC, infarctus) est réduit de moitié par rapport à un fumeur.' }
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

// Initialisation globale
function init() {
    calculerJoursSansTabac();
    dessinerCerisier();
    calculerEconomies();
}

init();

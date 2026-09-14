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

// Formulaires
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
// TABLEAU VECTORIEL JAPONAIS (LUNE, RIVIÈRE, CERISIER)
// -------------------------------------------------------------
function mettreAJourCerisierHD() {
    const jours = getJoursEcoules();
    const badge = document.getElementById('nom-stade-arbre');
    const conteneur = document.getElementById('conteneur-svg-arbre');

    let nomStade = '';
    let niveauFleurs = 0;

    if (jours < 4) {
        nomStade = 'Stade 1 : Jeune pousse 🌿';
        niveauFleurs = 1;
    } else if (jours < 11) {
        nomStade = 'Stade 2 : Petit arbre 🪴';
        niveauFleurs = 2;
    } else if (jours < 21) {
        nomStade = 'Stade 3 : Branchement 🪵';
        niveauFleurs = 3;
    } else if (jours < 36) {
        nomStade = 'Stade 4 : Premiers bourgeons 🌸';
        niveauFleurs = 4;
    } else {
        nomStade = 'Stade 5 : Cerisier en pleine floraison 🌸✨';
        niveauFleurs = 5;
    }

    const svgTableau = `
        <svg viewBox="0 0 300 270" preserveAspectRatio="xMidYMid slice">
            <defs>
                <linearGradient id="ciel" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#0b0e14"/>
                    <stop offset="70%" stop-color="#1a2332"/>
                    <stop offset="100%" stop-color="#0f172a"/>
                </linearGradient>

                <linearGradient id="eau" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stop-color="#0f2b46"/>
                    <stop offset="50%" stop-color="#1d4ed8"/>
                    <stop offset="100%" stop-color="#0f2b46"/>
                </linearGradient>

                <radialGradient id="lune" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stop-color="#fffbeb"/>
                    <stop offset="40%" stop-color="#fef08a"/>
                    <stop offset="100%" stop-color="transparent"/>
                </radialGradient>

                <linearGradient id="ecorce" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stop-color="#1c110a"/>
                    <stop offset="50%" stop-color="#42281d"/>
                    <stop offset="100%" stop-color="#120b07"/>
                </linearGradient>
            </defs>

            <!-- Ciel Bleu Nuit -->
            <rect width="300" height="270" fill="url(#ciel)"/>

            <!-- Lune éclatante -->
            <circle cx="230" cy="55" r="35" fill="url(#lune)" opacity="0.85"/>

            <!-- Montagnes au loin -->
            <path d="M0 210 Q60 170 130 195 T300 200 L300 270 L0 270 Z" fill="#111827" opacity="0.7"/>

            <!-- Rivière sinueuse au pied -->
            <path d="M0 220 C80 215 150 240 300 225 L300 270 L0 270 Z" fill="url(#eau)"/>
            <path d="M20 235 Q70 230 120 240" stroke="#ffb7c5" stroke-width="1" opacity="0.4" fill="none"/>
            <path d="M140 245 Q200 235 270 250" stroke="#93c5fd" stroke-width="1.5" opacity="0.3" fill="none"/>

            <!-- Rive sombre -->
            <path d="M0 240 C90 230 140 255 300 245 L300 270 L0 270 Z" fill="#090d16"/>

            <!-- Cerisier Japonais -->
            <g class="vent-branches">
                <path d="M145 250 C120 180 170 120 130 50" stroke="url(#ecorce)" stroke-width="16" stroke-linecap="round" fill="none"/>
                <path d="M138 160 C85 130 65 110 35 100" stroke="url(#ecorce)" stroke-width="8" stroke-linecap="round" fill="none"/>
                <path d="M142 110 C185 85 205 75 235 60" stroke="url(#ecorce)" stroke-width="7" stroke-linecap="round" fill="none"/>
                <path d="M133 75 C100 55 85 45 65 35" stroke="url(#ecorce)" stroke-width="5" stroke-linecap="round" fill="none"/>

                ${niveauFleurs >= 1 ? `
                    <circle cx="65" cy="35" r="12" fill="#34d399" opacity="0.7"/>
                ` : ''}

                ${niveauFleurs >= 2 ? `
                    <circle cx="35" cy="100" r="18" fill="#10b981" opacity="0.7"/>
                    <circle cx="235" cy="60" r="20" fill="#34d399" opacity="0.7"/>
                ` : ''}

                ${niveauFleurs >= 3 ? `
                    <circle cx="130" cy="50" r="30" fill="#059669" opacity="0.6"/>
                ` : ''}

                ${niveauFleurs >= 4 ? `
                    <circle cx="130" cy="50" r="38" fill="#f472b6" opacity="0.75"/>
                    <circle cx="35" cy="100" r="28" fill="#fb7185" opacity="0.8"/>
                    <circle cx="235" cy="60" r="32" fill="#f472b6" opacity="0.75"/>
                    <circle cx="65" cy="35" r="22" fill="#f43f5e" opacity="0.7"/>
                ` : ''}

                ${niveauFleurs >= 5 ? `
                    <circle cx="130" cy="45" r="48" fill="#ffb7c5" opacity="0.85"/>
                    <circle cx="35" cy="95" r="35" fill="#ff80ab" opacity="0.85"/>
                    <circle cx="235" cy="55" r="38" fill="#ffcdd2" opacity="0.85"/>
                    <circle cx="65" cy="30" r="28" fill="#ff4081" opacity="0.8"/>
                    <circle cx="130" cy="45" r="15" fill="#ffffff" opacity="0.6"/>
                    <circle cx="235" cy="55" r="10" fill="#ffffff" opacity="0.6"/>
                ` : ''}
            </g>
        </svg>
    `;

    if (conteneur) conteneur.innerHTML = svgTableau;
    if (badge) badge.textContent = nomStade;

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
// RECETTES & FLACONS
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

// Initialisation au chargement
window.addEventListener('DOMContentLoaded', function() {
    calculerJoursSansTabac();
    mettreAJourCerisierHD();
    calculerEconomies();
    afficherTout();
});

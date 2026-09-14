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
// CERISIER JAPONAIS CANVARS (GÉNÉRATION ORGANIQUE & ANIMÉE)
// -------------------------------------------------------------
let canvas, ctx;
let angleVent = 0;
let petales = [];

function initPetales() {
    petales = [];
    for (let i = 0; i < 25; i++) {
        petales.push({
            x: Math.random() * 360,
            y: Math.random() * 260,
            r: Math.random() * 3 + 1.5,
            vx: -Math.random() * 1.2 - 0.5,
            vy: Math.random() * 1.5 + 0.5,
            alpha: Math.random() * 0.7 + 0.3
        });
    }
}

function dessinerBranche(x, y, longueur, angle, epaisseur, profondeur, niveauMax) {
    ctx.save();
    ctx.beginPath();
    ctx.translate(x, y);
    
    // Effet du vent sur l'angle de la branche
    const courbureVent = Math.sin(angleVent + profondeur) * 0.03;
    ctx.rotate(angle + courbureVent);

    // Couleur du tronc et des branches (bois sombre)
    ctx.strokeStyle = '#2b1e1a';
    ctx.lineWidth = epaisseur;
    ctx.lineCap = 'round';

    ctx.moveTo(0, 0);
    ctx.lineTo(0, -longueur);
    ctx.stroke();

    if (profondeur < niveauMax) {
        // Sous-branches
        dessinerBranche(0, -longueur, longueur * 0.75, 0.45, epaisseur * 0.65, profondeur + 1, niveauMax);
        dessinerBranche(0, -longueur, longueur * 0.75, -0.45, epaisseur * 0.65, profondeur + 1, niveauMax);
    } else {
        // Fleurs de Cerisier au bout des branches
        const tailleFleur = Math.random() * 3 + 4;
        ctx.fillStyle = '#ffb7c5';
        ctx.beginPath();
        ctx.arc(0, -longueur, tailleFleur, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(0, -longueur, tailleFleur * 0.4, 0, Math.PI * 2);
        ctx.fill();
    }

    ctx.restore();
}

function animerCerisier() {
    if (!canvas || !ctx) return;

    const jours = getJoursEcoules();
    const badge = document.getElementById('nom-stade-arbre');

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Lune en arrière-plan (Estampe japonaise)
    ctx.fillStyle = 'rgba(255, 235, 205, 0.08)';
    ctx.beginPath();
    ctx.arc(280, 70, 45, 0, Math.PI * 2);
    ctx.fill();

    // Sol / Colline
    ctx.fillStyle = '#161b22';
    ctx.beginPath();
    ctx.ellipse(180, 270, 200, 30, 0, 0, Math.PI * 2);
    ctx.fill();

    // Détermination de la maturité
    let niveauMax = 1;
    let nomStade = '';

    if (jours < 4) {
        niveauMax = 2; nomStade = 'Stade 1 : Jeune pousse 🌿';
    } else if (jours < 11) {
        niveauMax = 3; nomStade = 'Stade 2 : Petit arbre 🪴';
    } else if (jours < 21) {
        niveauMax = 4; nomStade = 'Stade 3 : Branchement 🪵';
    } else if (jours < 36) {
        niveauMax = 5; nomStade = 'Stade 4 : Premiers bourgeons 🌺';
    } else if (jours < 61) {
        niveauMax = 6; nomStade = 'Stade 5 : Premières fleurs 🌸';
    } else {
        niveauMax = 7; nomStade = 'Stade 6 : Cerisier majestueux 🌸✨';
    }

    badge.textContent = nomStade;

    // Dessin de l'arbre
    dessinerBranche(180, 250, 48, 0, 10, 1, niveauMax);

    // Animation du vent
    angleVent += 0.02;

    // Animation des pétales volants dans le vent
    if (niveauMax >= 5) {
        petales.forEach(p => {
            ctx.fillStyle = `rgba(255, 183, 197, ${p.alpha})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fill();

            p.x += p.vx + Math.sin(angleVent) * 0.5;
            p.y += p.vy;

            // Réinitialisation des pétales sortis
            if (p.x < 0 || p.y > 260) {
                p.x = Math.random() * 360 + 50;
                p.y = -10;
            }
        });
    }

    requestAnimationFrame(animerCerisier);
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

// Initialisation au chargement
window.onload = function() {
    canvas = document.getElementById('canvas-cerisier');
    if (canvas) {
        ctx = canvas.getContext('2d');
        initPetales();
        animerCerisier();
    }
    calculerJoursSansTabac();
    calculerEconomies();
    afficherTout();
};

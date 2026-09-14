// NAVIGATION & ÉCRANS
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
const ecranOnboarding = document.getElementById('ecran-onboarding');

const enteteApp = document.getElementById('entete-app');
const contenuPrincipal = document.getElementById('contenu-principal');

// -------------------------------------------------------------
// SYSTÈME DE NOTIFICATIONS INTERNES PWA
// -------------------------------------------------------------
function envoyerNotification(titre, message) {
    if ('Notification' in window && Notification.permission === 'granted') {
        if (navigator.serviceWorker && navigator.serviceWorker.ready) {
            navigator.serviceWorker.ready.then(registration => {
                registration.showNotification(titre, {
                    body: message,
                    icon: 'icon.png',
                    badge: 'icon.png'
                });
            });
        } else {
            new Notification(titre, { body: message, icon: 'icon.png' });
        }
    }
}

function verifierEtEnvoyerNotifications() {
    if (!('Notification' in window) || Notification.permission !== 'granted') return;

    const profil = getProfilUtilisateur();
    if (!profil) return;

    const jours = getJoursEcoules();
    const prenom = profil.prenom || '';
    const maintenant = Date.now();

    // 1. Notification Quotidienne d'encouragement
    const derniereNotifJour = localStorage.getItem('notif_derniere_date') || 0;
    if (maintenant - derniereNotifJour > 20 * 3600 * 1000 && jours > 0) {
        const messagesPensees = [
            `Chaque jour sans tabac fait s'épanouir ton cerisier 🌸 Continue comme ça ${prenom} !`,
            `Bravo ${prenom} ! Tu en es à ${jours} jours sans cigarette ⛩️ Tes poumons te remercient.`,
            `Une nouvelle journée de liberté 💨 Courage ${prenom}, tu gères parfaitement !`
        ];
        const msgChoisi = messagesPensees[Math.floor(Math.random() * messagesPensees.length)];
        envoyerNotification('Vape Tracker 🌸', msgChoisi);
        localStorage.setItem('notif_derniere_date', maintenant);
    }

    // 2. Notification de Jalon Santé
    const jalonsAtteints = JSON.parse(localStorage.getItem('notif_jalons_atteints')) || [];
    jalonsSanteData.forEach(j => {
        if (jours >= j.jours && !jalonsAtteints.includes(j.jours)) {
            envoyerNotification(`Jalon Santé Débloqué ! 🫁`, `Bravo ${prenom} : ${j.titre} sans tabac (${j.desc}) !`);
            jalonsAtteints.push(j.jours);
        }
    });
    localStorage.setItem('notif_jalons_atteints', JSON.stringify(jalonsAtteints));

    // 3. Notification tous les 100 € économisés
    const config = JSON.parse(localStorage.getItem('configTabac')) || { cigsJour: 15, prixPaquet: 12.5, cigsPaquet: 20 };
    const coutParCig = config.prixPaquet / config.cigsPaquet;
    const tabacEvite = jours * config.cigsJour * coutParCig;
    const depenses = JSON.parse(localStorage.getItem('depensesVape')) || [];
    const totalDepenses = depenses.reduce((sum, d) => sum + (parseFloat(d.montant) || 0), 0);
    const economieNette = tabacEvite - totalDepenses;

    const centaineActuelle = Math.floor(economieNette / 100) * 100;
    const derniereCentaine = parseInt(localStorage.getItem('notif_centaine_dépasse')) || 0;

    if (centaineActuelle >= 100 && centaineActuelle > derniereCentaine) {
        envoyerNotification(`Cap des ${centaineActuelle} € franchi ! 💰`, `Félicitations ${prenom} ! Tu as atteint ${centaineActuelle} € d'économie nette ! 🎉`);
        localStorage.setItem('notif_centaine_dépasse', centaineActuelle);
    }
}

function initialiserBoutonNotif() {
    const btn = document.getElementById('btn-notifications');
    if (!btn) return;

    if (!('Notification' in window)) {
        btn.style.display = 'none';
        return;
    }

    if (Notification.permission === 'granted') {
        btn.textContent = '🔔 Notifications activées';
        btn.disabled = true;
    }

    btn.addEventListener('click', async () => {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
            btn.textContent = '🔔 Notifications activées';
            btn.disabled = true;
            envoyerNotification('Vape Tracker 🌸', 'Les notifications sont activées ! Tu recevras tes encouragements et jalons.');
            verifierEtEnvoyerNotifications();
        } else {
            alert('Les notifications ont été bloquées dans les paramètres de ton navigateur.');
        }
    });
}

// -------------------------------------------------------------
// PROFILE & CALCULS DYNAMIQUES
// -------------------------------------------------------------
function getProfilUtilisateur() {
    return JSON.parse(localStorage.getItem('profilUtilisateur'));
}

function getJoursEcoules() {
    const profil = getProfilUtilisateur();
    if (!profil || !profil.dateArret) return 0;
    
    const dateArret = new Date(profil.dateArret);
    const aujourdhui = new Date();
    const diff = aujourdhui - dateArret;
    return Math.max(0, Math.floor(diff / (1000 * 3600 * 24)));
}

const jalonsSanteData = [
    { jours: 1, titre: '24 Heures', desc: 'Monoxyde éliminé' },
    { jours: 2, titre: '48 Heures', desc: 'Goût et odorat' },
    { jours: 14, titre: '2 Semaines', desc: 'Souffle amélioré' },
    { jours: 30, titre: '1 Mois', desc: 'Toux diminuée' },
    { jours: 90, titre: '3 Mois', desc: 'Fonction pulmonaire' },
    { jours: 365, titre: '1 An', desc: 'Risque cardiaque /2' }
];

function mettreAJourCartesDashboard() {
    const profil = getProfilUtilisateur();
    const jours = getJoursEcoules();
    const config = JSON.parse(localStorage.getItem('configTabac')) || { cigsJour: 15, prixPaquet: 12.5, cigsPaquet: 20 };

    // 1. Carte Jours
    const cardJoursEl = document.getElementById('card-jours');
    const prenomEl = document.getElementById('prenom-accueil');
    if (cardJoursEl) cardJoursEl.textContent = jours;
    if (prenomEl && profil && profil.prenom) prenomEl.textContent = `bravo ${profil.prenom} !`;

    // 2. Carte Cigarettes évitées
    const cigsEvitees = Math.floor(jours * config.cigsJour);
    const cardCigsEl = document.getElementById('card-cigs');
    if (cardCigsEl) cardCigsEl.textContent = cigsEvitees.toLocaleString('fr-FR');

    // 3. Calculs financiers
    const coutParCig = config.prixPaquet / config.cigsPaquet;
    const tabacEvite = jours * config.cigsJour * coutParCig;

    const depenses = JSON.parse(localStorage.getItem('depensesVape')) || [];
    const totalDepenses = depenses.reduce((sum, d) => sum + (parseFloat(d.montant) || 0), 0);

    const economieNette = tabacEvite - totalDepenses;

    const cardEconEl = document.getElementById('card-economies');
    if (cardEconEl) cardEconEl.textContent = `${economieNette.toFixed(2)} €`;

    const tabacEviteEl = document.getElementById('tabac-evite-total');
    const depensesVapeEl = document.getElementById('dépenses-vape-total');
    const economieDetailEl = document.getElementById('economie-nette-detail');

    if (tabacEviteEl) tabacEviteEl.textContent = `${tabacEvite.toFixed(2)} €`;
    if (depensesVapeEl) depensesVapeEl.textContent = `${totalDepenses.toFixed(2)} €`;
    if (economieDetailEl) economieDetailEl.textContent = `${economieNette.toFixed(2)} €`;

    const inputCigs = document.getElementById('cigs-jour');
    const inputPrix = document.getElementById('prix-paquet');
    const inputCigsPaquet = document.getElementById('cigs-paquet');
    if (inputCigs) inputCigs.value = config.cigsJour;
    if (inputPrix) inputPrix.value = config.prixPaquet;
    if (inputCigsPaquet) inputCigsPaquet.value = config.cigsPaquet;

    // 4. Carte Prochain Jalon Santé
    const prochainJalon = jalonsSanteData.find(j => j.jours > jours) || jalonsSanteData[jalonsSanteData.length - 1];
    const jalonTitreEl = document.getElementById('card-jalon-titre');
    const jalonDescEl = document.getElementById('card-jalon-desc');

    if (jalonTitreEl) jalonTitreEl.textContent = prochainJalon.titre;
    if (jalonDescEl) jalonDescEl.textContent = prochainJalon.desc;

    verifierEtEnvoyerNotifications();
}

// -------------------------------------------------------------
// GESTION DU CERISIER (AFFICHAGE DES IMAGES PNG ET SEUILS EN JOURS)
// -------------------------------------------------------------
function mettreAJourCerisierHD() {
    const jours = getJoursEcoules();
    const badge = document.getElementById('nom-stade-arbre');
    const conteneur = document.getElementById('conteneur-svg-arbre');

    let nomStade = '';
    let numStade = 1;

    // --- NOUVEAUX SEUILS EN JOURS ---
    if (jours <= 30) {
        // Stade 1 : 0 à 30 jours (1er mois)
        nomStade = 'Stade 1 : Jeune pousse (0 à 1 mois) 🌿';
        numStade = 1;
    } else if (jours <= 90) {
        // Stade 2 : 31 à 90 jours (1 à 3 mois)
        nomStade = 'Stade 2 : Petit arbuste (1 à 3 mois) 🪴';
        numStade = 2;
    } else if (jours <= 150) {
        // Stade 3 : 91 à 150 jours (3 à 5 mois)
        nomStade = 'Stade 3 : Arbre vigoureux (3 à 5 mois) 🪵';
        numStade = 3;
    } else if (jours <= 240) {
        // Stade 4 : 151 à 240 jours (5 à 8 mois)
        nomStade = 'Stade 4 : Premiers bourgeons (5 à 8 mois) 🌸';
        numStade = 4;
    } else {
        // Stade 5 : À partir de 241 jours (8 mois à 1 an+)
        nomStade = 'Stade 5 : Cerisier majestueux (8 mois à 1 an+) 🌸✨';
        numStade = 5;
    }

    if (badge) badge.textContent = nomStade;

    // Tentative de chargement de la vraie peinture d'art PNG
    const nomFichierImage = `arbre-stade-${numStade}.png`;
    const imgArt = new Image();
    imgArt.src = nomFichierImage;

    imgArt.onload = function() {
        // Si l'image existe sur GitHub, on l'affiche avec son cadre d'art
        if (conteneur) {
            conteneur.innerHTML = `
                <img src="${nomFichierImage}?v=${Date.now()}" alt="${nomStade}" 
                     style="width: 100%; height: 100%; object-fit: cover; border-radius: 16px; animation: fonduImage 0.8s ease;">
            `;
        }
    };

    imgArt.onerror = function() {
        // Si l'image PNG n'est pas encore téléversée sur GitHub, on conserve le dessin vectoriel de secours
        afficherVectorielSecours(conteneur, numStade);
    };

    genererParticules();
}

// Dessin de secours vectoriel en l'absence de PNG
function afficherVectorielSecours(conteneur, niveauFleurs) {
    if (!conteneur) return;
    conteneur.innerHTML = `
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

            <rect width="300" height="270" fill="url(#ciel)"/>
            <circle cx="230" cy="55" r="35" fill="url(#lune)" opacity="0.85"/>
            <path d="M0 210 Q60 170 130 195 T300 200 L300 270 L0 270 Z" fill="#111827" opacity="0.7"/>
            <path d="M0 220 C80 215 150 240 300 225 L300 270 L0 270 Z" fill="url(#eau)"/>
            <path d="M20 235 Q70 230 120 240" stroke="#ffb7c5" stroke-width="1" opacity="0.4" fill="none"/>
            <path d="M140 245 Q200 235 270 250" stroke="#93c5fd" stroke-width="1.5" opacity="0.3" fill="none"/>
            <path d="M0 240 C90 230 140 255 300 245 L300 270 L0 270 Z" fill="#090d16"/>

            <g class="vent-branches">
                <path d="M145 250 C120 180 170 120 130 50" stroke="url(#ecorce)" stroke-width="16" stroke-linecap="round" fill="none"/>
                <path d="M138 160 C85 130 65 110 35 100" stroke="url(#ecorce)" stroke-width="8" stroke-linecap="round" fill="none"/>
                <path d="M142 110 C185 85 205 75 235 60" stroke="url(#ecorce)" stroke-width="7" stroke-linecap="round" fill="none"/>
                <path d="M133 75 C100 55 85 45 65 35" stroke="url(#ecorce)" stroke-width="5" stroke-linecap="round" fill="none"/>

                ${niveauFleurs >= 1 ? `<circle cx="65" cy="35" r="12" fill="#34d399" opacity="0.7"/>` : ''}
                ${niveauFleurs >= 2 ? `
                    <circle cx="35" cy="100" r="18" fill="#10b981" opacity="0.7"/>
                    <circle cx="235" cy="60" r="20" fill="#34d399" opacity="0.7"/>
                ` : ''}
                ${niveauFleurs >= 3 ? `<circle cx="130" cy="50" r="30" fill="#059669" opacity="0.6"/>` : ''}
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
    { btn: navAccueil, ecran: ecranAccueil, action: () => mettreAJourCartesDashboard() },
    { btn: navRecettes, ecran: ecranRecettes, action: () => afficherRecettes() },
    { btn: navSante, ecran: ecranSante, action: () => afficherSante() },
    { btn: navFinances, ecran: ecranFinances, action: () => afficherFinances() },
    { btn: navObjectifs, ecran: ecranObjectifs, action: () => afficherObjectifs() }
];

navs.forEach(item => {
    if (item.btn) {
        item.btn.addEventListener('click', () => {
            navs.forEach(n => n.btn.classList.remove('actif'));
            item.btn.classList.add('actif');
            basculerEcran(item.ecran);
            if (item.action) item.action();
        });
    }
});

// -------------------------------------------------------------
// AFFICHAGES & GESTION DES LISTES
// -------------------------------------------------------------
function afficherRecettes() {
    const recettes = JSON.parse(localStorage.getItem('recettesLiquides')) || [];
    const listeRecettesEl = document.getElementById('liste-recettes');
    const selectRecette = document.getElementById('select-recette');

    if (recettes.length === 0) {
        listeRecettesEl.innerHTML = '<p class="texte-vide">Aucun liquide enregistré.</p>';
    } else {
        listeRecettesEl.innerHTML = recettes.map(r => `
            <div class="carte item-objectif">
                <div>
                    <strong>${r.nom}</strong> — ${r.nicotine} mg/ml 
                    <br><span style="font-size: 0.85rem; color: #8b949e;">Type: ${r.type} ${r.arome ? `• Arôme: ${r.arome}%` : ''}</span>
                </div>
                <button class="btn-suppr" onclick="supprimerRecette(${r.id})">✕</button>
            </div>
        `).join('');
    }

    if (selectRecette) {
        selectRecette.innerHTML = '<option value="">-- Saisie libre --</option>' + 
            recettes.map(r => `<option value="${r.id}">${r.nom} (${r.nicotine} mg/ml)</option>`).join('');
    }
}

window.supprimerRecette = function(id) {
    let recettes = JSON.parse(localStorage.getItem('recettesLiquides')) || [];
    recettes = recettes.filter(r => r.id !== id);
    localStorage.setItem('recettesLiquides', JSON.stringify(recettes));
    afficherRecettes();
};

function afficherFinances() {
    mettreAJourCartesDashboard();
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
                    <strong>-${parseFloat(d.montant).toFixed(2)} €</strong>
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

function afficherSante() {
    const joursActuels = getJoursEcoules();
    const container = document.getElementById('timeline-sante');
    if (!container) return;

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

function afficherObjectifs() {
    const objectifs = JSON.parse(localStorage.getItem('objectifsVape')) || [];
    const container = document.getElementById('liste-objectifs');
    if (!container) return;

    if (objectifs.length === 0) {
        container.innerHTML = '<p class="texte-vide">Aucune étape enregistrée.</p>';
    } else {
        container.innerHTML = objectifs.map(o => `
            <div class="carte item-objectif">
                <div>
                    <strong>${o.titre}</strong>
                    <br><span style="font-size:0.8rem; color:#8b949e;">Date : ${new Date(o.date).toLocaleDateString('fr-FR')}</span>
                </div>
                <button class="btn-suppr" onclick="supprimerObjectif(${o.id})">✕</button>
            </div>
        `).join('');
    }
}

window.supprimerObjectif = function(id) {
    let objectifs = JSON.parse(localStorage.getItem('objectifsVape')) || [];
    objectifs = objectifs.filter(o => o.id !== id);
    localStorage.setItem('objectifsVape', JSON.stringify(objectifs));
    afficherObjectifs();
};

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

// -------------------------------------------------------------
// ÉCOUTEURS D'ÉVÉNEMENTS GLOBAUX
// -------------------------------------------------------------
document.addEventListener('click', function(e) {
    if (e.target && e.target.id === 'btn-ouvrir-ajout-recette') {
        const f = document.getElementById('form-recette');
        if (f) f.classList.remove('masque');
    }
    if (e.target && e.target.id === 'btn-annuler-recette') {
        const f = document.getElementById('form-recette');
        if (f) f.classList.add('masque');
    }
    if (e.target && e.target.id === 'btn-ouvrir-depense') {
        const f = document.getElementById('form-depense');
        if (f) f.classList.remove('masque');
    }
    if (e.target && e.target.id === 'btn-annuler-depense') {
        const f = document.getElementById('form-depense');
        if (f) f.classList.add('masque');
    }
    if (e.target && e.target.id === 'btn-ouvrir-ajout-objectif') {
        const f = document.getElementById('form-objectif');
        if (f) f.classList.remove('masque');
    }
    if (e.target && e.target.id === 'btn-annuler-objectif') {
        const f = document.getElementById('form-objectif');
        if (f) f.classList.add('masque');
    }
    if (e.target && e.target.id === 'btn-ouvrir-ajout') {
        basculerEcran(ecranAjout);
    }
    if (e.target && e.target.id === 'btn-annuler') {
        basculerEcran(ecranAccueil);
    }
    if (e.target && e.target.id === 'btn-terminer') {
        const flaconActif = JSON.parse(localStorage.getItem('flaconActif'));
        if (!flaconActif) return;

        const dateFin = new Date();
        const dateDebut = new Date(flaconActif.dateOuverture);
        const diffHeures = Math.max(1, (dateFin - dateDebut) / (1000 * 3600));
        const dureeJours = Math.max(1, Math.round(diffHeures / 24));
        const consoMoyenne = (flaconActif.volume / (diffHeures / 24)).toFixed(1);

        const historique = JSON.parse(localStorage.getItem('historiqueFlacons')) || [];
        historique.unshift({
            ...flaconActif,
            dateFin: dateFin.toISOString(),
            dureeJours: dureeJours,
            consommationMoyenne: consoMoyenne
        });

        localStorage.setItem('historiqueFlacons', JSON.stringify(historique));
        localStorage.removeItem('flaconActif');
        afficherTout();
    }
});

document.addEventListener('submit', function(e) {
    if (e.target && e.target.id === 'form-recette') {
        e.preventDefault();
        const recettes = JSON.parse(localStorage.getItem('recettesLiquides')) || [];
        const nouvelleRecette = {
            id: Date.now(),
            nom: document.getElementById('recette-nom').value,
            type: document.getElementById('recette-type').value,
            nicotine: parseFloat(document.getElementById('recette-nicotine').value),
            arome: parseFloat(document.getElementById('recette-arome').value) || 0
        };
        recettes.push(nouvelleRecette);
        localStorage.setItem('recettesLiquides', JSON.stringify(recettes));
        e.target.reset();
        e.target.classList.add('masque');
        afficherRecettes();
    }

    if (e.target && e.target.id === 'form-onboarding') {
        e.preventDefault();
        const prenom = document.getElementById('ob-prenom').value;
        const dateArret = document.getElementById('ob-date-arret').value;
        const cigsJour = parseFloat(document.getElementById('ob-cigs-jour').value) || 15;
        const prixPaquet = parseFloat(document.getElementById('ob-prix-paquet').value) || 12.5;

        const profil = { prenom, dateArret };
        const configTabac = { cigsJour, prixPaquet, cigsPaquet: 20 };

        localStorage.setItem('profilUtilisateur', JSON.stringify(profil));
        localStorage.setItem('configTabac', JSON.stringify(configTabac));

        ecranOnboarding.classList.add('masque');
        enteteApp.classList.remove('masque');
        contenuPrincipal.classList.remove('masque');

        mettreAJourCartesDashboard();
        mettreAJourCerisierHD();
        afficherTout();
    }

    if (e.target && e.target.id === 'form-flacon') {
        e.preventDefault();
        const dateSaisie = document.getElementById('date-ouverture').value;
        const dateOuverture = dateSaisie ? new Date(dateSaisie).toISOString() : new Date().toISOString();

        const nouveauFlacon = {
            nom: document.getElementById('nom').value,
            type: document.getElementById('type').value,
            volume: parseFloat(document.getElementById('volume').value),
            nicotine: parseFloat(document.getElementById('nicotine').value),
            arome: parseFloat(document.getElementById('arome').value) || 0,
            dateOuverture: dateOuverture
        };

        localStorage.setItem('flaconActif', JSON.stringify(nouveauFlacon));
        e.target.reset();
        basculerEcran(ecranAccueil);
        afficherTout();
    }

    if (e.target && e.target.id === 'form-depense') {
        e.preventDefault();
        const depenses = JSON.parse(localStorage.getItem('depensesVape')) || [];
        const montantInput = parseFloat(document.getElementById('dep-montant').value) || 0;

        const nouvelleDepense = {
            id: Date.now(),
            cat: document.getElementById('dep-cat').value,
            montant: montantInput,
            nom: document.getElementById('dep-nom').value || 'Achat Vape',
            date: new Date().toLocaleDateString('fr-FR')
        };
        depenses.unshift(nouvelleDepense);
        localStorage.setItem('depensesVape', JSON.stringify(depenses));
        e.target.reset();
        e.target.classList.add('masque');

        afficherFinances();
    }

    if (e.target && e.target.id === 'form-objectif') {
        e.preventDefault();
        const objectifs = JSON.parse(localStorage.getItem('objectifsVape')) || [];
        const nouvelObj = {
            id: Date.now(),
            date: document.getElementById('obj-date').value,
            titre: document.getElementById('obj-titre').value
        };
        objectifs.push(nouvelObj);
        localStorage.setItem('objectifsVape', JSON.stringify(objectifs));
        e.target.reset();
        e.target.classList.add('masque');
        afficherObjectifs();
    }

    if (e.target && e.target.id === 'form-config-tabac') {
        e.preventDefault();
        const config = {
            cigsJour: parseFloat(document.getElementById('cigs-jour').value) || 0,
            prixPaquet: parseFloat(document.getElementById('prix-paquet').value) || 0,
            cigsPaquet: parseFloat(document.getElementById('cigs-paquet').value) || 20
        };
        localStorage.setItem('configTabac', JSON.stringify(config));
        mettreAJourCartesDashboard();
    }
});

// INITIALISATION
window.addEventListener('DOMContentLoaded', function() {
    initialiserBoutonNotif();
    const profil = getProfilUtilisateur();

    if (!profil) {
        enteteApp.classList.add('masque');
        contenuPrincipal.classList.add('masque');
        ecranOnboarding.classList.remove('masque');
    } else {
        ecranOnboarding.classList.add('masque');
        mettreAJourCartesDashboard();
        mettreAJourCerisierHD();
        afficherTout();
    }
});

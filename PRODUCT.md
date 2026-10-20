# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Patrons de petites entreprises et indépendants de Suisse romande, avec le Valais comme premier terrain : artisans, commerces, cabinets, petites PME. Ils connaissent leur métier, pas le digital, et n’ont ni le temps ni l’envie d’apprendre le jargon. Ils arrivent sur nexus-lab.ch pour savoir si NexusLab peut les aider, à quel prix et avec qui ils vont parler, puis pour demander un devis ou appeler.

## Product Purpose

NexusLab est une petite équipe qui crée pour ces entreprises des sites web simples et des outils digitaux sur mesure (factures avec QR-facture, planning des équipes, tableau de bord, suivi des clients et des chantiers, gestion RH). Les deux offres ont le même poids : le site n’est pas un produit d’appel pour les outils, ni l’inverse.

Le site nexus-lab.ch réussit quand un patron comprend ce qu’on peut faire pour lui, fait confiance à l’équipe et envoie une demande de devis (formulaire, WhatsApp ou appel).

## Positioning

- Un seul client à la fois : un nouveau projet ne commence qu’une fois le précédent livré, avec liste d’attente et date annoncée.
- Une offre écrite (contenu, prix, délai) avant tout engagement ; rien ne commence sans l’accord du client.
- Le client est propriétaire : nom de domaine à son nom, textes et photos à lui.
- On parle directement à ceux qui font le travail : trois personnes, un numéro, pas de service client.
- Équipe basée à Sierre, qui travaille dans toute la Suisse romande.
- Les membres sont étudiants en économie d’entreprise à la HES-SO Valais-Wallis (filière Business Team Academy) ; NexusLab est porté par Vardena, la coopérative de la classe, et chaque mandat passe par un contrat. C’est dit franchement, mais ce n’est pas un argument de vente central : l’identité doit pouvoir survivre aux études.

## Operating Context

- Déroulé d’un projet : échange (sur place ou à distance), offre écrite, maquette validée avant construction, mise en ligne avec prise en main pour modifier textes et photos.
- Le client fournit logo, photos, textes ou horaires ; l’équipe aide à les préparer s’ils manquent.
- Contact : formulaire (FormSubmit vers nexuslab.mpa@gmail.com), WhatsApp et téléphone +41 79 737 87 92 ; réponse en général sous 24 heures.
- Équipe : Patrick Lugon (pilotage des projets et design, interlocuteur au téléphone), Mehdi Chouchane (développement des sites et outils, comptes), Arno Blatter (rencontre des entreprises, suivi après mise en ligne).

## Capabilities and Constraints

- Site statique d’une page à sections, plus pages légales, 404 et page merci. Source dans `source/` (textes dans `source/content/fr.py`, gabarits, `build.py`) ; `site/` est généré et ne se modifie jamais à la main, sauf `site/assets/` (CSS, JS, polices, images).
- Mise en ligne : push sur `main` du dépôt `nexuslab-ch/Nexus-Site`, déployé par Netlify (`[skip netlify]` dans le message pour ne pas déployer).
- Français en ligne ; allemand et anglais prévus une fois les textes validés (structure multilingue déjà prête).
- Règles de rédaction : pas de tiret cadratin ni demi-cadratin, apostrophes typographiques, typographie romande (espace insécable avant le deux-points, rien avant ? et !). Ton direct, phrases courtes, tutoiement exclu, « on » plutôt que « nous » dans le corps de texte.
- Police Manrope hébergée sur le site, aucun appel à Google Fonts ; images en WebP chargées à la demande.
- Offres et prix : décidés et tenus en interne dans le dashboard NexusLab (dépôt `nexuslab-ch/dashboard`, table `offres`). Le site ne montre jamais de prix ni de montant, et ne nomme pas les offres (la section des formules reste masquée) ; il les décrit en mots simples et renvoie au devis écrit.
- Ce que le site peut dire des offres : des sites (une page ou plusieurs pages, contenu modifiable par le client sur les sites de plusieurs pages), des outils de gestion et des tableaux de bord ou ERP sur mesure. Deux façons de payer : la création en une fois puis un forfait annuel, ou tout au mois avec un engagement d’un an. Au mois, les petites modifications faites par NexusLab sont comprises ; en paiement unique, elles sont en option.

## Brand Commitments

- Nom : NexusLab ; mot-symbole « nexus » ; domaine nexus-lab.ch.
- Signature : « Le lien entre votre métier et le digital. »
- Logo et charte existants (dossier `Nexus/Logo`, `Nexus_charte_graphique.pdf`).
- Voix : franche et concrète. On dit quand on ne sait pas faire, on promet seulement ce qui est écrit dans l’offre.

## Evidence on Hand

- Une réalisation : Lugon Assèchement Sàrl, Martigny (lugon-assechement.ch), site en français, allemand et anglais qui a remplacé un abonnement d’annuaire coûteux. C’est l’entreprise familiale de Patrick ; elle utilise aussi un outil de factures avec QR-facture, devis, suivi des paiements et documents classés par client.
- Prochain projet annoncé : le site de Vardena. AV Legal (deux juristes, canton de Vaud) est en cours.
- Les écrans d’outils sur la page sont des exemples avec données fictives, signalés comme tels.
- Absents, à ne pas inventer : témoignages clients, chiffre d’économies chez Lugon (champ prévu, vide tant qu’on n’a pas le vrai chiffre), photo d’équipe (prévue, pas encore fournie), nombre de clients, logos de clients.

## Product Principles

1. Clarté avant tout : un patron sans connaissances techniques doit comprendre chaque phrase sans aide.
2. Rien d’écrit qu’on ne puisse tenir : pas de chiffre, de prix ou de preuve sans source réelle.
3. Une équipe joignable plutôt qu’une agence : l’appel ou le message direct est toujours à portée.
4. Sites et outils à égalité : aucun des deux ne doit paraître secondaire.
5. Le client garde la main : propriété, accord écrit, possibilité de modifier lui-même.

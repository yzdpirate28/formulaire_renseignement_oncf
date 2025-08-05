# ONCF Maintenance Ferroviaire – Application de Gestion des Interventions

Cette application web permet la gestion, le suivi et l’exportation des interventions techniques pour la maintenance ferroviaire de l’ONCF. Elle propose des formulaires dédiés à la saisie des interventions Caténaire et Sous-Station, ainsi qu’un tableau de bord pour visualiser et exporter les données.

## Fonctionnalités principales

- **Saisie des interventions Caténaire et Sous-Station** via des formulaires ergonomiques.
- **Consultation et filtrage** des interventions enregistrées.
- **Exportation des données** au format Excel.
- **Synchronisation avec Google Sheets** pour la sauvegarde et la suppression des interventions.
- **Interface moderne et responsive** adaptée à tous les écrans.

## Technologies utilisées

- [React](https://react.dev/) (avec Vite)
- [React Router](https://reactrouter.com/)
- [Tailwind CSS](https://tailwindcss.com/) pour le design
- [ExcelJS](https://github.com/exceljs/exceljs) et [FileSaver](https://github.com/eligrey/FileSaver.js/) pour l’export Excel
- [Google Apps Script](https://developers.google.com/apps-script) pour la connexion à Google Sheets

## Installation et démarrage

1. **Cloner le dépôt :**
   ```bash
   git clone https://github.com/yzdpirate28/formulaire_renseignement_oncf.git
   cd formulaire_renseignement_oncf
   ```

2. **Installer les dépendances :**
   ```bash
   npm install
   ```

3. **Démarrer l'application :**
   ```bash
   npm run dev
   ```

L'application sera accessible à l'adresse `http://localhost:3000`.

## Structure du projet

Voici un aperçu de la structure des fichiers du projet :

```
src/
  ├── App.jsx
  ├── main.jsx
  ├── index.css
  ├── App.css
  ├── assets/
  ├── pages/
  │   ├── Home.jsx
  │   ├── Form.jsx
  │   ├── FormSousStation.jsx
  │   ├── Display.jsx
  │   └── FormEdit.jsx
  └── router/
      └── index.jsx
```

## Contribuer

Les contributions sont les bienvenues ! Merci de soumettre une demande de tirage (pull request) pour toute amélioration ou correction.

## Auteurs

- **Votre Nom** - Développeur principal - [Votre Profil GitHub](https://github.com/yzdpirate28)


## Licence

Ce projet est sous licence MIT - voir le fichier [LICENSE](LICENSE) pour plus de détails.

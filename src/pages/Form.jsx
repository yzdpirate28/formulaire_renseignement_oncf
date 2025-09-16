import React, { useEffect, useState } from 'react';
import villesData from "../../Villes.json";
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { Link } from 'react-router-dom';

function Form() {
  const [villes, setVilles] = useState([]);
  const [records, setRecords] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [formData, setFormData] = useState({
    date: '',
    dric: '',
    dt: '',
    up: '',
    section: '',
    voie: '',
    doc: '',
    pk_debut: '',
    pk_fin: '',
    heure_debut_prevu: '',
    heure_fin_prevu: '',
    delai_prevu: '',
    heure_debut_acc: '',
    heure_fin_acc: '',
    nature_travaux: '',
    engin_exploite: '',
    description_travaux: '',
    charge_consignation: '',
    date_renseignement: new Date()
  });

  useEffect(() => {
    setVilles(villesData);
    // Load records from localStorage
    const storedData = localStorage.getItem('catenaireRecords');
    if (storedData) {
      setRecords(JSON.parse(storedData));
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Auto-format date input
    if (name === 'date') {
      let formattedValue = value.replace(/\D/g, ''); // Remove non-digits
      
      // Add "/" after day (2 digits)
      if (formattedValue.length >= 2) {
        formattedValue = formattedValue.substring(0, 2) + '/' + formattedValue.substring(2);
      }
      
      // Add "/" after month (4 digits total: jj/mm)
      if (formattedValue.length >= 5) {
        formattedValue = formattedValue.substring(0, 5) + '/' + formattedValue.substring(5, 9);
      }
      
      // Limit to jj/mm/aaaa format
      if (formattedValue.length > 10) {
        formattedValue = formattedValue.substring(0, 10);
      }
      
      setFormData(prev => ({
        ...prev,
        [name]: formattedValue
      }));
    } else {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    }
  };
const addRecord = () => {
  if (!formData.date || !formData.dric) {
    alert('Veuillez remplir au moins la Date et le DRIC');
    return;
  }

  const newRecord = {
    ...formData,
    id: Date.now(),
    timestamp: new Date().toLocaleString('fr-FR'),
    operator: prompt('Nom de l\'opérateur:') || 'Non spécifié'
  };

  if (editingIndex !== null) {
    // Update existing record
    const updatedRecords = [...records];
    updatedRecords[editingIndex] = newRecord;
    setRecords(updatedRecords);
    setEditingIndex(null);
    alert('Enregistrement mis à jour!');
  } else {
    // Add new record
    setRecords([...records, newRecord]);
    alert('Enregistrement ajouté!');
  }

  // Save to localStorage
  localStorage.setItem('catenaireRecords', JSON.stringify([...records, newRecord]));

  // Reset form
  resetForm();
};

const editRecord = (index) => {
  const record = records[index];
  setFormData(record);
  setEditingIndex(index);
  // Scroll to form
  document.getElementById('form-section').scrollIntoView({ behavior: 'smooth' });
};

const deleteRecord = (index) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer cet enregistrement?')) {
    const updatedRecords = records.filter((_, i) => i !== index);
    setRecords(updatedRecords);
    localStorage.setItem('catenaireRecords', JSON.stringify(updatedRecords));
    alert('Enregistrement supprimé!');
  }
};

const saveAllToExcel = async () => {
  if (records.length === 0) {
    alert('Aucun enregistrement à sauvegarder!');
    return;
  }

  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Renseignement Caténaire');

    const headers = [
      'Date', 'DRIC', 'DT', 'UP', 'Section', 'Voie', 'Doc', 'PK Début', 'PK Fin',
      'Heure Début Prévu', 'Heure Fin Prévu', 'Heure Début Acc', 'Heure Fin Acc',
      'Nature Travaux', 'Engin Exploité', 'Description Travaux', 'Chargé Consignation',
      'Opérateur', 'Date Soumission'
    ];

    // Build rows explicitly for the table (array of arrays)
    const rows = records.map(record => ([
      record.date || null,
      record.dric || null,
      record.dt || null,
      record.up || null,
      record.section || null,
      record.voie || null,
      record.doc || null,
      record.pk_debut || null,
      record.pk_fin || null,
      record.heure_debut_prevu || null,
      record.heure_fin_prevu || null,
      record.heure_debut_acc || null,
      record.heure_fin_acc || null,
      record.nature_travaux || null,
      record.engin_exploite || null,
      record.description_travaux || null,
      record.charge_consignation || null,
      record.operator || null,
      record.timestamp || null
    ]));

    // Create the table with explicit columns and rows starting at A1
    worksheet.addTable({
      name: 'RenseignementTable',
      ref: 'A1',
      headerRow: true,
      totalsRow: false,
      style: {
        theme: 'TableStyleMedium9',
        showRowStripes: true,
      },
      columns: headers.map(header => ({ name: header, filterButton: true })),
      rows
    });

    // Optional: set column widths
    worksheet.columns = headers.map(header => ({ width: Math.max(header.length + 2, 15) }));

    const today = new Date().toISOString().slice(0, 10);
    const filename = `Renseignement_Catenaire_${today}.xlsx`;

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, filename);

    alert(`Excel sauvegardé! ${records.length} enregistrements exportés.`);
  } catch (error) {
    console.error('Erreur:', error);
    alert(`Erreur lors de la sauvegarde: ${error.message}`);
  }
};

const clearAllData = () => {
  if (confirm('Êtes-vous sûr de vouloir effacer tous les enregistrements?')) {
    setRecords([]);
    localStorage.removeItem('catenaireRecords');
    alert('Tous les enregistrements ont été effacés.');
  }
};


  const resetForm = () => {
    setFormData({
      date: '',
      dric: '',
      dt: '',
      up: '',
      section: '',
      voie: '',
      doc: '',
      pk_debut: '',
      pk_fin: '',
      heure_debut_prevu: '',
      heure_fin_prevu: '',
      delai_prevu: '',
      heure_debut_acc: '',
      heure_fin_acc: '',
      nature_travaux: '',
      engin_exploite: '',
      description_travaux: '',
      charge_consignation: '',
      date_renseignement: ''
    });
    console.log("Formulaire réinitialisé");
    alert('Formulaire réinitialisé!');
  };

  const deleteEntry = () => {
    console.log("Entrée supprimée");
    // Implémentez la logique de suppression ici
    alert('Entrée supprimée!');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/" className="inline-block mb-4 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition">
        ← Retour à l'accueil
      </Link>
      <img src="https://www.oncf.ma/images/logo.png?v4.6" className='m-auto mb-10 ' alt="" />
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-t-2xl shadow-lg">
        <h1 className="text-3xl font-bold text-white text-center py-6">
          <i className="fas fa-clipboard-list mr-3"></i>
          Formulaire de Renseignement Caténaire
        </h1>
        <div className="text-center pb-4">
          <span className="bg-white/20 px-4 py-2 rounded-full text-white">
            <i className="fas fa-database mr-2"></i>
            {records.length} enregistrement(s) en cours
          </span>
        </div>
      </div>

      {/* Form Container */}
      <div id="form-section" className="bg-white rounded-b-2xl shadow-lg p-8">
        <form id="renseignementForm" className="space-y-6">
          {/* Section Informations Générales */}
          <div className="border-l-4 border-orange-500 pl-4 mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              <i className="fas fa-info-circle mr-2 text-orange-500"></i>
              Informations Générales
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Date */}
              <div className="space-y-2">
                <label htmlFor="date" className="block text-sm font-semibold text-gray-700">
                  <i className="fas fa-calendar mr-1 text-orange-500"></i>
                  Date
                </label>
                <input 
                  type="text" 
                  id="date" 
                  name="date" 
                  placeholder="jj/mm/aaaa"
                  value={formData.date}
                  onChange={handleInputChange}
                  maxLength="10"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200"
                />
              </div>

              {/* DRIC */}
              <div className="space-y-2">
                <label htmlFor="dric" className="block text-sm font-semibold text-gray-700">
                  <i className="fas fa-building mr-1 text-orange-500"></i>
                  DRIC
                </label>
                <select 
                  id="dric" 
                  name="dric" 
                  value={formData.dric}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200"
                >
                  <option value="">Sélectionner DRIC</option>
                  <option value="SUD">SUD</option>
                  <option value="NORD">NORD</option>
                  <option value="CENTRE">CENTRE</option>
                </select>
              </div>

              {/* DT */}
              <div className="space-y-2">
                <label htmlFor="dt" className="block text-sm font-semibold text-gray-700">
                  <i className="fas fa-map-marker-alt mr-1 text-orange-500"></i>
                  DT
                </label>
                <select 
                  id="dt" 
                  name="dt" 
                  value={formData.dt}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200"
                >
                  <option value="">Sélectionner DT</option>
                  <option value="CAT101">CAT101</option>
                  <option value="LC111">LC111</option>
                  <option value="LC112">LC112</option>
                  <option value="LC121">LC121</option>
                  <option value="LC122">LC122</option>
                  <option value="LC211">LC211</option>
                  <option value="LC212">LC212</option>
                  <option value="LC213">LC213</option>
                  <option value="LC221">LC221</option>
                  <option value="LC222">LC222</option>
                  <option value="LC223">LC223</option>
                  <option value="LC311">LC311</option>
                  <option value="LC312">LC312</option>
                  <option value="LC321">LC321</option>
                </select>
              </div>

              {/* UP */}
              <div className="space-y-2">
                <label htmlFor="up" className="block text-sm font-semibold text-gray-700">
                  <i className="fas fa-users mr-1 text-orange-500"></i>
                  UP
                </label>
                <select 
                  id="up" 
                  name="up" 
                  value={formData.up}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200"
                >
                  <option value="">Sélectionner UP</option>
                  <option value="CAT1011">CAT1011</option>
                  <option value="CAT1012">CAT1012</option>
                  <option value="CAT1013">CAT1013</option>
                  <option value="LC1111">LC1111</option>
                  <option value="LC1112">LC1112</option>
                  <option value="LC1121">LC1121</option>
                  <option value="LC1122">LC1122</option>
                  <option value="LC1211">LC1211</option>
                  <option value="LC1212">LC1212</option>
                  <option value="LC1221">LC1221</option>
                  <option value="LC1222">LC1222</option>
                  <option value="LC2111">LC2111</option>
                  <option value="LC2121">LC2121</option>
                  <option value="LC2122">LC2122</option>
                  <option value="LC2131">LC2131</option>
                  <option value="LC2211">LC2211</option>
                  <option value="LC2212">LC2212</option>
                  <option value="LC2221">LC2221</option>
                  <option value="LC2222">LC2222</option>
                  <option value="LC2231">LC2231</option>
                  <option value="LC2232">LC2232</option>
                  <option value="LC3111">LC3111</option>
                  <option value="LC3112">LC3112</option>
                  <option value="LC3121">LC3121</option>
                  <option value="LC3122">LC3122</option>
                  <option value="LC3211">LC3211</option>
                </select>
              </div>

              {/* Section */}
              <div className="space-y-2">
                <label htmlFor="section" className="block text-sm font-semibold text-gray-700">
                  <i className="fas fa-layer-group mr-1 text-orange-500"></i>
                  Section
                </label>
                <select 
                  id="section" 
                  name="section" 
                  value={formData.section}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200"
                >
                  <option value="">Sélectionner Section</option>
                  {villes.map((ville, index) => (
                    <option key={index} value={ville.ville}>
                      {ville.ville}
                    </option>
                  ))}
                </select>
              </div>

              {/* Voie */}
              <div className="space-y-2">
                <label htmlFor="voie" className="block text-sm font-semibold text-gray-700">
                  <i className="fas fa-road mr-1 text-orange-500"></i>
                  Voie
                </label>
                <input 
                  type="text" 
                  id="voie" 
                  name="voie" 
                  value={formData.voie}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200"
                />
              </div>

              {/* Doc */}
              <div className="space-y-2">
                <label htmlFor="doc" className="block text-sm font-semibold text-gray-700">
                  <i className="fas fa-file mr-1 text-orange-500"></i>
                  Doc
                </label>
                <input 
                  type="text" 
                  id="doc" 
                  name="doc" 
                  value={formData.doc}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200"
                />
              </div>
            </div>
          </div>

          {/* Section Localisation */}
          <div className="border-l-4 border-blue-500 pl-4 mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              <i className="fas fa-map mr-2 text-blue-500"></i>
              Localisation
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* PK début */}
              <div className="space-y-2">
                <label htmlFor="pk_debut" className="block text-sm font-semibold text-gray-700">
                  <i className="fas fa-play mr-1 text-green-500"></i>
                  PK Début (km)
                </label>
                <input 
                  type="text" 
                  id="pk_debut" 
                  name="pk_debut" 
                  placeholder="Ex: 12.500"
                  value={formData.pk_debut}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200"
                />
              </div>

              {/* PK fin */}
              <div className="space-y-2">
                <label htmlFor="pk_fin" className="block text-sm font-semibold text-gray-700">
                  <i className="fas fa-stop mr-1 text-red-500"></i>
                  PK Fin (km)
                </label>
                <input 
                  type="text" 
                  id="pk_fin" 
                  name="pk_fin" 
                  placeholder="Ex: 15.200"
                  value={formData.pk_fin}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200"
                />
              </div>
            </div>
          </div>

          {/* Section Horaires */}
          <div className="border-l-4 border-purple-500 pl-4 mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              <i className="fas fa-clock mr-2 text-purple-500"></i>
              Planification Horaire
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Heure Début Prévu */}
              <div className="space-y-2">
                <label htmlFor="heure_debut_prevu" className="block text-sm font-semibold text-gray-700">
                  <i className="fas fa-play-circle mr-1 text-blue-500"></i>
                  Heure Début Prévu
                </label>
                <input 
                  type="time" 
                  id="heure_debut_prevu" 
                  name="heure_debut_prevu" 
                  value={formData.heure_debut_prevu}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200"
                />
              </div>

              {/* Heure Fin Prévu */}
              <div className="space-y-2">
                <label htmlFor="heure_fin_prevu" className="block text-sm font-semibold text-gray-700">
                  <i className="fas fa-stop-circle mr-1 text-blue-500"></i>
                  Heure Fin Prévu
                </label>
                <input 
                  type="time" 
                  id="heure_fin_prevu" 
                  name="heure_fin_prevu" 
                  value={formData.heure_fin_prevu}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200"
                />
              </div>

              {/* Heure Début Acc */}
              <div className="space-y-2">
                <label htmlFor="heure_debut_acc" className="block text-sm font-semibold text-gray-700">
                  <i className="fas fa-clock mr-1 text-green-600"></i>
                  Heure Début Acc
                </label>
                <input 
                  type="time" 
                  id="heure_debut_acc" 
                  name="heure_debut_acc" 
                  value={formData.heure_debut_acc}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200"
                />
              </div>

              {/* Heure Fin Acc */}
              <div className="space-y-2">
                <label htmlFor="heure_fin_acc" className="block text-sm font-semibold text-gray-700">
                  <i className="fas fa-clock mr-1 text-red-600"></i>
                  Heure Fin Acc
                </label>
                <input 
                  type="time" 
                  id="heure_fin_acc" 
                  name="heure_fin_acc" 
                  value={formData.heure_fin_acc}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200"
                />
              </div>
            </div>
          </div>

          {/* Section Travaux */}
          <div className="border-l-4 border-green-500 pl-4 mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              <i className="fas fa-tools mr-2 text-green-500"></i>
              Détails des Travaux
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Nature des travaux */}
              <div className="space-y-2">
                <label htmlFor="nature_travaux" className="block text-sm font-semibold text-gray-700">
                  <i className="fas fa-hammer mr-1 text-gray-600"></i>
                  Nature des travaux
                </label>
                <select 
                  id="nature_travaux" 
                  name="nature_travaux" 
                  value={formData.nature_travaux}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200"
                >
                  <option value="">Sélectionner nature</option>
                  <option value="VSP">VSP</option>
                  <option value="REVISION PROGRAMME">REVISION PROGRAMME</option>
                  <option value="INTERVENTION PONCTUELLE">INTERVENTION PONCTUELLE</option>
                  <option value="RELEVE DE GEOMETRIE">RELEVE DE GEOMETRIE</option>
                  <option value="RELEVE D'EPAISSEUR DU FC">RELEVE D'EPAISSEUR DU FC</option>
                  <option value="VTE DES APPAREILS DINTERRUPTION">VTE DES APPAREILS D'INTERRUPTION</option>
                  <option value="VTE DES PRISES D'AIGUILLES">VTE DES PRISES D'AIGUILLES</option>
                  <option value="VTE DES AT">VTE DES AT</option>
                  <option value="VTE DES IS">VTE DES IS</option>
                  <option value="M CORRECTIVE">M CORRECTIVE</option>
                </select>
              </div>

              {/* Engin exploité */}
              <div className="space-y-2">
                <label htmlFor="engin_exploite" className="block text-sm font-semibold text-gray-700">
                  <i className="fas fa-truck mr-1 text-yellow-500"></i>
                  Engin exploité
                </label>
                <select 
                  id="engin_exploite" 
                  name="engin_exploite" 
                  value={formData.engin_exploite}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200"
                >
                  <option value="">Sélectionner engin</option>
                  <option value="VMT 1130">VMT 1130</option>
                  <option value="VMT 1131">VMT 1131</option>
                  <option value="VMT 1132">VMT 1132</option>
                  <option value="Donnelli 570+EPA 54">Donnelli 570+EPA 54</option>
                  <option value="VMT 797">VMT 797</option>
                  <option value="VMT 965">VMT 965</option>
                  <option value="DLC 06">DLC 06</option>
                  <option value="VMT 794">VMT 794</option>
                  <option value="VMT 964">VMT 964</option>
                  <option value="VMT 1074">VMT 1074</option>
                  <option value="VMT 1075">VMT 1075</option>
                  <option value="VMT 1133">VMT 1133</option>
                  <option value="VMT 1077">VMT 1077</option>
                  <option value="ELAN 187">ELAN 187</option>
                  <option value="ELAN 188">ELAN 188</option>
                  <option value="VCP 111158">VCP 111158</option>
                  <option value="VCP 111157">VCP 111157</option>
                  <option value="VMT 1076">VMT 1076</option>
                  <option value="DLC 09">DLC 09</option>
                  <option value="VMT 792">VMT 792</option>
                  <option value="VMT 963">VMT 963</option>
                  <option value="VMT 796">VMT 796</option>
                  <option value="VMT 966">VMT 966</option>
                  <option value="DLC 08">DLC 08</option>
                  <option value="SANS ENGIN">SANS ENGIN</option>
                  <option value="AUTRE">Autre (préciser)</option>
                </select>
                {formData.engin_exploite === 'AUTRE' && (
                  <input
                    type="text"
                    name="engin_exploite_autre"
                    placeholder="Précisez l'engin exploité"
                    value={formData.engin_exploite_autre || ''}
                    onChange={e => setFormData(prev => ({ ...prev, engin_exploite_autre: e.target.value }))}
                    className="w-full mt-2 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200"
                  />
                )}
              </div>
            </div>

            {/* Description détaillée */}
            <div className="space-y-2 mb-6">
              <label htmlFor="description_travaux" className="block text-sm font-semibold text-gray-700">
                <i className="fas fa-file-alt mr-1 text-indigo-500"></i>
                Description des travaux
              </label>
              <textarea 
                id="description_travaux" 
                name="description_travaux" 
                rows="4" 
                value={formData.description_travaux}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200 resize-none"
                placeholder="Décrivez en détail les travaux à effectuer..."
              ></textarea>
            </div>

            {/* Chargé de consignation */}
            <div className="space-y-2">
              <label htmlFor="charge_consignation" className="block text-sm font-semibold text-gray-700">
                <i className="fas fa-user-tie mr-1 text-purple-500"></i>
                Chargé de consignation
              </label>
              <input 
                type="text" 
                id="charge_consignation" 
                name="charge_consignation" 
                value={formData.charge_consignation}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200"
              />
            </div>
          </div>

          {/* Section Date de renseignement */}
          <div hidden className="border-l-4 border-gray-500 pl-4 mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              <i className="fas fa-calendar-check mr-2 text-gray-500"></i>
              Renseignement
            </h2>
            
            <div className="space-y-2">
              <label htmlFor="date_renseignement" className="block text-sm font-semibold text-gray-700">
                <i className="fas fa-calendar-check mr-1 text-orange-500"></i>
                Date de renseignement
              </label>
              <input 
                type="text" 
                hidden
                id="date_renseignement" 
                name="date_renseignement" 
                placeholder="jj/mm/aaaa"
                value={formData.date_renseignement}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200"
              />
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex flex-wrap gap-4 pt-8 border-t">
            <button 
              type="button" 
              onClick={addRecord} 
              className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:ring-4 focus:ring-green-300 transition duration-200 font-semibold"
            >
              <i className="fas fa-plus mr-2"></i>
              {editingIndex !== null ? 'Mettre à jour' : 'Ajouter'}
            </button>
            
            <button 
              type="button" 
              onClick={resetForm} 
              className="flex items-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:ring-4 focus:ring-gray-300 transition duration-200 font-semibold"
            >
              <i className="fas fa-undo mr-2"></i>
              Réinitialiser
            </button>
            
            <button 
              type="button" 
              onClick={saveAllToExcel} 
              className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition duration-200 font-semibold"
            >
              <i className="fas fa-file-excel mr-2"></i>
              Sauvegarder Excel
            </button>
            
            <button 
              type="button" 
              onClick={clearAllData} 
              className="flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:ring-4 focus:ring-red-300 transition duration-200 font-semibold"
            >
              <i className="fas fa-trash mr-2"></i>
              Effacer Tout
            </button>
            
          </div>
        </form>

        {/* Status Messages */}
        <div id="statusMessage" className="mt-4 hidden"></div>
      </div>

      {/* Records Table View */}
      {records.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-8 mt-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            <i className="fas fa-table mr-2 text-blue-500"></i>
            Enregistrements en cours ({records.length})
          </h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DRIC</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DT</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Section</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nature Travaux</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Opérateur</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {records.map((record, index) => (
                  <tr key={record.id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{record.date || '-'}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{record.dric || '-'}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{record.dt || '-'}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{record.section || '-'}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{record.nature_travaux || '-'}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{record.operator || '-'}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => editRecord(index)}
                          className="text-blue-600 hover:text-blue-900 transition"
                          title="Modifier"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button
                          onClick={() => deleteRecord(index)}
                          className="text-red-600 hover:text-red-900 transition"
                          title="Supprimer"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default Form;
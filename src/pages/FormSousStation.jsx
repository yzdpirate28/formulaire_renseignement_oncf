import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

function FormSousStation() {
  const [formData, setFormData] = useState({
    date: '',
    dric: '',
    district: '',
    sst_ps: '',
    type_intervention: '',
    equipements: '',
    charge_exploitation: '',
    doc: '',
    heure_entree: '',
    heure_sortie: '',
    delai_acces: '',
    heure_debut_travaux: '',
    heure_fin_travaux: '',
    nature_intervention: '',
    consistance_travaux: '',
  });

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
      
      setFormData((prev) => ({ ...prev, [name]: formattedValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const resetForm = () => {
    setFormData({
      date: '',
      dric: '',
      district: '',
      sst_ps: '',
      type_intervention: '',
      equipements: '',
      charge_exploitation: '',
      doc: '',
      heure_entree: '',
      heure_sortie: '',
      delai_acces: '',
      heure_debut_travaux: '',
      heure_fin_travaux: '',
      nature_intervention: '',
      consistance_travaux: '',
    });
    alert('Formulaire réinitialisé!');
  };

  const saveToExcel = async () => {
    try {
      // Create Excel workbook
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Renseignement Sous Station');
      
      // Prepare data for table creation
      const headers = [
        'Date', 'DRIC', 'District', 'SST/PS', 'Type Intervention', 'Équipements',
        'Chargé Exploitation', 'Doc', 'Heure Entrée', 'Heure Sortie', 'Délai Accès',
        'Heure Début Travaux', 'Heure Fin Travaux', 'Nature Intervention', 'Consistance Travaux'
      ];
      
      // Add headers
      worksheet.addRow(headers);
      
      // Add data row
      const row = [
        formData.date || '',
        formData.dric || '',
        formData.district || '',
        formData.sst_ps || '',
        formData.type_intervention || '',
        formData.equipements || '',
        formData.charge_exploitation || '',
        formData.doc || '',
        formData.heure_entree || '',
        formData.heure_sortie || '',
        formData.delai_acces || '',
        formData.heure_debut_travaux || '',
        formData.heure_fin_travaux || '',
        formData.nature_intervention || '',
        formData.consistance_travaux || ''
      ];
      worksheet.addRow(row);

      // Create Excel table
      const lastRow = 2; // Header + 1 data row
      const lastCol = headers.length;
      const lastColLetter = String.fromCharCode(64 + lastCol);
      
      worksheet.addTable({
        name: 'RenseignementSousStationTable',
        ref: `A1:${lastColLetter}${lastRow}`,
        headerRow: true,
        totalsRow: false,
        style: {
          theme: 'TableStyleMedium9',
          showRowStripes: true,
        },
        columns: headers.map(header => ({
          name: header,
          filterButton: true
        }))
      });
      
      // Set column widths
      worksheet.columns = headers.map(header => ({
        width: Math.max(header.length + 2, 15)
      }));

      // Generate filename with timestamp
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
      const filename = `Renseignement_SousStation_${timestamp}.xlsx`;

      // Save file
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });
      saveAs(blob, filename);

      alert('Formulaire sauvegardé en fichier Excel!');
      resetForm();
    } catch (error) {
      console.error("Erreur:", error);
      alert(`Erreur lors de la sauvegarde: ${error.message}`);
    }
  };

  const saveForm = () => {
    saveToExcel(); // Save to Excel file instead of Google Sheets
  };

  const natureOptions = [
    { value: 'VL1', label: 'VL1', description: 'Visite limitée de premier niveau' },
    { value: 'VL2', label: 'VL2', description: 'Visite limitée de deuxième niveau' },
    { value: 'VG', label: 'VG', description: 'Visite générale' },
    { value: 'TS', label: 'TS', description: 'Travaux spécifiques' },
    { value: 'M CORR', label: 'M CORR', description: 'MAINTENANCE CORRECTIVE' },
    { value: 'INSPECTION', label: 'INSPECTION', description: 'Inspection' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/" className="inline-block mb-4 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition">
        ← Retour à l'accueil
      </Link>
      <img src="https://www.oncf.ma/images/logo.png?v4.6" className='m-auto mb-10 ' alt="ONCF Logo" />
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-t-2xl shadow-lg">
        <h1 className="text-3xl font-bold text-white text-center py-6">
          <i className="fas fa-clipboard-list mr-3"></i>
          Formulaire de Renseignement Sous Station
        </h1>
      </div>
      <div className="bg-white rounded-b-2xl shadow-lg p-8">
        <form className="space-y-6">
          <div className="border-l-4 border-orange-500 pl-4 mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              <i className="fas fa-info-circle mr-2 text-orange-500"></i>
              Informations Générales
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Date */}
              <div className="space-y-2">
                <label htmlFor="date" className="block text-sm font-semibold text-gray-700">Date</label>
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
                <label htmlFor="dric" className="block text-sm font-semibold text-gray-700">DRIC</label>
                <select id="dric" name="dric" value={formData.dric} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200">
                  <option value="">Sélectionner DRIC</option>
                  <option value="SUD">SUD</option>
                  <option value="NORD">NORD</option>
                  <option value="CENTRE">CENTRE</option>
                </select>
              </div>
              {/* District */}
              <div className="space-y-2">
                <label htmlFor="district" className="block text-sm font-semibold text-gray-700">District</label>
                <select id="district" name="district" value={formData.district} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200">
                  <option value="">Sélectionner District</option>
                  <option value="SS101">SS101</option>
                  <option value="SS111">SS111</option>
                  <option value="SS112">SS112</option>
                  <option value="SS211">SS211</option>
                  <option value="SS221">SS221</option>
                  <option value="SS311">SS311</option>
                  <option value="SS321">SS321</option>
                </select>
              </div>
              {/* SST/PS */}
              <div className="space-y-2">
                <label htmlFor="sst_ps" className="block text-sm font-semibold text-gray-700">SST/PS</label>
                <input type="text" id="sst_ps" name="sst_ps" value={formData.sst_ps} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200" />
              </div>
              {/* Type de l’intervention */}
              <div className="space-y-2">
                <label htmlFor="type_intervention" className="block text-sm font-semibold text-gray-700">Type de l’intervention</label>
                <select id="type_intervention" name="type_intervention" value={formData.type_intervention} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200">
                  <option value="">Sélectionner</option>
                  <option value="SST">SST</option>
                  <option value="Télécommande">Télécommande</option>
                </select>
              </div>
              {/* Équipements objets de l'intervention */}
              <div className="space-y-2">
                <label htmlFor="equipements" className="block text-sm font-semibold text-gray-700">Équipements objets de l'intervention</label>
                <input type="text" id="equipements" name="equipements" value={formData.equipements} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200" />
              </div>
              {/* Chargé d’exploitation / intervention */}
              <div className="space-y-2">
                <label htmlFor="charge_exploitation" className="block text-sm font-semibold text-gray-700">Chargé d’exploitation / intervention</label>
                <input type="text" id="charge_exploitation" name="charge_exploitation" value={formData.charge_exploitation} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200" />
              </div>
              {/* Doc */}
              <div className="space-y-2">
                <label htmlFor="doc" className="block text-sm font-semibold text-gray-700">Doc</label>
                <input type="text" id="doc" name="doc" value={formData.doc} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200" />
              </div>
            </div>
          </div>
          {/* Section Horaires */}
          <div className="border-l-4 border-blue-500 pl-4 mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              <i className="fas fa-clock mr-2 text-blue-500"></i>
              Horaires et Délais
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Heure d'entrée */}
              <div className="space-y-2">
                <label htmlFor="heure_entree" className="block text-sm font-semibold text-gray-700">Heure d'entrée</label>
                <input type="time" id="heure_entree" name="heure_entree" value={formData.heure_entree} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200" />
              </div>
              {/* Heure de sortie */}
              <div className="space-y-2">
                <label htmlFor="heure_sortie" className="block text-sm font-semibold text-gray-700">Heure de sortie</label>
                <input type="time" id="heure_sortie" name="heure_sortie" value={formData.heure_sortie} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200" />
              </div>
              {/* Délai (Accès aux sites) */}
              <div className="space-y-2">
                <label htmlFor="delai_acces" className="block text-sm font-semibold text-gray-700">Délai (Accès aux sites)</label>
                <input type="text" id="delai_acces" name="delai_acces" value={formData.delai_acces} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200" />
              </div>
              {/* Heure Début travaux */}
              <div className="space-y-2">
                <label htmlFor="heure_debut_travaux" className="block text-sm font-semibold text-gray-700">Heure Début travaux</label>
                <input type="time" id="heure_debut_travaux" name="heure_debut_travaux" value={formData.heure_debut_travaux} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200" />
              </div>
              {/* Heure Fin travaux */}
              <div className="space-y-2">
                <label htmlFor="heure_fin_travaux" className="block text-sm font-semibold text-gray-700">Heure Fin travaux</label>
                <input type="time" id="heure_fin_travaux" name="heure_fin_travaux" value={formData.heure_fin_travaux} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200" />
              </div>
            </div>
          </div>
          {/* Section Travaux */}
          <div className="border-l-4 border-green-500 pl-4 mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              <i className="fas fa-tools mr-2 text-green-500"></i>
              Détails de l'intervention
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Nature d'intervention */}
              <div className="space-y-2">
                <label htmlFor="nature_intervention" className="block text-sm font-semibold text-gray-700">Nature d'intervention</label>
                <select id="nature_intervention" name="nature_intervention" value={formData.nature_intervention} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200">
                  <option value="">Sélectionner</option>
                  {natureOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                {formData.nature_intervention && (
                  <div className="text-sm text-gray-600 mt-1">
                    {natureOptions.find(opt => opt.value === formData.nature_intervention)?.description}
                  </div>
                )}
              </div>
            </div>
            {/* Consistance des travaux réalisés */}
            <div className="space-y-2 mb-6">
              <label htmlFor="consistance_travaux" className="block text-sm font-semibold text-gray-700">Consistance des travaux réalisés</label>
              <textarea id="consistance_travaux" name="consistance_travaux" rows="4" value={formData.consistance_travaux} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200 resize-none" placeholder="Décrivez en détail les travaux réalisés..." />
            </div>
          </div>
          {/* Boutons d'action */}
          <div className="flex flex-wrap gap-4 pt-8 border-t">
            <button type="button" onClick={saveForm} className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:ring-4 focus:ring-green-300 transition duration-200 font-semibold">
              <i className="fas fa-save mr-2"></i>
              Enregistrer
            </button>
            <button type="reset" onClick={resetForm} className="flex items-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:ring-4 focus:ring-gray-300 transition duration-200 font-semibold">
              <i className="fas fa-undo mr-2"></i>
              Réinitialiser
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FormSousStation; 
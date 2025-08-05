import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

function Display() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('catenaire');

  // Séparation des données selon le type d'intervention
  const catenaireFields = [
    { key: 'ID', label: 'ID' },
    { key: 'Date', label: 'Date' },
    { key: 'DRIC', label: 'DRIC' },
    { key: 'DT', label: 'DT' },
    { key: 'UP', label: 'UP' },
    { key: 'Section', label: 'Section' },
    { key: 'Voie', label: 'Voie' },
    { key: 'Doc', label: 'Doc' },
    { key: 'PK_Début', label: 'PK Début' },
    { key: 'PK_Fin', label: 'PK Fin' },
    { key: 'Heure_Début_Prévu', label: 'Heure Début Prévu' },
    { key: 'Heure_Fin_Prévu', label: 'Heure Fin Prévu' },
    { key: 'Heure_Début_Acc', label: 'Heure Début Acc' },
    { key: 'Heure_Fin_Acc', label: 'Heure Fin Acc' },
    { key: 'Nature_Travaux', label: 'Nature Travaux' },
    { key: 'Engin_Exploité', label: 'Engin Exploité' },
    { key: 'Description_Travaux', label: 'Description Travaux' },
    { key: 'Chargé_Consignation', label: 'Chargé Consignation' },
    { key: 'Date_Renseignement', label: 'Date Renseignement' },
  ];
  const sousStationFields = [
    { key: 'ID', label: 'ID' },
    { key: 'Date', label: 'Date' },
    { key: 'DRIC', label: 'DRIC' },
    { key: 'district', label: 'District' },
    { key: 'sst_ps', label: 'SST/PS' },
    { key: 'type_intervention', label: 'Type intervention' },
    { key: 'equipements', label: 'Équipements' },
    { key: 'charge_exploitation', label: 'Chargé exploitation/intervention' },
    { key: 'Doc', label: 'Doc' },
    { key: 'heure_entree', label: 'Heure entrée' },
    { key: 'heure_sortie', label: 'Heure sortie' },
    { key: 'delai_acces', label: 'Délai (Accès)' },
    { key: 'heure_debut_travaux', label: 'Heure Début travaux' },
    { key: 'heure_fin_travaux', label: 'Heure Fin travaux' },
    { key: 'nature_intervention', label: 'Nature intervention' },
    { key: 'consistance_travaux', label: 'Consistance travaux' },
  ];

  // Détection du type d'intervention
  const catenaireData = data.filter(item => item.DT !== undefined || item.DT !== null);
  const sousStationData = data.filter(item => item.sst_ps !== undefined || item['SST/PS'] !== undefined);

  // Liste des clés d'heures pour les deux types
  const hourKeys = [
    'Heure_Début_Prévu', 'Heure_Fin_Prévu', 'Heure_Début_Acc', 'Heure_Fin_Acc',
    'heure_entree', 'heure_sortie', 'heure_debut_travaux', 'heure_fin_travaux'
  ];
  function extractHour(val) {
    if (!val) return '';
    if (typeof val === 'string' && val.includes('T')) {
      return val.split('T')[1]?.substring(0, 8) || '';
    }
    if (typeof val === 'string' && val.length === 5 && val.includes(':')) {
      return val;
    }
    return val;
  }

  const exportToExcel = async (type) => {
    let fields, dataToExport;
    if (type === 'catenaire') {
      fields = catenaireFields;
      dataToExport = catenaireData;
    } else {
      fields = sousStationFields;
      dataToExport = sousStationData;
    }
    if (!dataToExport || dataToExport.length === 0) {
      alert('Aucune donnée à exporter dans cet onglet.');
      return;
    }
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(type === 'catenaire' ? 'Caténaire' : 'Sous Station');
    worksheet.columns = fields.map(f => ({
      header: f.label,
      key: f.key,
      width: Math.max(f.label.length + 2, 15)
    }));
    dataToExport.forEach(item => {
      worksheet.addRow(item);
    });
    worksheet.addTable({
      name: 'Interventions',
      ref: 'A1',
      headerRow: true,
      totalsRow: false,
      style: {
        theme: 'TableStyleMedium9',
        showRowStripes: true,
      },
      columns: fields.map(f => ({ name: f.label, filterButton: true })),
      rows: dataToExport.map(item => fields.map(f => hourKeys.includes(f.key) ? extractHour(item[f.key]) : (item[f.key] || ''))),
    });
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, `interventions_${type}_oncf.xlsx`);
    const idsToDelete = dataToExport.map(item => item.ID);
    await deleteFromGoogleSheet(idsToDelete);

    // Réinitialiser les données localement
    if (type === 'catenaire') {
      setData(prev => prev.filter(item => !(item.DT !== undefined && item.DT !== null)));
    } else {
      setData(prev => prev.filter(item => !(item.sst_ps !== undefined || item['SST/PS'] !== undefined)));
    }
  };

  const deleteFromGoogleSheet = async (ids) => {
    const scriptUrl = "https://script.google.com/macros/s/AKfycbxYfQp5dp_UKeBzwBxwrmwCoNLBKU1VkmB6QqUjiMN5_7PDW9GNmWp77Q7IVNKtFIyc/exec"; 
    try {
      const response = await fetch(scriptUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids }),
      });
      const result = await response.json();
      if (!result.success) throw new Error('Suppression échouée');
    } catch (err) {
      alert('Erreur lors de la suppression dans Google Sheets');
      console.error(err);
    }
  };

  const refreshTable = async () => {
    try {
      setLoading(true);
      setError(null);
      const scriptUrl = "https://script.google.com/macros/s/AKfycbxYfQp5dp_UKeBzwBxwrmwCoNLBKU1VkmB6QqUjiMN5_7PDW9GNmWp77Q7IVNKtFIyc/exec";
      const response = await fetch(scriptUrl);
      if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
      const result = await response.json();
      if (Array.isArray(result)) setData(result);
      else if (result && Array.isArray(result.data)) setData(result.data);
      else if (result && result.success && Array.isArray(result.data)) setData(result.data);
      else throw new Error("Format de données non supporté");
    } catch (error) {
      setError(error.message);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const scriptUrl = "https://script.google.com/macros/s/AKfycbxYfQp5dp_UKeBzwBxwrmwCoNLBKU1VkmB6QqUjiMN5_7PDW9GNmWp77Q7IVNKtFIyc/exec";
        const response = await fetch(scriptUrl);
        const result = await response.json();
        if (result.success) setData(result.data);
        else setError(result.message || "Erreur lors de la récupération des données");
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        <span className="ml-3 text-gray-600">Chargement en cours...</span>
      </div>
    );
  }
  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded" role="alert">
          <p className="font-bold">Erreur</p>
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="text-center mb-8">
        <img 
          src="https://www.oncf.ma/images/logo.png?v4.6" 
          className="h-16 mx-auto mb-4" 
          alt="Logo ONCF" 
        />
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Suivi des Interventions
        </h1>
        <p className="text-gray-600">Liste complète des interventions techniques</p>
      </div>
      <div className="flex gap-4 mb-6">
        <button onClick={() => setActiveTab('catenaire')} className={`px-6 py-2 rounded-t-lg font-semibold ${activeTab === 'catenaire' ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700'}`}>Caténaire</button>
        <button onClick={() => setActiveTab('sousstation')} className={`px-6 py-2 rounded-t-lg font-semibold ${activeTab === 'sousstation' ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700'}`}>Sous Station</button>
      </div>
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
        <div className="p-6 border-b flex flex-wrap justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">
            <i className="fas fa-table mr-2 text-orange-500"></i>
            {activeTab === 'catenaire' ? 'Interventions Caténaire' : 'Interventions Sous Station'}
          </h2>
          <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
            <Link 
              to={activeTab === 'catenaire' ? "/form" : "/form-sous-station"}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition font-medium text-sm"
            >
              <i className="fas fa-plus mr-2"></i>
              Ajouter
            </Link>
            <button 
              type="button" 
              onClick={() => exportToExcel(activeTab)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition font-medium text-sm"
              disabled={(activeTab === 'catenaire' ? catenaireData.length === 0 : sousStationData.length === 0)}
            >
              <i className="fas fa-file-excel mr-2"></i>
              Exporter
            </button>
            <button 
              type="button" 
              onClick={refreshTable}
              className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition font-medium text-sm"
            >
              <i className="fas fa-undo mr-2"></i>
              Rafraîchir
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          {activeTab === 'catenaire' ? (
            catenaireData.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <i className="fas fa-inbox text-4xl mb-3 text-gray-300"></i>
                <p>Aucune donnée disponible</p>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {catenaireFields.map(col => (
                      <th key={col.key} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{col.label}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {catenaireData.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition">
                      {catenaireFields.map(col => (
                        <td key={col.key} className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{item[col.key] || '-'}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          ) : (
            sousStationData.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <i className="fas fa-inbox text-4xl mb-3 text-gray-300"></i>
                <p>Aucune donnée disponible</p>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {sousStationFields.map(col => (
                      <th key={col.key} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{col.label}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sousStationData.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition">
                      {sousStationFields.map(col => (
                        <td key={col.key} className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{item[col.key] || '-'}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default Display;
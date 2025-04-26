
// components/StoricoModifiche.js
import React, { useState } from 'react';
import '../styles/Storico.css';

function StoricoModifiche({ storico }) {
  const [filtroTipo, setFiltroTipo] = useState('Tutti');
  const [filtroData, setFiltroData] = useState('');
  
  // Filtra lo storico in base ai filtri selezionati
  const storicoFiltrato = storico.filter(modifica => {
    // Filtro per tipo
    if (filtroTipo !== 'Tutti' && modifica.tipoModifica !== filtroTipo) {
      return false;
    }
    
    // Filtro per data
    if (filtroData) {
      const dataModifica = new Date(modifica.data).toISOString().split('T')[0];
      if (dataModifica !== filtroData) {
        return false;
      }
    }
    
    return true;
  });
  
  // Formatta la data e l'ora
  const formattaDataOra = (data) => {
    return new Date(data).toLocaleString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <div className="storico">
      <header className="storico-header">
        <h1>Storico Modifiche</h1>
        <div className="storico-filtri">
          <div className="filtro-tipo">
            <label>Tipo:</label>
            <select value={filtroTipo} onChange={(e) => setFiltroTipo(e.target.value)}>
              <option value="Tutti">Tutti</option>
              <option value="Aggiunta">Aggiunta</option>
              <option value="Modifica">Modifica</option>
              <option value="Eliminazione">Eliminazione</option>
            </select>
          </div>
          <div className="filtro-data">
            <label>Data:</label>
            <input 
              type="date" 
              value={filtroData}
              onChange={(e) => setFiltroData(e.target.value)}
            />
          </div>
        </div>
      </header>
      
      <div className="storico-lista">
        {storicoFiltrato.length > 0 ? (
          <table className="storico-tabella">
            <thead>
              <tr>
                <th>Data e Ora</th>
                <th>Utente</th>
                <th>Tipo</th>
                <th>Dettagli</th>
              </tr>
            </thead>
            <tbody>
              {storicoFiltrato.map(modifica => (
                <tr key={modifica.id} className={`tipo-${modifica.tipoModifica.toLowerCase()}`}>
                  <td>{formattaDataOra(modifica.data)}</td>
                  <td>{modifica.utente}</td>
                  <td>
                    <span className={`badge ${modifica.tipoModifica.toLowerCase()}`}>
                      {modifica.tipoModifica}
                    </span>
                  </td>
                  <td>{modifica.dettagli}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="nessun-risultato">
            <p>Nessuna modifica trovata con i filtri selezionati.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default StoricoModifiche;
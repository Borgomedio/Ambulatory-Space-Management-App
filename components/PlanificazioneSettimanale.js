// components/PlanificazioneSettimanale.js
import React, { useState } from 'react';
import '../styles/Pianificazione.css';

function PlanificazioneSettimanale({ spazi, ambulatori, pianificazione, onUpdatePrenotazione, sedi }) {
  const [filtroSede, setFiltroSede] = useState(0); // 0 = tutte le sedi
  const [giornoSelezionato, setGiornoSelezionato] = useState('Lunedì');
  const [prenotazioneAttiva, setPrenotazioneAttiva] = useState(null);
  
  const giorni = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì'];
  const ore = [];
  
  // Ore di lavoro dalle 8 alle 16 (8 ore)
  for (let i = 8; i < 16; i++) {
    ore.push(`${i}:00-${i+1}:00`);
  }
  
  // Filtra gli spazi in base alla sede selezionata
  const spaziFiltrati = filtroSede === 0 
    ? spazi 
    : spazi.filter(spazio => spazio.sedeId === filtroSede);
  
  const handleApriModale = (giorno, ora, spazioId) => {
    setPrenotazioneAttiva({
      giorno,
      ora,
      spazioId,
      ambulatorioId: pianificazione[giorno][ora][spazioId] ? pianificazione[giorno][ora][spazioId].id : null
    });
  };
  
  const handleChiudiModale = () => {
    setPrenotazioneAttiva(null);
  };
  
  const handleSalvaPrenotazione = () => {
    const { giorno, ora, spazioId, ambulatorioId } = prenotazioneAttiva;
    const ambulatorioSelezionato = ambulatorioId ? ambulatori.find(a => a.id === ambulatorioId) : null;
    
    onUpdatePrenotazione(giorno, ora, spazioId, ambulatorioSelezionato);
    handleChiudiModale();
  };
  
  return (
    <div className="pianificazione">
      <header className="pianificazione-header">
        <h1>Pianificazione Settimanale</h1>
        <div className="pianificazione-filtri">
          <div className="filtro-sede">
            <label>Sede:</label>
            <select value={filtroSede} onChange={(e) => setFiltroSede(parseInt(e.target.value))}>
              <option value={0}>Tutte le sedi</option>
              {sedi.map(sede => (
                <option key={sede.id} value={sede.id}>{sede.nome}</option>
              ))}
            </select>
          </div>
          <div className="filtro-giorno">
            <label>Giorno:</label>
            <div className="giorni-tabs">
              {giorni.map(giorno => (
                <button 
                  key={giorno} 
                  className={`giorno-tab ${giorno === giornoSelezionato ? 'active' : ''}`}
                  onClick={() => setGiornoSelezionato(giorno)}
                >
                  {giorno}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>
      
      <div className="pianificazione-tabella">
        <div className="tabella-header">
          <div className="tabella-ora-header">Ora</div>
          {spaziFiltrati.map(spazio => (
            <div key={spazio.id} className="tabella-spazio-header">
              <div className="spazio-nome">{spazio.nome}</div>
              <div className="spazio-sede">{spazio.sedeName}</div>
            </div>
          ))}
        </div>
        
        <div className="tabella-body">
          {ore.map(ora => (
            <div key={ora} className="tabella-row">
              <div className="tabella-ora">{ora}</div>
              {spaziFiltrati.map(spazio => {
                const prenotazione = pianificazione[giornoSelezionato][ora][spazio.id];
                return (
                  <div 
                    key={spazio.id} 
                    className={`tabella-cella ${prenotazione ? 'occupato' : 'libero'}`}
                    // components/PlanificazioneSettimanale.js (continuazione)
                    style={{ backgroundColor: prenotazione ? prenotazione.colore : 'transparent' }}
                    onClick={() => handleApriModale(giornoSelezionato, ora, spazio.id)}
                  >
                    {prenotazione && (
                      <div className="prenotazione-info">
                        <div className="prenotazione-nome">{prenotazione.nome}</div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      
      {prenotazioneAttiva && (
        <div className="modale-container">
          <div className="modale-content">
            <div className="modale-header">
              <h2>Gestisci Prenotazione</h2>
              <button className="chiudi-modale" onClick={handleChiudiModale}>×</button>
            </div>
            
            <div className="modale-body">
              <div className="modale-info">
                <p><strong>Giorno:</strong> {prenotazioneAttiva.giorno}</p>
                <p><strong>Ora:</strong> {prenotazioneAttiva.ora}</p>
                <p><strong>Spazio:</strong> {spazi.find(s => s.id === prenotazioneAttiva.spazioId).nome}</p>
                <p><strong>Sede:</strong> {spazi.find(s => s.id === prenotazioneAttiva.spazioId).sedeName}</p>
              </div>
              
              <div className="modale-form">
                <label>Ambulatorio:</label>
                <select 
                  value={prenotazioneAttiva.ambulatorioId || ''}
                  onChange={(e) => setPrenotazioneAttiva({
                    ...prenotazioneAttiva,
                    ambulatorioId: e.target.value ? parseInt(e.target.value) : null
                  })}
                >
                  <option value="">-- Libero --</option>
                  {ambulatori.map(ambulatorio => (
                    <option key={ambulatorio.id} value={ambulatorio.id}>{ambulatorio.nome}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="modale-footer">
              <button className="btn-annulla" onClick={handleChiudiModale}>Annulla</button>
              <button className="btn-salva" onClick={handleSalvaPrenotazione}>Salva</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PlanificazioneSettimanale;


// components/Dashboard.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Dashboard.css';

function Dashboard({ utente, spazi, pianificazione }) {
  // Calcola statistiche per la dashboard
  const calcolaStatistiche = () => {
    let totalePrenotazioni = 0;
    let prenotazioniSede1 = 0;
    let prenotazioniSede2 = 0;
    
    // Conta le prenotazioni per sede
    Object.keys(pianificazione).forEach(giorno => {
      Object.keys(pianificazione[giorno]).forEach(ora => {
        Object.keys(pianificazione[giorno][ora]).forEach(spazioId => {
          if (pianificazione[giorno][ora][spazioId]) {
            totalePrenotazioni++;
            if (spazioId.startsWith('1-')) {
              prenotazioniSede1++;
            } else {
              prenotazioniSede2++;
            }
          }
        });
      });
    });
    
    // Calcola la percentuale di occupazione
    const totaleSlot = Object.keys(pianificazione).length * 
                        Object.keys(pianificazione['Lunedì']).length * 
                        Object.keys(pianificazione['Lunedì']['8:00-9:00']).length;
    
    const percentualeOccupazione = (totalePrenotazioni / totaleSlot) * 100;
    
    return {
      totalePrenotazioni,
      prenotazioniSede1,
      prenotazioniSede2,
      percentualeOccupazione: percentualeOccupazione.toFixed(1)
    };
  };
  
  const statistiche = calcolaStatistiche();
  
  // Ottieni gli appuntamenti di oggi
  const oggi = new Date();
  const giorniSettimana = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];
  const giornoOggi = giorniSettimana[oggi.getDay()];
  
  // Se oggi è weekend, mostra il lunedì come esempio
  const giornoDaMostrare = (giornoOggi === 'Domenica' || giornoOggi === 'Sabato') ? 'Lunedì' : giornoOggi;
  
  const prenotazioniOggi = [];
  
  if (pianificazione[giornoDaMostrare]) {
    Object.keys(pianificazione[giornoDaMostrare]).forEach(ora => {
      Object.keys(pianificazione[giornoDaMostrare][ora]).forEach(spazioId => {
        if (pianificazione[giornoDaMostrare][ora][spazioId]) {
          const spazioInfo = spazi.find(s => s.id === spazioId);
          prenotazioniOggi.push({
            ora,
            ambulatorio: pianificazione[giornoDaMostrare][ora][spazioId].nome,
            spazio: spazioInfo.nome,
            sede: spazioInfo.sedeName,
            colore: pianificazione[giornoDaMostrare][ora][spazioId].colore
          });
        }
      });
    });
  }
  
  // Ordina le prenotazioni per ora
  prenotazioniOggi.sort((a, b) => {
    const oraA = parseInt(a.ora.split(':')[0]);
    const oraB = parseInt(b.ora.split(':')[0]);
    return oraA - oraB;
  });
  
  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Benvenuto, {utente.nome}</h1>
        <p>{new Date().toLocaleDateString('it-IT', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </header>
      
      <div className="dashboard-content">
        <div className="dashboard-stats">
          <div className="stat-card">
            <h3>Prenotazioni totali</h3>
            <div className="stat-value">{statistiche.totalePrenotazioni}</div>
          </div>
          <div className="stat-card">
            <h3>Ospedale Centrale</h3>
            <div className="stat-value">{statistiche.prenotazioniSede1}</div>
          </div>
          <div className="stat-card">
            <h3>Poliambulatorio San Matteo</h3>
            <div className="stat-value">{statistiche.prenotazioniSede2}</div>
          </div>
          <div className="stat-card">
            <h3>Occupazione totale</h3>
            <div className="stat-value">{statistiche.percentualeOccupazione}%</div>
          </div>
        </div>
        
        <div className="dashboard-actions">
          <Link to="/pianificazione" className="action-card">
            <h3>Pianificazione Settimanale</h3>
            <p>Gestisci gli orari degli ambulatori</p>
          </Link>
          <Link to="/reportistica" className="action-card">
            <h3>Reportistica</h3>
            <p>Analizza l'occupazione degli spazi</p>
          </Link>
          <Link to="/storico" className="action-card">
            <h3>Storico Modifiche</h3>
            <p>Visualizza le modifiche effettuate</p>
          </Link>
        </div>
        
        <div className="dashboard-appointments">
          <h2>Appuntamenti di {giornoDaMostrare}</h2>
          {prenotazioniOggi.length > 0 ? (
            <div className="appointments-list">
              {prenotazioniOggi.map((prenotazione, index) => (
                <div className="appointment-card" key={index}>
                  <div className="appointment-time">{prenotazione.ora}</div>
                  <div 
                    className="appointment-specialty" 
                    style={{ backgroundColor: prenotazione.colore }}
                  >
                    {prenotazione.ambulatorio}
                  </div>
                  <div className="appointment-details">
                    <span>{prenotazione.spazio}</span>
                    <span>{prenotazione.sede}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>Nessun appuntamento programmato per oggi.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
// App.js - Componente principale dell'applicazione
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import PlanificazioneSettimanale from './components/PlanificazioneSettimanale';
import Reportistica from './components/Reportistica';
import StoricoModifiche from './components/StoricoModifiche';
import Navbar from './components/Navbar';
import './styles/App.css';

// Dati di esempio per l'applicazione
const sediOspedaliere = [
  { id: 1, nome: "Ospedale Centrale" },
  { id: 2, nome: "Poliambulatorio San Matteo" }
];

const ambulatori = [
  { id: 1, nome: "Cardiologia", colore: "#FF5252" },
  { id: 2, nome: "Oculistica", colore: "#448AFF" },
  { id: 3, nome: "Ortopedia", colore: "#66BB6A" },
  { id: 4, nome: "Dermatologia", colore: "#FFA726" },
  { id: 5, nome: "Neurologia", colore: "#AB47BC" },
  { id: 6, nome: "Pneumologia", colore: "#26C6DA" },
  { id: 7, nome: "Endocrinologia", colore: "#EC407A" },
  { id: 8, nome: "Urologia", colore: "#7E57C2" },
  { id: 9, nome: "Ginecologia", colore: "#FF7043" },
  { id: 10, nome: "Gastroenterologia", colore: "#5C6BC0" },
  { id: 11, nome: "Ematologia", colore: "#29B6F6" },
  { id: 12, nome: "Geriatria", colore: "#9CCC65" }
];

// Utenti di test per l'autenticazione
const utenti = [
  { 
    id: 1, 
    username: "admin", 
    password: "admin123", 
    nome: "Mario Rossi", 
    ruolo: "Amministratore", 
    avatar: "https://i.pravatar.cc/150?img=60" 
  },
  { 
    id: 2, 
    username: "medico", 
    password: "medico123", 
    nome: "Giulia Bianchi", 
    ruolo: "Medico", 
    avatar: "https://i.pravatar.cc/150?img=32" 
  },
  { 
    id: 3, 
    username: "segreteria", 
    password: "segreteria123", 
    nome: "Luca Verdi", 
    ruolo: "Segreteria", 
    avatar: "https://i.pravatar.cc/150?img=11" 
  }
];

// Funzione per generare i dati iniziali per gli spazi
const generaDatiIniziali = () => {
  const spazi = [];
  
  // Per ogni sede ospedaliera
  sediOspedaliere.forEach(sede => {
    // Creiamo 10 spazi per sede
    for (let i = 1; i <= 10; i++) {
      spazi.push({
        id: `${sede.id}-${i}`,
        nome: `Ambulatorio ${i}`,
        sedeId: sede.id,
        sedeName: sede.nome
      });
    }
  });
  
  return spazi;
};

// Funzione per generare una pianificazione iniziale vuota
const generaPianificazioneVuota = () => {
  const pianificazione = {};
  const spazi = generaDatiIniziali();
  const giorni = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì'];
  const ore = [];
  
  // Ore di lavoro dalle 8 alle 16 (8 ore)
  for (let i = 8; i < 16; i++) {
    ore.push(`${i}:00-${i+1}:00`);
  }
  
  giorni.forEach(giorno => {
    pianificazione[giorno] = {};
    
    ore.forEach(ora => {
      pianificazione[giorno][ora] = {};
      
      spazi.forEach(spazio => {
        pianificazione[giorno][ora][spazio.id] = null;
      });
    });
  });
  
  return pianificazione;
};

// Funzione per generare una pianificazione di esempio
const generaPianificazioneEsempio = () => {
  const pianificazione = generaPianificazioneVuota();
  const spazi = generaDatiIniziali();
  
  // Esempi di assegnazioni casuali per mostrare come funziona
  // Sede 1, Ambulatorio 1
  pianificazione['Lunedì']['8:00-9:00']['1-1'] = ambulatori[0]; // Cardiologia
  pianificazione['Lunedì']['9:00-10:00']['1-1'] = ambulatori[0]; // Cardiologia
  pianificazione['Martedì']['8:00-9:00']['1-1'] = ambulatori[1]; // Oculistica
  pianificazione['Mercoledì']['10:00-11:00']['1-1'] = ambulatori[2]; // Ortopedia
  
  // Sede 1, Ambulatorio 2
  pianificazione['Lunedì']['8:00-9:00']['1-2'] = ambulatori[3]; // Dermatologia
  pianificazione['Lunedì']['9:00-10:00']['1-2'] = ambulatori[3]; // Dermatologia
  pianificazione['Martedì']['14:00-15:00']['1-2'] = ambulatori[4]; // Neurologia
  
  // Sede 1, Ambulatorio 3
  pianificazione['Lunedì']['10:00-11:00']['1-3'] = ambulatori[5]; // Pneumologia
  pianificazione['Mercoledì']['8:00-9:00']['1-3'] = ambulatori[6]; // Endocrinologia
  
  // Sede 2, Ambulatorio 1
  pianificazione['Martedì']['8:00-9:00']['2-1'] = ambulatori[7]; // Urologia
  pianificazione['Giovedì']['10:00-11:00']['2-1'] = ambulatori[8]; // Ginecologia
  
  // Sede 2, Ambulatorio 2
  pianificazione['Venerdì']['14:00-15:00']['2-2'] = ambulatori[9]; // Gastroenterologia
  pianificazione['Lunedì']['15:00-16:00']['2-2'] = ambulatori[10]; // Ematologia
  
  return pianificazione;
};

// Funzione per generare uno storico modifiche di esempio
const generaStoricoEsempio = () => {
  return [
    {
      id: 1,
      data: new Date('2025-04-22T10:30:00'),
      utente: 'Mario Rossi',
      tipoModifica: 'Aggiunta',
      dettagli: 'Aggiunto ambulatorio di Cardiologia il Lunedì dalle 8:00 alle 9:00, Ambulatorio 1, Ospedale Centrale'
    },
    {
      id: 2,
      data: new Date('2025-04-22T11:15:00'),
      utente: 'Mario Rossi',
      tipoModifica: 'Aggiunta',
      dettagli: 'Aggiunto ambulatorio di Oculistica il Martedì dalle 8:00 alle 9:00, Ambulatorio 1, Ospedale Centrale'
    },
    {
      id: 3,
      data: new Date('2025-04-23T09:20:00'),
      utente: 'Giulia Bianchi',
      tipoModifica: 'Modifica',
      dettagli: 'Modificato ambulatorio da Neurologia a Pneumologia il Lunedì dalle 10:00 alle 11:00, Ambulatorio 3, Ospedale Centrale'
    },
    {
      id: 4,
      data: new Date('2025-04-23T14:45:00'),
      utente: 'Luca Verdi',
      tipoModifica: 'Eliminazione',
      dettagli: 'Eliminato ambulatorio di Ginecologia il Venerdì dalle 9:00 alle 10:00, Ambulatorio 5, Poliambulatorio San Matteo'
    },
    {
      id: 5,
      data: new Date('2025-04-24T08:10:00'),
      utente: 'Mario Rossi',
      tipoModifica: 'Aggiunta',
      dettagli: 'Aggiunto ambulatorio di Urologia il Martedì dalle 8:00 alle 9:00, Ambulatorio 1, Poliambulatorio San Matteo'
    }
  ];
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [utenteCorrente, setUtenteCorrente] = useState(null);
  const [spazi, setSpazi] = useState(generaDatiIniziali());
  const [pianificazione, setPianificazione] = useState(generaPianificazioneEsempio());
  const [storicoModifiche, setStoricoModifiche] = useState(generaStoricoEsempio());
  
  const handleLogin = (username, password) => {
    const utente = utenti.find(u => u.username === username && u.password === password);
    if (utente) {
      setUtenteCorrente(utente);
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };
  
  const handleLogout = () => {
    setIsAuthenticated(false);
    setUtenteCorrente(null);
  };
  
  const aggiungiModifica = (tipoModifica, dettagli) => {
    const nuovaModifica = {
      id: storicoModifiche.length + 1,
      data: new Date(),
      utente: utenteCorrente.nome,
      tipoModifica,
      dettagli
    };
    
    setStoricoModifiche([nuovaModifica, ...storicoModifiche]);
  };
  
  const aggiornaPrenotazione = (giorno, ora, spazioId, ambulatorio) => {
    // Crea una copia profonda della pianificazione attuale
    const nuovaPianificazione = JSON.parse(JSON.stringify(pianificazione));
    
    // Determina il tipo di modifica (aggiunta, modifica o eliminazione)
    let tipoModifica;
    let dettagli;
    const spazioCorrente = spazi.find(s => s.id === spazioId);
    
    if (!pianificazione[giorno][ora][spazioId] && ambulatorio) {
      tipoModifica = 'Aggiunta';
      dettagli = `Aggiunto ambulatorio di ${ambulatorio.nome} il ${giorno} dalle ${ora.split('-')[0]} alle ${ora.split('-')[1]}, ${spazioCorrente.nome}, ${spazioCorrente.sedeName}`;
    } else if (pianificazione[giorno][ora][spazioId] && ambulatorio) {
      tipoModifica = 'Modifica';
      dettagli = `Modificato ambulatorio da ${pianificazione[giorno][ora][spazioId].nome} a ${ambulatorio.nome} il ${giorno} dalle ${ora.split('-')[0]} alle ${ora.split('-')[1]}, ${spazioCorrente.nome}, ${spazioCorrente.sedeName}`;
    } else {
      tipoModifica = 'Eliminazione';
      dettagli = `Eliminato ambulatorio di ${pianificazione[giorno][ora][spazioId].nome} il ${giorno} dalle ${ora.split('-')[0]} alle ${ora.split('-')[1]}, ${spazioCorrente.nome}, ${spazioCorrente.sedeName}`;
    }
    
    // Aggiorna la pianificazione
    nuovaPianificazione[giorno][ora][spazioId] = ambulatorio;
    setPianificazione(nuovaPianificazione);
    
    // Registra la modifica nello storico
    aggiungiModifica(tipoModifica, dettagli);
  };
  
  return (
    <Router>
      <div className="app">
        {isAuthenticated && <Navbar utente={utenteCorrente} onLogout={handleLogout} />}
        <div className="content">
          <Routes>
            <Route path="/login" element={
              !isAuthenticated ? 
              <Login onLogin={handleLogin} /> : 
              <Navigate to="/dashboard" />
            } />
            <Route path="/dashboard" element={
              isAuthenticated ? 
              <Dashboard utente={utenteCorrente} spazi={spazi} pianificazione={pianificazione} /> : 
              <Navigate to="/login" />
            } />
            <Route path="/pianificazione" element={
              isAuthenticated ? 
              <PlanificazioneSettimanale 
                spazi={spazi} 
                ambulatori={ambulatori} 
                pianificazione={pianificazione} 
                onUpdatePrenotazione={aggiornaPrenotazione} 
                sedi={sediOspedaliere}
              /> : 
              <Navigate to="/login" />
            } />
            <Route path="/reportistica" element={
              isAuthenticated ? 
              <Reportistica 
                spazi={spazi} 
                ambulatori={ambulatori} 
                pianificazione={pianificazione} 
                sedi={sediOspedaliere}
              /> : 
              <Navigate to="/login" />
            } />
            <Route path="/storico" element={
              isAuthenticated ? 
              <StoricoModifiche storico={storicoModifiche} /> : 
              <Navigate to="/login" />
            } />
            <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
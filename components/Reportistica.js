// components/Reportistica.js
import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import '../styles/Reportistica.css';

function Reportistica({ spazi, ambulatori, pianificazione, sedi }) {
  const [filtroSede, setFiltroSede] = useState(0); // 0 = tutte le sedi
  const [filtroTipo, setFiltroTipo] = useState('ambulatorio'); // ambulatorio o spazio
  
  // Funzione per calcolare l'occupazione per ambulatorio
  const calcolaOccupazionePerAmbulatorio = () => {
    const occupazione = {};
    
    // Inizializza l'occupazione per ogni ambulatorio
    ambulatori.forEach(ambulatorio => {
      occupazione[ambulatorio.id] = {
        id: ambulatorio.id,
        nome: ambulatorio.nome,
        colore: ambulatorio.colore,
        ore: 0
      };
    });
    
    // Conta le ore occupate per ogni ambulatorio
    Object.keys(pianificazione).forEach(giorno => {
      Object.keys(pianificazione[giorno]).forEach(ora => {
        Object.keys(pianificazione[giorno][ora]).forEach(spazioId => {
          const prenotazione = pianificazione[giorno][ora][spazioId];
          
          // Filtra per sede se necessario
          if (filtroSede !== 0 && !spazioId.startsWith(`${filtroSede}-`)) {
            return;
          }
          
          if (prenotazione) {
            occupazione[prenotazione.id].ore += 1;
          }
        });
      });
    });
    
    // Converte l'oggetto in un array per il grafico e ordina per ore decrescenti
    return Object.values(occupazione)
      .filter(item => item.ore > 0)
      .sort((a, b) => b.ore - a.ore);
  };
  
  // Funzione per calcolare l'occupazione per spazio
  const calcolaOccupazionePerSpazio = () => {
    const occupazione = {};
    
    // Inizializza l'occupazione per ogni spazio
    spazi.forEach(spazio => {
      // Filtra per sede se necessario
      if (filtroSede !== 0 && spazio.sedeId !== filtroSede) {
        return;
      }
      
      occupazione[spazio.id] = {
        id: spazio.id,
        nome: `${spazio.nome} (${spazio.sedeName})`,
        ore: 0,
        oreDisponibili: Object.keys(pianificazione).length * Object.keys(pianificazione['Lunedì']).length,
        percentuale: 0
      };
    });
    
    // Conta le ore occupate per ogni spazio
    Object.keys(pianificazione).forEach(giorno => {
      Object.keys(pianificazione[giorno]).forEach(ora => {
        Object.keys(pianificazione[giorno][ora]).forEach(spazioId => {
          // Filtra per sede se necessario
          if (filtroSede !== 0 && !spazioId.startsWith(`${filtroSede}-`)) {
            return;
          }
          
          if (pianificazione[giorno][ora][spazioId] && occupazione[spazioId]) {
            occupazione[spazioId].ore += 1;
          }
        });
      });
    });
    
    // Calcola la percentuale di occupazione
    Object.keys(occupazione).forEach(spazioId => {
      occupazione[spazioId].percentuale = (occupazione[spazioId].ore / occupazione[spazioId].oreDisponibili) * 100;
    });
    
    // Converte l'oggetto in un array per il grafico
    return Object.values(occupazione).sort((a, b) => b.percentuale - a.percentuale);
  };
  
  // Funzione per calcolare l'occupazione per giorno
  const calcolaOccupazionePerGiorno = () => {
    const occupazione = {};
    
    // Inizializza l'occupazione per ogni giorno
    Object.keys(pianificazione).forEach(giorno => {
      occupazione[giorno] = {
        giorno,
        oreOccupate: 0,
        oreDisponibili: Object.keys(pianificazione[giorno]['8:00-9:00']).length * Object.keys(pianificazione[giorno]).length,
        percentuale: 0
      };
      
      // Filtra per sede se necessario
      if (filtroSede !== 0) {
        occupazione[giorno].oreDisponibili = Object.keys(pianificazione[giorno]['8:00-9:00'])
          .filter(spazioId => spazioId.startsWith(`${filtroSede}-`)).length * Object.keys(pianificazione[giorno]).length;
      }
    });
    
    // Conta le ore occupate per ogni giorno
    Object.keys(pianificazione).forEach(giorno => {
      Object.keys(pianificazione[giorno]).forEach(ora => {
        Object.keys(pianificazione[giorno][ora]).forEach(spazioId => {
          // Filtra per sede se necessario
          if (filtroSede !== 0 && !spazioId.startsWith(`${filtroSede}-`)) {
            return;
          }
          
          if (pianificazione[giorno][ora][spazioId]) {
            occupazione[giorno].oreOccupate += 1;
          }
        });
      });
    });
    
    // Calcola la percentuale di occupazione
    Object.keys(occupazione).forEach(giorno => {
      occupazione[giorno].percentuale = (occupazione[giorno].oreOccupate / occupazione[giorno].oreDisponibili) * 100;
    });
    
    // Converte l'oggetto in un array per il grafico
    return Object.values(occupazione);
  };
  
  // Calcola i dati del grafico in base al tipo selezionato
  const datiGrafico = filtroTipo === 'ambulatorio' 
    ? calcolaOccupazionePerAmbulatorio() 
    : calcolaOccupazionePerSpazio();
  
  // Dati per il grafico dell'occupazione per giorno
  const datiOccupazioneGiorno = calcolaOccupazionePerGiorno();
  
  // Calcola l'occupazione media
  const calcolaOccupazioneMedia = () => {
    const occupazioneGiorno = calcolaOccupazionePerGiorno();
    
    let totalePercentuale = 0;
    occupazioneGiorno.forEach(giorno => {
      totalePercentuale += giorno.percentuale;
    });
    
    return (totalePercentuale / occupazioneGiorno.length).toFixed(1);
  };
  
  const occupazioneMedia = calcolaOccupazioneMedia();
  
  // Genera dati per il grafico a torta dell'occupazione complessiva
  const generaDatiTorta = () => {
    // Conta il totale delle ore disponibili e occupate
    let oreOccupate = 0;
    let oreDisponibili = 0;
    
    Object.keys(pianificazione).forEach(giorno => {
      Object.keys(pianificazione[giorno]).forEach(ora => {
        Object.keys(pianificazione[giorno][ora]).forEach(spazioId => {
          // Filtra per sede se necessario
          if (filtroSede !== 0 && !spazioId.startsWith(`${filtroSede}-`)) {
            return;
          }
          
          oreDisponibili += 1;
          if (pianificazione[giorno][ora][spazioId]) {
            oreOccupate += 1;
          }
        });
      });
    });
    
    return [
      { nome: 'Occupate', value: oreOccupate },
      { nome: 'Libere', value: oreDisponibili - oreOccupate }
    ];
  };
  
  const datiTorta = generaDatiTorta();
  const coloriTorta = ['#4caf50', '#f44336'];
  
  return (
    <div className="reportistica">
      <header className="reportistica-header">
        <h1>Reportistica</h1>
        <div className="reportistica-filtri">
          <div className="filtro-sede">
            <label>Sede:</label>
            <select value={filtroSede} onChange={(e) => setFiltroSede(parseInt(e.target.value))}>
              <option value={0}>Tutte le sedi</option>
              {sedi.map(sede => (
                <option key={sede.id} value={sede.id}>{sede.nome}</option>
              ))}
            </select>
          </div>
          <div className="filtro-tipo">
            <label>Visualizza per:</label>
            <select value={filtroTipo} onChange={(e) => setFiltroTipo(e.target.value)}>
              <option value="ambulatorio">Ambulatorio</option>
              <option value="spazio">Spazio</option>
            </select>
          </div>
        </div>
      </header>
      
      <div className="reportistica-container">
        <div className="occupazione-totale">
          <h2>Occupazione complessiva</h2>
          <div className="occupazione-stats">
            <div className="occupazione-media">
              <span className="stat-label">Occupazione media</span>
              <span className="stat-value">{occupazioneMedia}%</span>
            </div>
            <div className="occupazione-grafico">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={datiTorta}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ nome, percent }) => `${nome}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {datiTorta.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={coloriTorta[index % coloriTorta.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        
        <div className="occupazione-giorno">
          <h2>Occupazione per giorno</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={datiOccupazioneGiorno}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="giorno" />
              <YAxis label={{ value: 'Percentuale (%)', angle: -90, position: 'insideLeft' }} />
              <Tooltip formatter={(value) => [`${value.toFixed(1)}%`, 'Occupazione']} />
              <Legend />
              <Bar dataKey="percentuale" name="Occupazione" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="occupazione-dettaglio">
          <h2>
            {filtroTipo === 'ambulatorio' ? 'Occupazione per ambulatorio' : 'Occupazione per spazio'}
          </h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={datiGrafico}
              margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
              layout="vertical"
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis 
                type="category" 
                dataKey="nome" 
                width={150}
                tick={{ fontSize: 12 }}
              />
              <Tooltip />
              <Legend />
              <Bar 
                dataKey={filtroTipo === 'ambulatorio' ? 'ore' : 'percentuale'} 
                name={filtroTipo === 'ambulatorio' ? 'Ore occupate' : 'Percentuale occupazione'}
                fill={filtroTipo === 'ambulatorio' ? "#none" : "#8884d8"}
              >
                {filtroTipo === 'ambulatorio' && datiGrafico.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.colore} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default Reportistica;
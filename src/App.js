import React, { useState } from 'react';
import './App.css';
import confetti from 'canvas-confetti';

function App() {
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(10);
  const [quantidade, setQuantidade] = useState(1);
  const [resultado, setResultado] = useState([]);
  const [usarContador, setUsarContador] = useState(false);
  const [permitirRepeticao, setPermitirRepeticao] = useState(false);
  const [contador, setContador] = useState(0);
  const [esperando, setEsperando] = useState(false);
  const [historico, setHistorico] = useState([]);
  const [modo, setModo] = useState('numeros');
  const [listaNomes, setListaNomes] = useState('');
  const [tema, setTema] = useState('light');

  const alternarTema = (e) => setTema(e.target.value);

  const adicionarAoHistorico = (novo) => {
    setHistorico((prev) => [...prev, novo]);
  };

  const limparHistorico = () => {
    setHistorico([]);
  };

  const resetarTudo = () => {
    setMin(1);
    setMax(10);
    setQuantidade(1);
    setResultado([]);
    setContador(0);
    setEsperando(false);
    setHistorico([]);
    setListaNomes('');
    setModo('numeros');
  };

  const executarSorteioNumeros = () => {
    const minNum = parseInt(min);
    const maxNum = parseInt(max);
    const qtd = parseInt(quantidade);

    if (isNaN(minNum) || isNaN(maxNum) || isNaN(qtd) || minNum >= maxNum || qtd <= 0) {
      alert('Informe valores válidos. Mínimo < Máximo e Quantidade > 0.');
      return;
    }

    const intervalo = maxNum - minNum + 1;
    if (!permitirRepeticao && qtd > intervalo) {
      alert(`Não é possível sortear ${qtd} números únicos entre ${minNum} e ${maxNum}.`);
      return;
    }

    const numeros = permitirRepeticao ? [] : new Set();
    while (permitirRepeticao ? numeros.length < qtd : numeros.size < qtd) {
      const n = Math.floor(Math.random() * intervalo) + minNum;
      permitirRepeticao ? numeros.push(n) : numeros.add(n);
    }

    const resultadoFinal = permitirRepeticao ? numeros : [...numeros];
    setResultado(resultadoFinal);
    adicionarAoHistorico(resultadoFinal);
    confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 } });
  };

  const executarSorteioNomes = () => {
    const nomes = listaNomes.split(/[\n,]+/).map((n) => n.trim()).filter(Boolean);

    if (nomes.length < quantidade) {
      alert('Quantidade maior que o número de nomes disponíveis.');
      return;
    }

    const sorteados = [];
    const copia = [...nomes];

    while (sorteados.length < quantidade) {
      const index = Math.floor(Math.random() * copia.length);
      sorteados.push(copia.splice(index, 1)[0]);
    }

    setResultado(sorteados);
    adicionarAoHistorico(sorteados);
    confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 } });
  };

  const iniciarContagem = () => {
    setEsperando(true);
    setResultado([]);
    let tempo = 3;
    setContador(tempo);

    const interval = setInterval(() => {
      tempo--;
      setContador(tempo);
      if (tempo === 0) {
        clearInterval(interval);
        modo === 'numeros' ? executarSorteioNumeros() : executarSorteioNomes();
        setEsperando(false);
      }
    }, 1000);
  };

  const sortearNumero = () => {
    if (usarContador) iniciarContagem();
    else modo === 'numeros' ? executarSorteioNumeros() : executarSorteioNomes();
  };

  return (
    <div className={`app-root ${tema}`}>
      <div className="container">
        <h1 className="title">🎲 App de Sorteio</h1>

        <div className="select-tema">
          <label>🎨 Tema:
            <select value={tema} onChange={alternarTema}>
              <option value="light">Claro</option>
              <option value="dark">Escuro</option>
              <option value="cyberpunk">Cyberpunk</option>
              <option value="retro">Retrô</option>
            </select>
          </label>
        </div>

        <div className="modo-container">
          <label><input type="radio" value="numeros" checked={modo === 'numeros'} onChange={() => setModo('numeros')} /> Modo Números</label>
          <label><input type="radio" value="nomes" checked={modo === 'nomes'} onChange={() => setModo('nomes')} /> Modo Nomes</label>
        </div>

        {modo === 'numeros' && (
          <div className="inputs">
            <label>De:<input type="number" value={min} onChange={(e) => setMin(e.target.value)} className="input" /></label>
            <label>Até:<input type="number" value={max} onChange={(e) => setMax(e.target.value)} className="input" /></label>
            <label>Quantidade:<input type="number" value={quantidade} onChange={(e) => setQuantidade(e.target.value)} className="input" /></label>
          </div>
        )}

        {modo === 'nomes' && (
          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontWeight: 'bold' }}>Lista de nomes (um por linha ou separados por vírgula):</label>
            <textarea rows={4} value={listaNomes} onChange={(e) => setListaNomes(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc', marginTop: '5px' }} />
            <label>Quantidade a sortear:<input type="number" value={quantidade} onChange={(e) => setQuantidade(e.target.value)} className="input" style={{ width: '100px', marginTop: '10px' }} /></label>
          </div>
        )}

        <div className="checkbox-container">
          <label><input type="checkbox" checked={usarContador} onChange={() => setUsarContador(!usarContador)} /> Usar contador</label>
          {modo === 'numeros' && (
            <label><input type="checkbox" checked={permitirRepeticao} onChange={() => setPermitirRepeticao(!permitirRepeticao)} /> Permitir repetição</label>
          )}
        </div>

        <div className="actions">
          <button onClick={sortearNumero} className="button" disabled={esperando}>Sortear</button>
          <button onClick={resetarTudo} className="button danger">Resetar</button>
        </div>

        {esperando && contador > 0 && <div className="contador"><h2>Contando: {contador}...</h2></div>}

        {resultado.length > 0 && !esperando && (
          <div className="resultado">
            <h2>Resultado:</h2>
            <ul>{resultado.map((item, idx) => <li key={idx}>{item}</li>)}</ul>
          </div>
        )}

        {historico.length > 0 && (
          <div className="resultado">
            <h2>Histórico:</h2>
            <ul>{historico.map((res, idx) => <li key={idx}>{res.join(', ')}</li>)}</ul>
            <button onClick={limparHistorico} className="button danger">Limpar Histórico</button>
          </div>
        )}

        <footer className="footer">
          <p>Desenvolvido por <strong>DevJPMello</strong></p>
          <div className="social-links">
            <a href="https://github.com/devJPMello" target="_blank" rel="noopener noreferrer">
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" alt="GitHub" />
            </a>
            <a href="https://www.linkedin.com/in/joao-pedro-mendes-de-mello/" target="_blank" rel="noopener noreferrer">
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linkedin/linkedin-original.svg" alt="LinkedIn" />
            </a>
          </div>
        </footer>
      </div>
      </div>
      );
}

      export default App;

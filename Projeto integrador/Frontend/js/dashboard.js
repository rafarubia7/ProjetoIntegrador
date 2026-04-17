/**
 * Módulo do Dashboard
 * Exibe temperatura e umidade atuais, e gráfico de temperatura.
 */

const URL_API = 'http://10.110.12.73:1880/api/leituras';
const URL_WS = 'ws://10.110.12.73:1880/ws/leituras';

const elementoValorTemperatura = document.getElementById('valorTemperaturaAtual');
const elementoValorUmidade = document.getElementById('valorUmidadeAtual');
const canvas = document.getElementById('graficoTemperatura');
const ctx = canvas ? canvas.getContext('2d') : null;

let graficoTemperatura = null;
let ws = null;
let leiturasCache = [];

const formatarHorario = (dataISO) => {
    const data = new Date(dataISO);
    return data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
};

const buscarLeituras = async () => {
    try {
        const resposta = await fetch(URL_API);
        if (!resposta.ok) throw new Error(`Erro HTTP ${resposta.status}`);
        return await resposta.json();
    } catch (erro) {
        console.error('Falha ao buscar leituras:', erro);
        return [];
    }
};

const atualizarInterface = (leituras) => {
    if (!leituras || leituras.length === 0) {
        if (elementoValorTemperatura) elementoValorTemperatura.textContent = '-- °C';
        if (elementoValorUmidade) elementoValorUmidade.textContent = '-- %';
        return;
    }

    // Ordena por data/hora
    const leiturasOrdenadas = [...leituras].sort((a, b) => new Date(a.datahora) - new Date(b.datahora));

    // Última leitura
    const ultima = leiturasOrdenadas[leiturasOrdenadas.length - 1];
    
    if (elementoValorTemperatura) {
        elementoValorTemperatura.textContent = `${parseFloat(ultima.temperatura).toFixed(1)} °C`;
    }
    if (elementoValorUmidade) {
        elementoValorUmidade.textContent = `${parseFloat(ultima.umidade).toFixed(1)} %`;
    }

    // Atualiza gráfico se existir
    if (ctx) {
        const rotulos = leiturasOrdenadas.map(l => formatarHorario(l.datahora));
        const valoresTemperatura = leiturasOrdenadas.map(l => parseFloat(l.temperatura));

        if (graficoTemperatura) graficoTemperatura.destroy();

        graficoTemperatura = new Chart(ctx, {
            type: 'line',
            data: {
                labels: rotulos,
                datasets: [{
                    label: 'Temperatura (°C)',
                    data: valoresTemperatura,
                    borderColor: '#f97316',
                    backgroundColor: 'rgba(249, 115, 22, 0.1)',
                    borderWidth: 2,
                    tension: 0.2,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    x: { 
                        grid: { display: false },
                        ticks: { maxRotation: 45, minRotation: 45 }
                    },
                    y: {
                        beginAtZero: false,
                        grid: { color: '#e2e8f0' }
                    }
                }
            }
        });
    }
};

const conectarWebSocket = () => {
    try {
        ws = new WebSocket(URL_WS);
        
        ws.onopen = () => {
            console.log('WebSocket conectado');
        };
        
        ws.onmessage = (evento) => {
            try {
                const novaLeitura = JSON.parse(evento.data);
                console.log('📡 Nova leitura:', novaLeitura);
                
                leiturasCache.push(novaLeitura);
                if (leiturasCache.length > 100) {
                    leiturasCache.shift();
                }
                
                atualizarInterface(leiturasCache);
            } catch (erro) {
                console.error('Erro WebSocket:', erro);
            }
        };
        
        ws.onerror = (erro) => {
            console.error('Erro WebSocket:', erro);
        };
        
        ws.onclose = () => {
            console.log('WebSocket desconectado, reconectando...');
            setTimeout(conectarWebSocket, 5000);
        };
    } catch (erro) {
        console.error('Erro ao conectar WebSocket:', erro);
    }
};

const carregarDashboard = async () => {
    if (elementoValorTemperatura) elementoValorTemperatura.textContent = 'Carregando...';
    if (elementoValorUmidade) elementoValorUmidade.textContent = 'Carregando...';
    
    leiturasCache = await buscarLeituras();
    atualizarInterface(leiturasCache);
};

const verificarAutenticacao = () => {
    const usuarioLogado = localStorage.getItem('usuarioLogado');
    if (!usuarioLogado) {
        window.location.href = '../index.html';
    }
};

document.addEventListener('DOMContentLoaded', () => {
    console.log('Dashboard inicializado');
    verificarAutenticacao();
    carregarDashboard();
    conectarWebSocket();
    
    setInterval(carregarDashboard, 30000);
});
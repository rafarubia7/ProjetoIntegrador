/**
 * Módulo de Login - VERSÃO SOMENTE API
 * Força o uso da API do Node-RED/MySQL
 */

console.log('login.js carregado - MODO API');

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM carregado');
    
    const formulario = document.getElementById('formularioLogin');
    const campoUsuario = document.getElementById('usuario');
    const campoSenha = document.getElementById('senha');
    const botaoEntrar = document.getElementById('botaoEntrar');
    
    if (!formulario || !campoUsuario || !campoSenha) {
        console.error('Elementos não encontrados');
        return;
    }
    
    const URL_API = 'http://10.110.12.73:1880/api/login';
    
    // Função que faz login via API
    async function fazerLoginAPI(usuario, senha) {
        console.log('Tentando login na API:', usuario);
        
        try {
            const response = await fetch(URL_API, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    usuario: usuario, 
                    senha: senha 
                })
            });
            
            console.log('📡 Status da resposta:', response.status);
            
            const dados = await response.json();
            console.log(' Dados recebidos:', dados);
            
            return dados;
            
        } catch (erro) {
            console.error('Erro na API:', erro);
            return { 
                success: false, 
                error: 'Erro de conexão com o servidor' 
            };
        }
    }
    
    // Evento de submit
    formulario.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const usuario = campoUsuario.value.trim();
        const senha = campoSenha.value;
        
        console.log(' Tentando login com:', usuario);
        
        if (!usuario || !senha) {
            alert('Preencha todos os campos');
            return;
        }
        
        // Desabilita botão
        botaoEntrar.disabled = true;
        botaoEntrar.textContent = 'Entrando...';
        
        try {
            // Chama a API
            const resultado = await fazerLoginAPI(usuario, senha);
            
            if (resultado.success) {
                console.log('Login aprovado pela API!');
                
                // Salva dados do usuário
                localStorage.setItem('usuarioLogado', JSON.stringify(resultado.user));
                
                // Redireciona
                window.location.href = 'html/dashboard.html';
            } else {
                alert(resultado.error || 'Usuário ou senha inválidos');
            }
            
        } catch (erro) {
            console.error('Erro:', erro);
            alert('Erro ao processar login');
        } finally {
            botaoEntrar.disabled = false;
            botaoEntrar.textContent = 'Entrar';
        }
    });
    
    console.log('Sistema de login configurado (API apenas)');
});
        // Função global de login
        function fazerLogin(event) {
            event.preventDefault();
            
            console.log('FUNÇÃO FAZERLOGIN EXECUTADA');
            
            // Pega os campos
            const campoUsuario = document.getElementById('usuario');
            const campoSenha = document.getElementById('senha');
            
            if (!campoUsuario || !campoSenha) {
                alert('Erro: Campos não encontrados!');
                return false;
            }
            
            // Pega os valores
            const usuario = campoUsuario.value.trim();
            const senha = campoSenha.value;
            
            console.log('Usuário:', usuario);
            console.log('Senha:', senha ? '***' : '(vazia)');
            
            // Validação
            if (!usuario || !senha) {
                alert('Por favor, preencha todos os campos.');
                return false;
            }
            
            // Verifica credenciais
            if (usuario === 'admin@sensora.com' && senha === '123456') {
                console.log('LOGIN APROVADO! Redirecionando...');
                
                // Salva sessão
                const dadosUsuario = {
                    id: 1,
                    nome: 'Administrador',
                    email: usuario,
                    loginTime: new Date().toISOString()
                };
                
                localStorage.setItem('usuarioLogado', JSON.stringify(dadosUsuario));
                console.log('Dados salvos:', dadosUsuario);
                
                // Redireciona
                window.location.href = 'html/dashboard.html';
                return true;
            } else {
                alert('Usuário ou senha inválidos.\n\nUse:\nEmail: admin@sensora.com\nSenha: 123456');
                return false;
            }
        }
        
        // Aguarda o DOM carregar
        document.addEventListener('DOMContentLoaded', function() {
            console.log('PÁGINA CARREGADA');
            console.log('Campos preenchidos automaticamente para teste');
            
            // Garante que os campos estão preenchidos
            const userField = document.getElementById('usuario');
            const passField = document.getElementById('senha');
            
            if (userField) userField.value = 'admin@sensora.com';
            if (passField) passField.value = '123456';
            
            console.log('Campos inicializados');
        });
        
        // Expondo função globalmente
        window.fazerLogin = fazerLogin;
        
        console.log('SISTEMA DE LOGIN CARREGADO');
        console.log('Dica: Use admin@sensora.com / 123456');

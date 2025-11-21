<script>
    // 1. Função para exibir o nome dos arquivos (mantida do código anterior)
    document.getElementById('gabarito').addEventListener('change', function(e) {
        const fileName = e.target.files[0] ? e.target.files[0].name : 'Nenhum arquivo escolhido';
        document.getElementById('gabarito-file-name').textContent = fileName;
    });

    document.getElementById('respostas').addEventListener('change', function(e) {
        const fileName = e.target.files[0] ? e.target.files[0].name : 'Nenhum arquivo escolhido';
        document.getElementById('respostas-file-name').textContent = fileName;
    });

    // 2. Lógica de Submissão AJAX/Fetch para o NestJS
    const form = document.querySelector('form');
    const resultadoDiv = document.getElementById('resultado-correcao');
    const btnSubmit = document.querySelector('.btn-submit');

    form.addEventListener('submit', async function(event) {
        // Impede o envio padrão do formulário, que recarregaria a página
        event.preventDefault(); 
        
        // Esconde resultados anteriores e prepara a exibição
        resultadoDiv.style.display = 'none';
        btnSubmit.textContent = 'Corrigindo...';
        btnSubmit.disabled = true;

        // Cria um objeto FormData para empacotar os arquivos
        const formData = new FormData(form);

        try {
            // Envia a requisição POST para o endpoint do NestJS
            const response = await fetch('/correcao', {
                method: 'POST',
                // O Fetch API lida automaticamente com o header 'Content-Type: multipart/form-data'
                // quando você envia um objeto FormData
                body: formData, 
            });

            const data = await response.json();

            // 3. Trata a resposta do NestJS
            if (response.ok) {
                // Sucesso (Status 200, 201, etc.)
                const { acertos, totalQuestoes, porcentagem } = data.resultado;

                resultadoDiv.style.backgroundColor = '#d4edda'; // Verde claro para sucesso
                resultadoDiv.style.color = '#155724'; // Texto escuro
                resultadoDiv.innerHTML = `
                    <h4>✅ Correção Finalizada com Sucesso!</h4>
                    <p><strong>Gabarito:</strong> ${data.gabaritoNome}</p>
                    <p><strong>Respostas do Aluno:</strong> ${data.respostasNome}</p>
                    <hr style="border-top: 1px solid #c3e6cb;">
                    <p><strong>Resultado:</strong> ${acertos} acertos de ${totalQuestoes} questões.</p>
                    <p><strong>Aproveitamento:</strong> ${porcentagem.toFixed(2)}%</p>
                `;
            } else {
                // Erro (Status 4xx, 5xx)
                const errorMessage = data.message || 'Erro desconhecido ao processar a correção.';
                
                resultadoDiv.style.backgroundColor = '#f8d7da'; // Vermelho claro para erro
                resultadoDiv.style.color = '#721c24'; // Texto escuro
                resultadoDiv.innerHTML = `
                    <h4>❌ Erro na Correção</h4>
                    <p>${errorMessage}</p>
                `;
            }

        } catch (error) {
            // Erro de rede/conexão
            resultadoDiv.style.backgroundColor = '#fff3cd'; // Amarelo claro para alerta
            resultadoDiv.style.color = '#856404'; // Texto escuro
            resultadoDiv.innerHTML = `
                <h4>⚠️ Erro de Conexão</h4>
                <p>Não foi possível conectar ao servidor de correção. Tente novamente.</p>
            `;
            console.error('Erro de Fetch:', error);
        } finally {
            // Restaura o botão
            resultadoDiv.style.display = 'block';
            btnSubmit.textContent = 'Corrigir Prova';
            btnSubmit.disabled = false;
        }
    });
</script>
document.addEventListener("DOMContentLoaded", function () {
    const salarioMinimo = 1320; // Salário mínimo vigente (atualize conforme necessário)
    const despesasFixasContainer = document.getElementById("despesasFixasContainer");
    const despesasVariaveisContainer = document.getElementById("despesasVariaveisContainer");
    let contadorFixa = 1;
    let contadorVariavel = 1;

    document.getElementById("adicionarDespesaFixa").addEventListener("click", function () {
        contadorFixa++;
        const novaDespesa = `
            <div class="despesa">
                <label for="descricaoFixa${contadorFixa}">Descrição:</label>
                <input type="text" id="descricaoFixa${contadorFixa}" placeholder="Ex.: Conta de Luz">
                <label for="valorFixa${contadorFixa}">Valor:</label>
                <input type="number" id="valorFixa${contadorFixa}" placeholder="Ex.: 200">
            </div>
        `;
        despesasFixasContainer.insertAdjacentHTML("beforeend", novaDespesa);
    });

    document.getElementById("adicionarDespesaVariavel").addEventListener("click", function () {
        contadorVariavel++;
        const novaDespesa = `
            <div class="despesa">
                <label for="descricaoVariavel${contadorVariavel}">Descrição:</label>
                <input type="text" id="descricaoVariavel${contadorVariavel}" placeholder="Ex.: Restaurante">
                <label for="valorVariavel${contadorVariavel}">Valor:</label>
                <input type="number" id="valorVariavel${contadorVariavel}" placeholder="Ex.: 100">
            </div>
        `;
        despesasVariaveisContainer.insertAdjacentHTML("beforeend", novaDespesa);
    });

    document.getElementById("questionario").addEventListener("submit", function (event) {
        event.preventDefault();

        const renda = parseFloat(document.getElementById("renda").value);
        const despesasFixas = Array.from(despesasFixasContainer.querySelectorAll("input[type='number']"))
            .map(input => parseFloat(input.value) || 0);
        const despesasVariaveis = Array.from(despesasVariaveisContainer.querySelectorAll("input[type='number']"))
            .map(input => parseFloat(input.value) || 0);

        const totalDespesasFixas = despesasFixas.reduce((a, b) => a + b, 0);
        const totalDespesasVariaveis = despesasVariaveis.reduce((a, b) => a + b, 0);
        const rendaLiquida = renda - totalDespesasFixas - totalDespesasVariaveis;

        // Classificação da renda líquida
        let nivelRendaLiquida = "";
        if (rendaLiquida > 3 * salarioMinimo) {
            nivelRendaLiquida = "Alta";
        } else if (rendaLiquida > 1.5 * salarioMinimo) {
            nivelRendaLiquida = "Média";
        } else {
            nivelRendaLiquida = "Baixa";
        }

        // Gerar dicas e manobras financeiras
        const dicas = gerarDicas();
        const manobras = gerarManobras(renda, totalDespesasFixas, totalDespesasVariaveis, rendaLiquida, salarioMinimo);

        const resultado = document.getElementById("resultado");
        resultado.innerHTML = `
            <h2>Resumo Financeiro</h2>
            <p>Renda: R$ ${renda.toFixed(2)}</p>
            <p>Total de Despesas Fixas: R$ ${totalDespesasFixas.toFixed(2)}</p>
            <p>Total de Despesas Variáveis: R$ ${totalDespesasVariaveis.toFixed(2)}</p>
            <p>Renda Líquida: R$ ${rendaLiquida.toFixed(2)} (${nivelRendaLiquida})</p>
            <div>
                <h3>Dicas Gerais</h3>
                ${dicas}
                <h3>Manobras Financeiras</h3>
                ${manobras}
            </div>
        `;

        const ctx = document.getElementById("grafico").getContext("2d");
        new Chart(ctx, {
            type: "pie",
            data: {
                labels: ["Despesas Fixas", "Despesas Variáveis", "Renda Líquida"],
                datasets: [{
                    data: [totalDespesasFixas, totalDespesasVariaveis, rendaLiquida > 0 ? rendaLiquida : 0],
                    backgroundColor: ["#007bff", "#28a745", "#ffc107"]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top'
                    }
                }
            }
        });
    });

    function gerarDicas() {
        return `
            <ul>
                <li>Crie uma reserva de emergência equivalente a 6 meses de despesas mensais.</li>
                <li>Monitore seus gastos diários para evitar desperdícios.</li>
                <li>Estabeleça metas financeiras de curto, médio e longo prazo.</li>
                <li>Invista em educação financeira para melhorar sua gestão de dinheiro.</li>
                <li>Considere fontes de renda extra, como freelances ou vendas online.</li>
            </ul>
        `;
    }

    function gerarManobras(renda, totalFixas, totalVariaveis, rendaLiquida, salarioMinimo) {
        const estrategias = [
            { nome: "50/30/20", descricao: "50% para necessidades, 30% para desejos, 20% para investimentos.", relevancia: calcularRelevancia(totalFixas, renda, 0.5) },
            { nome: "70/20/10", descricao: "70% para viver, 20% para investir, 10% para lazer.", relevancia: calcularRelevancia(totalFixas, renda, 0.7) },
            { nome: "Reserva de Emergência", descricao: "Crie uma reserva equivalente a 6 meses de despesas mensais.", relevancia: rendaLiquida > 0 ? 90 : 50 },
            { nome: "Redução de Gastos Supérfluos", descricao: "Revise e elimine despesas desnecessárias.", relevancia: totalVariaveis > 0.3 * renda ? 85 : 70 },
            { nome: "Aumente Sua Renda", descricao: "Considere alternativas para gerar renda extra.", relevancia: rendaLiquida < salarioMinimo ? 95 : 50 }
        ];

        estrategias.sort((a, b) => b.relevancia - a.relevancia);

        let html = "<ul>";
        estrategias.forEach(estrategia => {
            html += `<li><strong>${estrategia.nome}:</strong> ${estrategia.descricao} - <em>Eficácia: ${estrategia.relevancia}%</em></li>`;
        });
        html += "</ul>";
        return html;
    }

    function calcularRelevancia(totalFixas, renda, proporcaoIdeal) {
        return Math.max(0, Math.min(100, 100 - Math.abs((totalFixas / renda - proporcaoIdeal) * 100)));
    }
});

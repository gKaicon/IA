// --- Funções Auxiliares ---

/**
 * Converte uma string binária para um número decimal.
 * @param {string} bin - String binária.
 * @returns {number} O valor decimal.
 */
function binarioParaDecimal(bin) {
    return parseInt(bin, 2);
}

/**
 * Decodifica um valor decimal para um número real dentro de um intervalo.
 * Assume que o cromossomo tem 5 bits para cada variável (x1 e x2).
 * @param {number} decimal - Valor decimal do segmento do cromossomo.
 * @param {number} xmin - Valor mínimo do intervalo.
 * @param {number} xmax - Valor máximo do intervalo.
 * @returns {number} O valor real decodificado.
 */
function decodificar(decimal, xmin, xmax) {
    const numBits = 5; // Cada parte do cromossomo (x1 e x2) tem 5 bits
    const maxDecimal = Math.pow(2, numBits) - 1;
    return xmin + (xmax - xmin) * (decimal / maxDecimal);
}

/**
 * Avalia a função objetivo f(x1, x2).
 * @param {number} x1 - Valor da primeira variável.
 * @param {number} x2 - Valor da segunda variável.
 * @returns {number} O valor de f(x1, x2).
 */
function avaliarFuncao(x1, x2) {
    return 0.25 * Math.pow(x1, 4) - 3 * Math.pow(x1, 3) + 11 * Math.pow(x1, 2) - 13 * x1 +
           0.25 * Math.pow(x2, 4) - 3 * Math.pow(x2, 3) + 11 * Math.pow(x2, 2) - 13 * x2;
}

/**
 * Gera um indivíduo aleatório (cromossomo) de 10 bits.
 * @returns {string} O cromossomo gerado.
 */
function gerarIndividuo() {
    // Gera um número inteiro aleatório entre 0 e 2^10 - 1 (1023)
    const randomNumber = Math.floor(Math.random() * Math.pow(2, 10));
    // Converte para binário e preenche com zeros à esquerda para ter 10 bits
    return randomNumber.toString(2).padStart(10, '0');
}

/**
 * Aplica mutação a um cromossomo com base em uma taxa de mutação.
 * Cada bit tem uma chance de ser mutado.
 * @param {string} cromossomo - O cromossomo a ser mutado.
 * @param {number} taxaMutacao - A probabilidade de mutação para cada bit (ex: 0.05).
 * @returns {string} O cromossomo mutado.
 */
function mutacao(cromossomo, taxaMutacao = 0.05) {
    let cromossomoMutado = Array.from(cromossomo); // Converte string para array para mutação
    for (let i = 0; i < cromossomoMutado.length; i++) {
        if (Math.random() < taxaMutacao) { // Se um número aleatório for menor que a taxa, muta o bit
            cromossomoMutado[i] = cromossomoMutado[i] === "0" ? "1" : "0";
        }
    }
    return cromossomoMutado.join(''); // Retorna o array para string
}

/**
 * Seleciona um pai usando seleção por torneio.
 * Escolhe 2 indivíduos aleatórios e seleciona o melhor entre eles (menor fitness).
 * @param {string[]} populacao - Array de cromossomos.
 * @param {number[]} fitness - Array de valores de fitness correspondentes à população.
 * @returns {string} O cromossomo do pai selecionado.
 */
function selecionarPais(populacao, fitness) {
    let idx1 = Math.floor(Math.random() * populacao.length);
    let idx2 = Math.floor(Math.random() * populacao.length);

    // Garante que os índices sejam diferentes
    while (idx2 === idx1) {
        idx2 = Math.floor(Math.random() * populacao.length);
    }
    
    // Retorna o cromossomo do indivíduo com menor fitness (melhor)
    return fitness[idx1] < fitness[idx2] ? populacao[idx1] : populacao[idx2];
}

/**
 * Realiza a recombinação (crossover) de um ponto entre dois pais.
 * @param {string} pai1 - Cromossomo do primeiro pai.
 * @param {string} pai2 - Cromossomo do segundo pai.
 * @returns {string[]} Um array contendo os dois filhos gerados.
 */
function recombinar(pai1, pai2) {
    // Ponto de corte aleatório, excluindo as extremidades (1 a length-1)
    const pontoCorte = Math.floor(Math.random() * (pai1.length - 2)) + 1;

    const filho1 = pai1.substring(0, pontoCorte) + pai2.substring(pontoCorte);
    const filho2 = pai2.substring(0, pontoCorte) + pai1.substring(pontoCorte);
    
    return [filho1, filho2];
}

/**
 * Função para formatar números com vírgula para decimais.
 * @param {number} value - O número a ser formatado.
 * @param {number} precision - Número de casas decimais.
 * @returns {string} O número formatado como string.
 */
function formatNumber(value, precision) {
    return value.toFixed(precision).replace('.', ',');
}

// --- Lógica Principal do Algoritmo Genético ---

// Leitura de argumentos da linha de comando
const inputIteracoes = parseInt(process.argv[2]);
const inputTamanhoPop = parseInt(process.argv[3]);
const inputTaxaMutacao = parseFloat(process.argv[4]);

const iteracoes = isNaN(inputIteracoes) ? 5 : inputIteracoes;
const tamanhoPop = isNaN(inputTamanhoPop) ? 5 : inputTamanhoPop;
const taxaMutacao = isNaN(inputTaxaMutacao) ? 0.05 : inputTaxaMutacao;
const xmin = 0;
const xmax = 6;

const processos = {}; // Armazenará cada passo do processo para exibição

// Inicialização da população
let populacao = [];
for (let i = 0; i < tamanhoPop; i++) {
    populacao.push(gerarIndividuo());
}

let melhorIndividuo = "";
let melhorFx = Number.MAX_VALUE;

// Loop de gerações
for (let geracao = 1; geracao <= iteracoes; geracao++) {
    // Avaliação da população atual (fitness)
    const fitness = [];
    const detalhesPopulacao = [];
    
    populacao.forEach((cromossomo, indice) => {
        const x1bin = cromossomo.substring(0, 5);
        const x2bin = cromossomo.substring(5, 10);

        const dec1 = binarioParaDecimal(x1bin);
        const dec2 = binarioParaDecimal(x2bin);

        const x1 = decodificar(dec1, xmin, xmax);
        const x2 = decodificar(dec2, xmin, xmax);
        const fx = avaliarFuncao(x1, x2);
        fitness.push(fx);

        detalhesPopulacao.push({
            indice: indice,
            cromossomo: cromossomo,
            x1: formatNumber(x1, 4),
            x2: formatNumber(x2, 4),
            'f(x)': formatNumber(fx, 4)
        });

        if (fx < melhorFx) {
            melhorFx = fx;
            melhorIndividuo = cromossomo;
        }
    });
    
    // Armazenar estado atual da população para exibição
    processos[geracao] = {
        populacao: detalhesPopulacao,
        pares: [],
        filhos: []
    };
    
    // Criação da nova população
    let novaPopulacao = [];
    const elitismo = 1; // Número de melhores indivíduos que passam direto

    // Elitismo: Mantém os melhores indivíduos da geração atual
    if (elitismo > 0) {
        // Cria um array de objetos { index, fx } para ordenar
        const individuosComFitness = populacao.map((chromo, idx) => ({ chromo, fx: fitness[idx] }));
        // Ordena pelo fitness (menor é melhor)
        individuosComFitness.sort((a, b) => a.fx - b.fx);
        
        for (let i = 0; i < elitismo && i < individuosComFitness.length; i++) {
            novaPopulacao.push(individuosComFitness[i].chromo);
        }
    }
    
    // Preencher o restante da nova população através de seleção, recombinação e mutação
    while (novaPopulacao.length < tamanhoPop) {
        // Selecionar pais
        const pai1 = selecionarPais(populacao, fitness);
        const pai2 = selecionarPais(populacao, fitness);
        
        // Armazenar os pais selecionados para exibição
        processos[geracao].pares.push({
            cromossomo_pai1: pai1,
            cromossomo_pai2: pai2
        });
        
        // Recombinação
        const [filho1, filho2] = recombinar(pai1, pai2);
        
        // Mutação
        const filho1Mutado = mutacao(filho1, taxaMutacao);
        const filho2Mutado = mutacao(filho2, taxaMutacao);
        
        // Decodificar filhos para exibição
        const x1_f1 = decodificar(binarioParaDecimal(filho1Mutado.substring(0, 5)), xmin, xmax);
        const x2_f1 = decodificar(binarioParaDecimal(filho1Mutado.substring(5, 10)), xmin, xmax);
        const fx_f1 = avaliarFuncao(x1_f1, x2_f1);
        
        const x1_f2 = decodificar(binarioParaDecimal(filho2Mutado.substring(0, 5)), xmin, xmax);
        const x2_f2 = decodificar(binarioParaDecimal(filho2Mutado.substring(5, 10)), xmin, xmax);
        const fx_f2 = avaliarFuncao(x1_f2, x2_f2);
        
        // Armazenar os filhos gerados para exibição
        processos[geracao].filhos.push({
            filho1: {
                cromossomo: filho1Mutado,
                x1: formatNumber(x1_f1, 4),
                x2: formatNumber(x2_f1, 4),
                'f(x)': formatNumber(fx_f1, 4)
            },
            filho2: {
                cromossomo: filho2Mutado,
                x1: formatNumber(x1_f2, 4),
                x2: formatNumber(x2_f2, 4),
                'f(x)': formatNumber(fx_f2, 4)
            }
        });
        
        // Adicionar filhos à nova população (se houver espaço)
        if (novaPopulacao.length < tamanhoPop) {
            novaPopulacao.push(filho1Mutado);
        }
        if (novaPopulacao.length < tamanhoPop) {
            novaPopulacao.push(filho2Mutado);
        }
    }
    
    populacao = novaPopulacao; // A nova população se torna a população atual para a próxima geração
}

// --- Exibição dos Resultados no Terminal ---

console.log('--- Algoritmo Genético - Processo de Recombinação ---');
console.log(`Gerações: ${iteracoes}`);
console.log(`Tamanho da População: ${tamanhoPop}`);
console.log(`Taxa de Mutação: ${taxaMutacao}`);
console.log(`xmin: ${xmin}, xmax: ${xmax}`);

console.log('\n--- Melhor Indivíduo Encontrado ---');
const melhorX1Final = decodificar(binarioParaDecimal(melhorIndividuo.substring(0, 5)), xmin, xmax);
const melhorX2Final = decodificar(binarioParaDecimal(melhorIndividuo.substring(5, 10)), xmin, xmax);
console.log(`Cromossomo: ${melhorIndividuo}`);
console.log(`x1: ${formatNumber(melhorX1Final, 5)}`);
console.log(`x2: ${formatNumber(melhorX2Final, 5)}`);
console.log(`f(x): ${formatNumber(melhorFx, 5)}`);

console.log('\n--- Processo Evolutivo Detalhado ---');

for (const numGeracao in processos) {
    const geracao = processos[numGeracao];
    console.log(`\n--- Geração ${numGeracao} ---`);
    
    if (parseInt(numGeracao) === 1) { // Apenas para a primeira geração, mostrar população inicial
        console.log('\n  População Inicial:');
        console.log('  Indivíduo | Cromossomo |   x1   |   x2   |  f(x)  ');
        console.log('------------|------------|--------|--------|--------');
        geracao.populacao.forEach(individuo => {
            console.log(
                `  ${String(individuo.indice).padEnd(9)} | ${individuo.cromossomo.padEnd(10)} | ${individuo.x1.padEnd(6)} | ${individuo.x2.padEnd(6)} | ${individuo['f(x)'].padEnd(6)}`
            );
        });
    } else {
        // Para as demais gerações, mostramos a população resultante da geração anterior
        console.log('\n  População Resultante da Geração Anterior:');
        console.log('  Indivíduo | Cromossomo |   x1   |   x2   |  f(x)  ');
        console.log('------------|------------|--------|--------|--------');
        geracao.populacao.forEach(individuo => {
            console.log(
                `  ${String(individuo.indice).padEnd(9)} | ${individuo.cromossomo.padEnd(10)} | ${individuo.x1.padEnd(6)} | ${individuo.x2.padEnd(6)} | ${individuo['f(x)'].padEnd(6)}`
            );
        });
    }

    if (geracao.pares.length > 0) {
        console.log('\n  Processo de Recombinação:');
        geracao.pares.forEach((par, i) => {
            console.log(`    Cruzamento ${i + 1}:`);
            console.log(`      Pai 1: ${par.cromossomo_pai1}`);
            console.log(`      Pai 2: ${par.cromossomo_pai2}`);
            if (geracao.filhos[i]) {
                console.log(`      Filho 1: ${geracao.filhos[i].filho1.cromossomo} (f(x): ${geracao.filhos[i].filho1['f(x)']})`);
                console.log(`      Filho 2: ${geracao.filhos[i].filho2.cromossomo} (f(x): ${geracao.filhos[i].filho2['f(x)']})`);
            }
        });
    }
}
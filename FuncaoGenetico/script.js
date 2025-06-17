function calcularSaida(x, a, b, c) {
    return a * x * x + b * x + c;
}

function calcularAptidao(individuo, entradas, saidasEsperadas) {
    let erroTotal = 0;
    const [a, b, c] = individuo; 

    for (let i = 0; i < entradas.length; i++) {
        const saidaCalculada = calcularSaida(entradas[i], a, b, c);
        erroTotal += Math.abs(saidaCalculada - saidasEsperadas[i]); 
    }
    return erroTotal;
}

function criarIndividuo() {
        return [
        Math.floor(Math.random() * 21) - 10, // a: entre -10 e 10
        Math.floor(Math.random() * 21) - 10, // b: entre -10 e 10
        Math.floor(Math.random() * 21) - 10  // c: entre -10 e 10
    ];
}

function selecionarPais(populacao, entradas, saidasEsperadas, tamanhoTorneio = 3) {
    let pais = [];
    for (let i = 0; i < 2; i++) { 
        let melhoresCandidatos = [];
        for (let j = 0; j < tamanhoTorneio; j++) {
            const candidato = populacao[Math.floor(Math.random() * populacao.length)];
            melhoresCandidatos.push({ individuo: candidato, aptidao: calcularAptidao(candidato, entradas, saidasEsperadas) });
        }
        melhoresCandidatos.sort((x, y) => x.aptidao - y.aptidao);
        pais.push(melhoresCandidatos[0].individuo);
    }
    return pais;
}

function crossover(pai1, pai2) {
    const pontoCorte = Math.floor(Math.random() * pai1.length);
    let filho = [];
    for(let i = 0; i < pai1.length; i++){
        if(i < pontoCorte){
            filho.push(pai1[i]);
        } else {
            filho.push(pai2[i]);
        }
    }
    return filho;
}

function mutacao(individuo, taxaMutacao = 0.1) {
    if (Math.random() < taxaMutacao) {
        const indiceMutacao = Math.floor(Math.random() * individuo.length);
        individuo[indiceMutacao] = Math.floor(Math.random() * 21) - 10;
    }
    return individuo;
}

function algoritmoGenetico(entradas, saidasEsperadas, tamanhoPopulacao = 1000, geracoes = 1000, taxaMutacao = 0.55) {
    let populacao = [];
    for (let i = 0; i < tamanhoPopulacao; i++) {
        populacao.push(criarIndividuo());
    }

    let melhorIndividuo = null;
    let menorAptidao = Infinity;

    for (let geracao = 0; geracao < geracoes; geracao++) {
        let populacaoComAptidao = populacao.map(ind => ({
            individuo: ind,
            aptidao: calcularAptidao(ind, entradas, saidasEsperadas)
        }));

        populacaoComAptidao.sort((a, b) => a.aptidao - b.aptidao); 

        if (populacaoComAptidao[0].aptidao < menorAptidao) {
            melhorIndividuo = populacaoComAptidao[0].individuo;
            menorAptidao = populacaoComAptidao[0].aptidao;
            if (menorAptidao === 0) {
                console.log(`Solução encontrada na Geração ${geracao}: a=${melhorIndividuo[0]}, b=${melhorIndividuo[1]}, c=${melhorIndividuo[2]}`);
                return melhorIndividuo;
            }
        }

        let novaPopulacao = [];     
        const elitismo = Math.floor(tamanhoPopulacao * 0.1);
        for(let i = 0; i < elitismo; i++){
            novaPopulacao.push(populacaoComAptidao[i].individuo);
        }

        while (novaPopulacao.length < tamanhoPopulacao) {
            const [pai1, pai2] = selecionarPais(populacao, entradas, saidasEsperadas);
            let filho = crossover(pai1, pai2);
            filho = mutacao(filho, taxaMutacao);
            novaPopulacao.push(filho);
        }
        populacao = novaPopulacao;
    }

    console.log("---------------------------------------");
    console.log("Melhor solução encontrada após todas as gerações:");
    console.log(`Função: f(x) = ${melhorIndividuo[0]}x^2 + ${melhorIndividuo[1]}x + ${melhorIndividuo[2]}`);
    console.log(`Erro Total (Fitness): ${menorAptidao}`);
    return melhorIndividuo;
}

const args = process.argv.slice(2);

if (args.length !== 2) {
    console.log("Uso: node script.js \"[entrada1,entrada2,...]\" \"[saida1,saida2,...]\"");
    console.log("Exemplo: node script.js \"[0,1,2,3,4,5,6,7,8,9,10]\" \"[6,2,0,0,2,6,12,20,30,42,56]\"");
    process.exit(1);
}

try {
    const entradasStr = args[0];
    const saidasStr = args[1];
    const entradas = JSON.parse(entradasStr.replace(/'/g, '"'));
    const saidasEsperadas = JSON.parse(saidasStr.replace(/'/g, '"'));

    if (!Array.isArray(entradas) || !Array.isArray(saidasEsperadas) || entradas.length !== saidasEsperadas.length) {
        console.error("Erro: Os argumentos devem ser arrays válidos de mesmo tamanho.");
        process.exit(1);
    }

    console.log("Iniciando algoritmo genético para encontrar a função...");
    const [a, b, c] = algoritmoGenetico(entradas, saidasEsperadas);

    console.log("\n--- Resultado Final do Algoritmo Genético ---");
    console.log(`A função encontrada é: f(x) = ${a}x^2 + ${b}x + ${c}`);
    console.log("\nVerificando a função encontrada com os dados originais:");

    for (let i = 0; i < entradas.length; i++) {
        const saidaGenetico = calcularSaida(entradas[i], a, b, c);
        console.log(`Entrada: ${entradas[i]}, Esperada: ${saidasEsperadas[i]}, Calculada pelo AG: ${saidaGenetico}`);
    }

} catch (error) {
    console.error("Erro ao analisar os argumentos. Certifique-se de que são arrays JSON válidos.");
    console.error(error.message);
    process.exit(1);
}

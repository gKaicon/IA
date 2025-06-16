const MAX_GENERATIONS = 1000;
const POPULATION_SIZE = 200; // Tamanho da população de indivíduos
const MUTATION_RATE = 0.05; // Taxa de mutação (0 a 1)
const TOURNAMENT_SIZE = 5; // Tamanho do torneio para seleção
const ELITISM_COUNT = 2; // Quantos dos melhores indivíduos são passados diretamente para a próxima geração

const DENOMINATIONS = [100, 50, 25, 10, 5, 1]; // R$ 1,00, R$ 0,50, R$ 0,25, R$ 0,10, R$ 0,05, R$ 0,01


function createIndividual(targetAmount) {
    const individual = [];
    let currentAmount = 0;
    for (let i = 0; i < DENOMINATIONS.length; i++) {
        const maxCount = Math.floor((targetAmount - currentAmount) / DENOMINATIONS[i]) + 2; // Permite um pouco mais do que o necessário
        const count = Math.floor(Math.random() * (maxCount > 0 ? maxCount : 1));
        individual.push(count);
        currentAmount += count * DENOMINATIONS[i];
    }
    return individual;
}

function calculateIndividualValue(individual) {
    let total = 0;
    for (let i = 0; i < individual.length; i++) {
        total += individual[i] * DENOMINATIONS[i];
    }
    return total;
}

function countTotalCoins(individual) {
    return individual.reduce((sum, count) => sum + count, 0);
}

function calculateFitness(individual, targetAmount) {
    const value = calculateIndividualValue(individual);
    const difference = Math.abs(targetAmount - value);
    const totalCoins = countTotalCoins(individual);

    let fitness = 0;

    if (difference === 0) {
        fitness = 1000000 / (totalCoins + 1); // +1 para evitar divisão por zero
    } else {
        fitness = 1 / (difference * 10 + totalCoins); // Penaliza mais pela diferença
    }

    return fitness;
}

function tournamentSelection(population, targetAmount) {
    let bestIndividual = null;
    let bestFitness = -Infinity;

    for (let i = 0; i < TOURNAMENT_SIZE; i++) {
        const randomIndex = Math.floor(Math.random() * population.length);
        const candidate = population[randomIndex];
        const candidateFitness = calculateFitness(candidate, targetAmount);

        if (candidateFitness > bestFitness) {
            bestFitness = candidateFitness;
            bestIndividual = candidate;
        }
    }
    return bestIndividual;
}

function crossover(parent1, parent2) {
    const crossoverPoint = Math.floor(Math.random() * parent1.length);
    const child1 = parent1.slice(0, crossoverPoint).concat(parent2.slice(crossoverPoint));
    const child2 = parent2.slice(0, crossoverPoint).concat(parent1.slice(crossoverPoint));
    return [child1, child2];
}

function mutate(individual) {
    const mutatedIndividual = [...individual]; // Cria uma cópia para não alterar o original
    for (let i = 0; i < mutatedIndividual.length; i++) {
        if (Math.random() < MUTATION_RATE) {
            // Adiciona ou subtrai uma pequena quantidade aleatoriamente
            const change = Math.floor(Math.random() * 3) - 1; // -1, 0, ou 1
            mutatedIndividual[i] = Math.max(0, mutatedIndividual[i] + change); // Garante que a contagem não seja negativa
        }
    }
    return mutatedIndividual;
}

function geneticChangeAlgorithm(amount) {
    const targetAmount = Math.round(amount * 100); // Converte para centavos

    console.log(`Iniciando algoritmo genético para R$ ${amount.toFixed(2)} (${targetAmount} centavos)...`);

    let population = [];
    for (let i = 0; i < POPULATION_SIZE; i++) {
        population.push(createIndividual(targetAmount));
    }

    let bestOverallIndividual = null;
    let bestOverallFitness = -Infinity;

    for (let generation = 0; generation < MAX_GENERATIONS; generation++) {
        // Calcula a aptidão de cada indivíduo e encontra o melhor da geração
        const populationWithFitness = population.map(individual => ({
            individual: individual,
            fitness: calculateFitness(individual, targetAmount)
        }));

        // Ordena a população por aptidão (do melhor para o pior)
        populationWithFitness.sort((a, b) => b.fitness - a.fitness);

        const currentBest = populationWithFitness[0];

        if (currentBest.fitness > bestOverallFitness) {
            bestOverallFitness = currentBest.fitness;
            bestOverallIndividual = currentBest.individual;
            console.log(`Geração ${generation}: Melhor aptidão: ${bestOverallFitness.toFixed(2)}, Valor: ${calculateIndividualValue(bestOverallIndividual)}, Moedas: ${countTotalCoins(bestOverallIndividual)}`);

            // Se encontrarmos uma solução exata e com poucas moedas, podemos parar mais cedo
            if (calculateIndividualValue(bestOverallIndividual) === targetAmount && countTotalCoins(bestOverallIndividual) < 200) { // Limite arbitrário de moedas para considerar "bom"
                console.log("Solução ótima ou muito boa encontrada. Parando cedo.");
                break;
            }
        }

        // Cria a próxima geração
        const newPopulation = [];

        // Elitismo: Adiciona os melhores indivíduos da geração atual diretamente para a próxima
        for (let i = 0; i < ELITISM_COUNT; i++) {
            newPopulation.push(populationWithFitness[i].individual);
        }

        while (newPopulation.length < POPULATION_SIZE) {
            // Seleção de pais
            const parent1 = tournamentSelection(population, targetAmount);
            const parent2 = tournamentSelection(population, targetAmount);

            // Crossover
            const [child1, child2] = crossover(parent1, parent2);

            // Mutação
            newPopulation.push(mutate(child1));
            if (newPopulation.length < POPULATION_SIZE) {
                newPopulation.push(mutate(child2));
            }
        }
        population = newPopulation;
    }

    // Formata o resultado final
    const finalChange = {};
    if (bestOverallIndividual) {
        const bestValue = calculateIndividualValue(bestOverallIndividual);
        const difference = Math.abs(targetAmount - bestValue);

        if (difference !== 0) {
            console.warn(`Atenção: O algoritmo genético pode não ter encontrado a solução exata. Diferença: ${difference} centavos.`);
        }

        for (let i = 0; i < DENOMINATIONS.length; i++) {
            if (bestOverallIndividual[i] > 0) {
                const coinValueInReals = DENOMINATIONS[i] / 100;
                finalChange[coinValueInReals.toFixed(2).replace('.', ',')] = bestOverallIndividual[i];
            }
        }
    }

    return finalChange;
}

// --- Execução via linha de comando ---

const args = process.argv.slice(2);

if (args.length === 0) {
    console.log("Uso: node genetic_change.js <valor_do_troco>");
    console.log("Exemplo: node genetic_change.js 3.75");
    process.exit(1);
}

const valueToChange = parseFloat(args[0]);

if (isNaN(valueToChange) || valueToChange < 0) {
    console.error("Erro: O valor deve ser um número positivo.");
    process.exit(1);
}

console.time("Tempo de execução do AG");
const result = geneticChangeAlgorithm(valueToChange);
console.timeEnd("Tempo de execução do AG");

console.log("\nTroco (Algoritmo Genético):");
if (Object.keys(result).length === 0 && calculateIndividualValue(geneticChangeAlgorithm(valueToChange).bestOverallIndividual) !== Math.round(valueToChange * 100)) {
    console.log("Nenhuma solução aceitável encontrada ou valor muito pequeno.");
} else {
    for (const coinValue in result) {
        console.log(`${result[coinValue]} moeda(s) de R$ ${coinValue}`);
    }
    // Informações adicionais do melhor indivíduo encontrado
    const bestIndividualFromRun = geneticChangeAlgorithm(valueToChange); // Recalcula para pegar o indivíduo, não apenas o objeto final
    const totalCoinsInBest = countTotalCoins(bestIndividualFromRun.bestOverallIndividual || []);
    console.log(`Total de moedas usadas: ${totalCoinsInBest}`);
}
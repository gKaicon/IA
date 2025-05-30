// Function to convert a binary array to a decimal number
function binToDecimal(bits) {
    return parseInt(bits.join(''), 2);
}

// Function to decode the binary representation to a real number within a range
function decode(bin, x_min = 0, x_max = 6) {
    const n = bin.length;
    const decimal = binToDecimal(bin);
    const maxDecimal = Math.pow(2, n) - 1;
    return x_min + ((x_max - x_min) * decimal) / maxDecimal;
}

// The objective function f(x1, x2)
function fx(x1, x2) {
    return 0.25 * Math.pow(x1, 4) - 3 * Math.pow(x1, 3) + 11 * Math.pow(x1, 2) - 13 * x1 +
           0.25 * Math.pow(x2, 4) - 3 * Math.pow(x2, 3) + 11 * Math.pow(x2, 2) - 13 * x2;
}

// Function to generate a random individual (chromosome)
function gerarIndividuo() {
    const cromossomo = [];
    for (let i = 0; i < 10; i++) {
        cromossomo.push(Math.round(Math.random())); // Generates 0 or 1
    }
    return cromossomo;
}

// Main execution logic for the genetic algorithm
function runGeneticAlgorithm(iterations = 1000) {
    let melhor_fx = Number.MAX_VALUE;
    let melhor_individuo = [];
    const historico = [];

    for (let i = 0; i < iterations; i++) {
        const individuo = gerarIndividuo();
        const x1_bits = individuo.slice(0, 5);
        const x2_bits = individuo.slice(5, 10);
        const x1 = decode(x1_bits);
        const x2 = decode(x2_bits);
        const fx_valor = fx(x1, x2);

        historico.push({
            cromossomo: individuo.join(''),
            x1: x1,
            x2: x2,
            fx: fx_valor
        });

        if (fx_valor < melhor_fx) {
            melhor_fx = fx_valor;
            melhor_individuo = individuo;
        }
    }

    const melhor_x1 = decode(melhor_individuo.slice(0, 5));
    const melhor_x2 = decode(melhor_individuo.slice(5, 10));

    return {
        melhor_individuo: melhor_individuo,
        melhor_x1: melhor_x1,
        melhor_x2: melhor_x2,
        melhor_fx: melhor_fx,
        historico: historico,
        iteracoes: iterations
    };
}

// Get the number of iterations from command line arguments
// process.argv[0] is 'node', process.argv[1] is the script name
const inputIterations = parseInt(process.argv[2]);
const iterations = isNaN(inputIterations) ? 1000 : inputIterations; // Default to 1000 if not provided or invalid

const results = runGeneticAlgorithm(iterations);

// Display results in the terminal
console.log('--- Melhor Indivíduo Encontrado ---');
console.log(`Cromossomo: ${results.melhor_individuo.join('')}`);
console.log(`x1: ${results.melhor_x1.toFixed(6)}`);
console.log(`x2: ${results.melhor_x2.toFixed(6)}`);
console.log(`f(x): ${results.melhor_fx.toFixed(6)}`);
console.log('\n--- Histórico das Iterações ---');
console.log(`Número de Iterações: ${results.iteracoes}\n`);

console.log('  #  | Cromossomo  |    x1    |    x2    |    f(x)    ');
console.log('-----|-------------|----------|----------|------------');
results.historico.forEach((linha, index) => {
    console.log(
        `${String(index + 1).padStart(3, ' ')}  | ${linha.cromossomo}  | ${linha.x1.toFixed(6)} | ${linha.x2.toFixed(6)} | ${linha.fx.toFixed(6)}`
    );
});
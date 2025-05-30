// Function to convert binary string to decimal
function binarioParaDecimal(bin) {
    return parseInt(bin, 2);
}

// Function to decode the decimal value to a real number within a range
function decodificar(decimal, xmin, xmax) {
    // Here we use 5 bits for x1 and x2, so max decimal value for 5 bits is 2^5 - 1 = 31
    const maxDecimal = Math.pow(2, 5) - 1;
    return xmin + (xmax - xmin) * (decimal / maxDecimal);
}

// The objective function f(x1, x2)
function avaliarFuncao(x1, x2) {
    return 0.25 * Math.pow(x1, 4) - 3 * Math.pow(x1, 3) + 11 * Math.pow(x1, 2) - 13 * x1 +
           0.25 * Math.pow(x2, 4) - 3 * Math.pow(x2, 3) + 11 * Math.pow(x2, 2) - 13 * x2;
}

// Function to generate a random 10-bit individual (chromosome)
function gerarIndividuo() {
    // Generate a random integer between 0 and 1023 (inclusive), which is 2^10 - 1
    const randomNumber = Math.floor(Math.random() * 1024);
    // Convert to binary string and pad with leading zeros to ensure 10 bits
    return randomNumber.toString(2).padStart(10, '0');
}

// Function for mutation
function mutacao(cromossomo) {
    const pos = Math.floor(Math.random() * 10); // Random position from 0 to 9
    const originalChar = cromossomo[pos];
    const newChar = originalChar === "0" ? "1" : "0";
    return cromossomo.substring(0, pos) + newChar + cromossomo.substring(pos + 1);
}

// --- Main Execution Logic ---

// Get arguments from the command line: iterations and population size
// process.argv[0] is 'node', process.argv[1] is the script name
const inputIteracoes = parseInt(process.argv[2]);
const inputTamanhoPop = parseInt(process.argv[3]);

const iteracoes = isNaN(inputIteracoes) ? 1000 : inputIteracoes;
const tamanhoPop = isNaN(inputTamanhoPop) ? 5 : inputTamanhoPop;
const xmin = 0;
const xmax = 6;

let temMenorQue4 = false;
const historico = [];

let populacao = [];
for (let i = 0; i < tamanhoPop; i++) {
    populacao.push(gerarIndividuo());
}

let melhorIndividuo = "";
let melhorFx = Number.MAX_VALUE;

for (let i = 1; i <= iteracoes; i++) {
    // Create a new population for the next generation, or just iterate through current if not evolving
    // For this example, we iterate through the existing population without selection/crossover
    // If you were implementing full GA, you'd generate a new `populacao` here for the next iteration
    // based on fitness, crossover, and mutation.

    for (let indice = 0; indice < populacao.length; indice++) {
        const cromossomo = populacao[indice];
        const x1bin = cromossomo.substring(0, 5);
        const x2bin = cromossomo.substring(5, 10);

        const dec1 = binarioParaDecimal(x1bin);
        const dec2 = binarioParaDecimal(x2bin);

        const x1 = decodificar(dec1, xmin, xmax);
        const x2 = decodificar(dec2, xmin, xmax);
        const fx = avaliarFuncao(x1, x2);

        const response = (x1 + x2).toFixed(4).replace('.', ','); // Format to match PHP's number_format output

        if (fx < 4) {
            temMenorQue4 = true;
        }

        historico.push({
            iteracao: `${i}.${indice}`,
            cromossomo: cromossomo,
            x1bin: x1bin,
            x2bin: x2bin,
            dec1: dec1,
            dec2: dec2,
            x1: x1.toFixed(4).replace('.', ','),
            x2: x2.toFixed(4).replace('.', ','),
            'f(x)': fx.toFixed(4).replace('.', ','),
            response: response
        });

        if (fx < melhorFx) {
            melhorFx = fx;
            melhorIndividuo = cromossomo;
        }
    }
    // Simple "evolution": just re-generate population for next iteration (or implement selection/crossover)
    // If you want a more proper GA, you'd apply selection/crossover here
    if (i < iteracoes) { // Don't regenerate on the last iteration
        populacao = [];
        for (let k = 0; k < tamanhoPop; k++) {
            populacao.push(gerarIndividuo());
        }
    }
}

// Mutação no melhor indivíduo encontrado
const mutado = mutacao(melhorIndividuo);
const x1mut = decodificar(binarioParaDecimal(mutado.substring(0, 5)), xmin, xmax);
const x2mut = decodificar(binarioParaDecimal(mutado.substring(5, 10)), xmin, xmax);
const fxmut = avaliarFuncao(x1mut, x2mut);
if (fxmut < 4) {
    temMenorQue4 = true;
}

// --- Display Results in Terminal ---
console.log('--- Resultados do Algoritmo Genético ---');
console.log(`Iterações: ${iteracoes}`);
console.log(`Tamanho da População: ${tamanhoPop}`);
console.log(`xmin: ${xmin}, xmax: ${xmax}`);
console.log(`Existe f(x) menor que 4 em algum ponto: ${temMenorQue4 ? 'Sim' : 'Não'}`);

console.log('\n--- Melhor Indivíduo ---');
console.log(`Cromossomo: ${melhorIndividuo}`);
console.log(`x1: ${decodificar(binarioParaDecimal(melhorIndividuo.substring(0, 5)), xmin, xmax).toFixed(5).replace('.', ',')}`);
console.log(`x2: ${decodificar(binarioParaDecimal(melhorIndividuo.substring(5, 5)), xmin, xmax).toFixed(5).replace('.', ',')}`);
console.log(`f(x): ${melhorFx.toFixed(5).replace('.', ',')}`);

console.log('\n--- Mutação do Melhor Indivíduo ---');
console.log(`Novo Cromossomo: ${mutado}`);
console.log(`f(x) Após Mutação: ${fxmut.toFixed(5).replace('.', ',')}`);

console.log('\n--- Histórico de Iterações ---');
console.log('Iteração | Cromossomo | x1 (bin) | x1 (dec) | x1 (norm) | x2 (bin) | x2 (dec) | x2 (norm) |    f(x)    | Response');
console.log('---------|------------|----------|----------|-----------|----------|----------|-----------|------------|---------');

historico.forEach(h => {
    console.log(
        `${h.iteracao.padEnd(8)} | ${h.cromossomo.padEnd(10)} | ${h.x1bin.padEnd(8)} | ${String(h.dec1).padEnd(8)} | ${h.x1.padEnd(9)} | ${h.x2bin.padEnd(8)} | ${String(h.dec2).padEnd(8)} | ${h.x2.padEnd(9)} | ${h['f(x)'].padEnd(10)} | ${h.response.padEnd(8)}`
    );
});
// greedy_change.js

function getChange(amount) {    
    const denominations = [20, 11, 5, 1]; // Moedas em centavos

    let remainingAmount = Math.round(amount * 100); // Converte o valor de entrada para centavos e arredonda
    const change = {};

    console.log(`Calculando troco para R$ ${amount.toFixed(2)} (${remainingAmount} centavos)...`);

    for (const coin of denominations) {
        if (remainingAmount >= coin) {
            const count = Math.floor(remainingAmount / coin);
            if (count > 0) {
                // Adiciona a moeda ao objeto de troco
                // Convertendo de volta para reais para exibir.
                const coinValueInReals = coin / 100;
                change[coinValueInReals.toFixed(2).replace('.', ',')] = count;
                remainingAmount -= count * coin;
            }
        }
    }

    if (remainingAmount > 0) {
        console.warn("Atenção: Não foi possível dar o troco exato com as moedas disponíveis. Restam:", remainingAmount, "centavos.");
    }

    return change;
}

const args = process.argv.slice(2); 

if (args.length === 0) {
    console.log("Uso: node greedy_change.js <valor_do_troco>");
    console.log("Exemplo: node greedy_change.js 3.75");
    process.exit(1); 
}

const valueToChange = parseFloat(args[0]);

if (isNaN(valueToChange) || valueToChange < 0) {
    console.error("Erro: O valor deve ser um número positivo.");
    process.exit(1);
}

const result = getChange(valueToChange);
console.log("\nTroco:");
if (Object.keys(result).length === 0) {
    console.log("Nenhum troco necessário ou valor muito pequeno.");
} else {
    for (const coinValue in result) {
        console.log(`${result[coinValue]} moeda(s) de R$ ${coinValue}`);
    }
}
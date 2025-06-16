function minhaFuncao(x) {
  return (x - 2) * (x - 3);
}

const args = process.argv.slice(2);

if (args.length === 0) {
  console.log("Uso: node script.js <numeroFimDaFaixa>");
  console.log("Exemplo: node script.js 10");
  process.exit(1); 
}

const fimDaFaixa = parseInt(args[0], 10); 

if (isNaN(fimDaFaixa)) {
  console.error("Erro: O argumento deve ser um número válido.");
  process.exit(1);
}

console.log(`Testando a função de 0 até ${fimDaFaixa}:`);
console.log("---------------------------------------");

for (let i = 0; i <= fimDaFaixa; i++) {
  const resultado = minhaFuncao(i);
  console.log(`Entrada: ${i} => Saída: ${resultado}`);
}

console.log("---------------------------------------");
console.log("Testes concluídos.");
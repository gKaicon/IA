# Atv 1 - Individuo

# Explicação



# Algoritmo Genético Básico (Node.js)

Este repositório contém uma implementação simples de um Algoritmo Genético em JavaScript, projetado para rodar diretamente no terminal Node.js. O objetivo principal deste algoritmo é encontrar o valor mínimo de uma função objetivo específica **f**(**x**1,**x**2) através de um processo iterativo de geração e avaliação de indivíduos (cromossomos binários).

---

## 1. Visão Geral

Este script simula a parte fundamental de um algoritmo genético: **geração aleatória de indivíduos** e  **avaliação de sua aptidão (fitness)** . Ele busca o "melhor" indivíduo (aquele que resulta no menor valor da função objetivo) ao longo de um número definido de iterações. Ao final da execução, o script exibe o melhor indivíduo encontrado e um histórico detalhado de todas as avaliações realizadas.

---

## 2. Estrutura do Código

O código é modularizado em funções auxiliares que cuidam de etapas específicas do algoritmo, seguidas pela lógica principal de execução.

### 2.1 Funções Auxiliares

#### `binToDecimal(bits)`

* **Propósito:** Converte um array de bits binários (e.g., `[0, 1, 1, 0, 1]`) para seu equivalente decimal.
* **Parâmetros:**

  * `bits` (Array de `number`): Um array onde cada elemento é `0` ou `1`.
* **Retorno:**

  * `number`: O valor decimal correspondente.
* **Exemplo:**
  **JavaScript**

  ```
  binToDecimal([1, 0, 1, 0]) // Retorna 10
  ```
* **Detalhes de Implementação:** Une os elementos do array em uma string binária e utiliza `parseInt()` com a base `2` para a conversão.

#### `decode(bin, x_min = 0, x_max = 6)`

* **Propósito:** Decodifica um cromossomo binário (ou um segmento dele) em um número de valor real dentro de um intervalo especificado. Isso é crucial para mapear representações binárias para domínios contínuos.
* **Parâmetros:**
  * `bin` (Array de `number`): Um array de bits binários que representa o valor a ser decodificado.
  * `x_min` (number, opcional): O valor mínimo do intervalo real. Padrão: `0`.
  * `x_max` (number, opcional): O valor máximo do intervalo real. Padrão: `6`.
* **Retorno:**
  * `number`: O número real decodificado.
* **Fórmula de Decodificação:**
  A fórmula utilizada para a decodificação linear é:
  **x**=**x**min+**2**n**−**1**(**x**ma**x****−**x**min)**×**valor_decimal****
  Onde:
  * **x** é o valor real decodificado.
  * **x**min é o valor mínimo do intervalo.
  * **x**ma**x** é o valor máximo do intervalo.
  * **valor_decimal** é o equivalente decimal da entrada binária.
  * **n** é o número de bits na entrada binária.
  * **2**n**−**1 representa o valor decimal máximo que pode ser representado por **n** bits.
* **Detalhes de Implementação:** Primeiro, converte o array binário para decimal usando `binToDecimal`, e então aplica a fórmula de escala linear.

#### `fx(x1, x2)`

* **Propósito:** Esta é a **função objetivo** que o Algoritmo Genético busca minimizar. Ela recebe dois valores de entrada reais, **x**1 e **x**2, e retorna um valor calculado. O objetivo do algoritmo é encontrar os valores de **x**1 e **x**2 que resultem na menor saída possível desta função.
* **Parâmetros:**
  * `x1` (number): A primeira variável independente.
  * `x2` (number): A segunda variável independente.
* **Retorno:**
  * `number`: O resultado da avaliação da função.
* **Definição da Função:**
  **f**(**x**1,**x**2)**=**0.25**x**1**4****−**3**x**1**3+**11**x**1**2−**13**x**1****+**0.25**x**2**4−**3**x**2**3+**11**x**2**2−**13**x**2**
* **Detalhes de Implementação:** Utiliza `Math.pow()` para cálculos de exponenciação.

#### `gerarIndividuo()`

* **Propósito:** Cria um **cromossomo** aleatório para um indivíduo do algoritmo genético. Nesta implementação, um cromossomo é um array binário de 10 bits, onde os primeiros 5 bits representam **x**1 e os 5 bits restantes representam **x**2.
* **Parâmetros:** Nenhum.
* **Retorno:**
  * `Array de number`: Um array de 10 elementos contendo `0`s e `1`s.
* **Detalhes de Implementação:** Itera 10 vezes, adicionando `0` ou `1` ao array `cromossomo` usando `Math.round(Math.random())`.

### 2.2 Lógica Principal de Execução

#### `runGeneticAlgorithm(iterations = 1000)`

* **Propósito:** Executa o loop principal do Algoritmo Genético. Ele gera indivíduos aleatoriamente, avalia sua aptidão (usando `fx`), e mantém o controle do melhor indivíduo encontrado até o momento.
* **Parâmetros:**
  * `iterations` (number, opcional): O número de vezes que o algoritmo irá gerar e avaliar um novo indivíduo. Padrão: `1000`.
* **Retorno:**
  * `Object`: Um objeto contendo os resultados finais:
    * `melhor_individuo` (Array de `number`): O cromossomo binário do melhor indivíduo encontrado.
    * `melhor_x1` (number): O valor de **x**1 decodificado do melhor indivíduo.
    * `melhor_x2` (number): O valor de **x**2 decodificado do melhor indivíduo.
    * `melhor_fx` (number): O valor de **f**(**x**) do melhor indivíduo (o mínimo encontrado).
    * `historico` (Array de `Object`): Uma lista de todos os indivíduos gerados durante a execução, incluindo seus cromossomos, **x**1, **x**2 e valores de **f**(**x**).
    * `iteracoes` (number): O número total de iterações realizadas.
* **Detalhes de Implementação:**
  * Inicializa `melhor_fx` com `Number.MAX_VALUE` para garantir que o primeiro valor válido de **f**(**x**) encontrado seja considerado o melhor.
  * O loop principal executa pelo número especificado de `iterations`. Em cada iteração:
    * Um novo `individuo` aleatório é gerado.
    * O cromossomo do `individuo` é dividido em `x1_bits` (primeiros 5 bits) e `x2_bits` (últimos 5 bits).
    * `x1` e `x2` são decodificados usando `decode`.
    * `fx_valor` é calculado usando `fx`.
    * Os detalhes do indivíduo atual são adicionados ao `historico`.
    * Se `fx_valor` for menor que `melhor_fx`, ele atualiza `melhor_fx` e `melhor_individuo`.
  * Após o loop, os valores finais de `melhor_x1` e `melhor_x2` são decodificados a partir do `melhor_individuo` antes que os resultados sejam retornados.

---

## 3. Execução no Terminal Node.js

Este script foi projetado para ser executado diretamente em um ambiente Node.js via terminal.

### 3.1 Argumentos da Linha de Comando

O script aceita um argumento opcional na linha de comando:

* **`iterations` (number):** O número de iterações que o algoritmo genético irá executar. Se não for fornecido ou se a entrada não for um número válido, o padrão será `1000` iterações.
  * `process.argv[2]` é usado para acessar este argumento. `process.argv[0]` é 'node', e `process.argv[1]` é o caminho do arquivo do script.

### 3.2 Como Executar

1. **Salve o código:** Salve o código JavaScript fornecido em um arquivo (e.g., `geneticAlgorithm.js`).
2. **Abra seu terminal ou prompt de comando.**
3. **Navegue até o diretório** onde você salvou o arquivo.
4. **Execute o script** usando o comando `node`:
   * **Para executar com o número de iterações padrão (1000):**

     **Bash**

     ```
     node script.js
     ```
   * **Para especificar um número personalizado de iterações (ex: 5000):**

     **Bash**

     ```
     node script.js 5000
     ```

     **Para especificar um número personalizado de iterações (ex: 5000) com saída em um documento de .txt:**

     **Bash**

     ```
     node script.js 5000 > resposta.txt
     ```

### 3.3 Saída do Terminal

O script imprimirá os resultados diretamente no terminal. A saída inclui:

* O **melhor indivíduo encontrado** (seu cromossomo, valores decodificados de **x**1 e **x**2, e o **f**(**x**) correspondente).
* Um  **resumo do total de iterações** .
* Uma **tabela de histórico detalhada** mostrando cada indivíduo gerado, seu cromossomo, os valores de **x**1 e **x**2, e o **f**(**x**) avaliado para cada um.

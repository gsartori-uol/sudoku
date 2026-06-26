# Sudoku

Um jogo de Sudoku completo feito com HTML, CSS e JavaScript puro — sem dependências externas.

## Estrutura do Projeto

```
playground/
├── index.html    # Estrutura da página e layout
├── style.css     # Estilos, animações e tema visual
├── script.js     # Lógica do jogo (geração, validação, interação)
└── README.md     # Documentação
```

## Como Usar

Abra o arquivo `index.html` diretamente no navegador:

```bash
# Windows
start index.html

# macOS
open index.html

# Linux
xdg-open index.html
```

Nenhum servidor ou build é necessário.

## Funcionalidades

| Funcionalidade | Descrição |
|---|---|
| Geração de puzzles | Algoritmo de backtracking gera tabuleiros válidos aleatoriamente |
| 3 níveis de dificuldade | Easy (30 cells removidas), Medium (40), Hard (55) |
| Entrada por clique | Numpad na tela para selecionar números |
| Entrada por teclado | Teclas 1-9 para inserir, Backspace/Delete para apagar |
| Validação em tempo real | Números errados são destacados imediatamente em vermelho |
| Botão Check | Verifica o progresso atual e marca todos os erros |
| Botão Solve | Revela a solução completa automaticamente |
| Timer | Cronômetro que marca o tempo de resolução |
| Highlight de contexto | Destaca linha, coluna e bloco 3x3 da célula selecionada |
| Fundo RGB animado | Gradiente de cores que percorre o espectro continuamente |

## Controles

- **Clique** em uma célula vazia para selecioná-la
- **Teclas 1-9** ou **numpad na tela** para inserir um número
- **Backspace / Delete** ou **botão ✕** para apagar
- Células fixas (cinzas) não podem ser editadas

## Arquitetura

### `index.html`
Estrutura semântica com atributos ARIA para acessibilidade. Referencia os arquivos CSS e JS externos.

### `style.css`
- Tema escuro com acentos em rosa (#e94560) e azul (#4fc3f7)
- Fundo com animação RGB via `@keyframes` e `background-size` animado
- Container semi-transparente para contraste de leitura
- Grid CSS para o tabuleiro 9x9
- Bordas mais grossas nos limites dos blocos 3x3

### `script.js`
- **`generateSolution()`** — cria um tabuleiro completo válido usando backtracking com randomização
- **`createPuzzle()`** — remove N células aleatórias da solução para criar o desafio
- **`renderBoard()`** — desenha o tabuleiro no DOM
- **`selectCell()` / `placeNumber()`** — gerencia interação do jogador
- **`checkSolution()`** — valida o estado atual contra a solução
- **`solvePuzzle()`** — preenche automaticamente com a solução
- **Timer** — `setInterval` simples com formatação MM:SS

## Compatibilidade

Funciona em qualquer navegador moderno (Chrome, Firefox, Edge, Safari). Não requer ES modules, bundlers ou transpilers.

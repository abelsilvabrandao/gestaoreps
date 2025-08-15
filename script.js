document.addEventListener('DOMContentLoaded', function() {
    let edicaoAtiva = false;
    let linhaSelecionada = null;

    const linhas = document.querySelectorAll('.rep-row');
    const checkboxes = document.querySelectorAll('.rep-checkbox');

    // Seleção via checkbox
    const checkboxTodos = document.getElementById('checkbox-todos');

    checkboxTodos.addEventListener('change', function () {
        checkboxes.forEach((cb, idx) => {
            cb.checked = this.checked;
            if (this.checked) {
                linhas[idx].classList.add('selected');
            } else {
                linhas[idx].classList.remove('selected');
            }
        });
        // Atualiza referência de seleção
        linhaSelecionada = this.checked ? null : null;
    });

    checkboxes.forEach((cb, idx) => {
        cb.addEventListener('change', function (e) {
            if (checkboxTodos.checked && !this.checked) {
                checkboxTodos.checked = false;
            }
            if (this.checked) {
                linhas[idx].classList.add('selected');
            } else {
                linhas[idx].classList.remove('selected');
            }
            // Se todos estiverem marcados, marca o checkbox-todos
            if ([...checkboxes].every(cb => cb.checked)) {
                checkboxTodos.checked = true;
            }
        });
    });

    // Nenhum checkbox marcado inicialmente
    checkboxTodos.checked = false;
    checkboxes.forEach(cb => cb.checked = false);

    // Ao carregar, trava todos os campos editáveis e oculta Excluir/Salvar
    document.querySelectorAll('#tabelaReps tbody td[contenteditable]').forEach(cell => {
        cell.setAttribute('contenteditable', false);
    });
    linhas.forEach((linha) => {
        const btnExcluir = linha.querySelector('.excluir');
        if (btnExcluir) btnExcluir.style.display = 'none';
        const btnSalvar = linha.querySelector('.salvar');
        if (btnSalvar) btnSalvar.style.display = 'none';
    });
    const btnToggleEdicao = document.getElementById('toggleEdicao');
    // Habilita/Desabilita o botão Editar conforme seleção
    function atualizarBotaoEditar() {
        const algumMarcado = Array.from(checkboxes).some(cb => cb.checked);
        btnToggleEdicao.disabled = !algumMarcado;
        if (!algumMarcado) {
            edicaoAtiva = false;
            btnToggleEdicao.textContent = 'Editar';
            // Travar campos e ocultar botões
            linhas.forEach((linha, idx) => {
                linha.querySelectorAll('td[contenteditable]').forEach(cell => {
                    cell.setAttribute('contenteditable', false);
                });
                const btnExcluir = linha.querySelector('.excluir');
                if (btnExcluir) btnExcluir.style.display = 'none';
                const btnSalvar = linha.querySelector('.salvar');
                if (btnSalvar) btnSalvar.style.display = 'none';
            });
        }
    }
    checkboxes.forEach(cb => {
        cb.addEventListener('change', atualizarBotaoEditar);
    });
    atualizarBotaoEditar();

    btnToggleEdicao.addEventListener('click', () => {
        const algumMarcado = Array.from(checkboxes).some(cb => cb.checked);
        if (!algumMarcado) {
            alert('Selecione pelo menos um REP para editar.');
            return;
        }
        edicaoAtiva = !edicaoAtiva;
        // Visual: botão Editar fica pressionado (classe 'ativo')
        btnToggleEdicao.classList.toggle('ativo', edicaoAtiva);
        // Primeiro, trava todos os campos editáveis
        linhas.forEach((linha, idx) => {
            const tds = linha.querySelectorAll('td');
            [1,2,3,4,5,6].forEach(i => {
                if (tds[i]) tds[i].setAttribute('contenteditable', false);
            });
            const btnExcluir = linha.querySelector('.excluir');
            if (btnExcluir) btnExcluir.style.display = 'none';
            const btnSalvar = linha.querySelector('.salvar');
            if (btnSalvar) btnSalvar.style.display = 'none';
        });
        // Só destrava se ativado e checkbox marcado
        if (edicaoAtiva) {
            checkboxes.forEach((cb, idx) => {
                if (cb.checked) {
                    const tds = linhas[idx].querySelectorAll('td');
                    [1,2,3,4,5,6].forEach(i => {
                        if (tds[i]) tds[i].setAttribute('contenteditable', true);
                    });
                    // Mostra Excluir somente se em edição
                    const btnExcluir = linhas[idx].querySelector('.excluir');
                    if (btnExcluir) btnExcluir.style.display = 'inline-block';
                    const btnSalvar = linhas[idx].querySelector('.salvar');
                    if (btnSalvar) btnSalvar.style.display = 'none'; // Só aparece ao editar
                }
            });
        }
        btnToggleEdicao.textContent = 'Editar';
    });

    // Mostrar botão Salvar na linha se qualquer campo for editado
    linhas.forEach((linha, idx) => {
        linha.querySelectorAll('td[contenteditable]').forEach(cell => {
            cell.addEventListener('input', function() {
                const btnSalvar = linha.querySelector('.salvar');
                if (btnSalvar) btnSalvar.style.display = 'inline-block';
            });
        });
        // Botão Salvar: ao clicar, trava campos e oculta Salvar/Excluir
        const btnSalvar = linha.querySelector('.salvar');
        if (btnSalvar) {
            btnSalvar.addEventListener('click', function() {
                linha.querySelectorAll('td[contenteditable]').forEach(cell => {
                    cell.setAttribute('contenteditable', false);
                });
                btnSalvar.style.display = 'none';
                const btnExcluir = linha.querySelector('.excluir');
                if (btnExcluir) btnExcluir.style.display = 'none';
            });
        }
    });

    // Botão Excluir remove a linha
    document.querySelectorAll('.excluir').forEach(btn => {
        btn.addEventListener('click', function() {
            const tr = this.closest('tr');
            tr.parentNode.removeChild(tr);
        });
    });

    document.querySelectorAll('.verificar').forEach(btn => {
    btn.addEventListener('click', function () {
        const tr = this.closest('tr');
        // Seleciona a célula Online? pela posição correta (10ª célula, índice 9)
        const tds = tr.querySelectorAll('td');
        const onlineTd = tds[9];
        if (!onlineTd) return;
        // Seleciona o primeiro span dentro da célula
        const iconSpan = onlineTd.querySelector('span');
        console.log('onlineTd:', onlineTd, 'iconSpan:', iconSpan);
        if (!iconSpan) return;
        // Salva o ícone anterior
        const prevIcon = iconSpan.outerHTML;
        // Cria spinner
        const spinner = document.createElement('span');
        spinner.className = 'loading-spinner';
        iconSpan.replaceWith(spinner);
        setTimeout(() => {
            spinner.replaceWith(iconSpan);
        }, 1500);
    });
});

    document.querySelectorAll('.pausar').forEach(btn => {
        btn.addEventListener('click', function () {
            const tr = this.closest('tr');
            const statusTd = tr.querySelector('.status');
            if (statusTd) {
                statusTd.className = 'status pausado';
                statusTd.innerHTML = '<span class="pause-icon pulse"></span> Pausado';
            }
        });
    });

    document.querySelectorAll('.ativar').forEach(btn => {
        btn.addEventListener('click', function () {
            const tr = this.closest('tr');
            const statusTd = tr.querySelector('.status');
            if (statusTd) {
                statusTd.className = 'status ativo';
                statusTd.innerHTML = '<span class="online-icon pulse"></span> Ativo';
            }
        });
    });

    document.getElementById('ativarTodos').addEventListener('click', () => {
        alert('Todos os REPs foram ativados.');
    });

    document.getElementById('pausarTodos').addEventListener('click', () => {
        alert('Todos os REPs foram pausados.');
    });

    document.getElementById('verificarTodos').addEventListener('click', () => {
        alert('Verificando todos os REPs...');
    });

    document.getElementById('toggleEdicao').addEventListener('click', () => {
        edicaoAtiva = !edicaoAtiva;
        // Travar todas as linhas
        document.querySelectorAll('#tabelaReps tbody td[contenteditable]').forEach(cell => {
            cell.setAttribute('contenteditable', false);
        });
        // Se destravar, destrava apenas a selecionada
        if (edicaoAtiva && linhaSelecionada) {
            linhaSelecionada.querySelectorAll('td[contenteditable]').forEach(cell => {
                cell.setAttribute('contenteditable', true);
            });
        }
        document.getElementById('toggleEdicao').textContent = edicaoAtiva ? '🔒 Travar Edição' : '🔓 Destravar Edição';
    });
});

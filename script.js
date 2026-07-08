document.addEventListener('DOMContentLoaded', () => {
    
    function atualizarRelogio() {
        const agora = new Date();
        const data = agora.toLocaleDateString('pt-BR');
        const horario = agora.toLocaleTimeString('pt-BR');
        
        const elementoRelogio = document.getElementById('relogio');

        if (elementoRelogio) {
            elementoRelogio.innerText = `📅 ${data} - ⏰ ${horario}`;
        }
    }
    setInterval(atualizarRelogio, 1000);
    atualizarRelogio();

    const horariosMedicao = {
        "T2": {
            "DOM 1": ["03:00", "03:30", "04:00", "04:30", "05:00", "05:30", "06:00", "06:30", "07:00", "07:30", "08:00", "08:30", "09:00", "09:30", "11:30", "12:00", "12:30", "12:45", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "20:00", "20:30", "21:00", "22:30", "23:00"],
            "DOM 2": ["05:30", "06:00", "06:30", "07:00", "07:30", "08:00", "08:30", "09:00", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00", "22:30", "23:00"],
            "INTER 2": ["05:30", "06:00", "06:30", "07:00", "07:30", "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "20:00", "20:30", "21:00", "21:30", "22:00", "22:30"],
            "CONX. T2/T3": ["16:45", "17:00", "20:00", "20:45", "21:00", "22:00"]
        },
        "T3": {
            "INTER 3": ["00:00", "00:30", "08:00", "12:00", "12:30", "13:00", "13:30", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:15", "19:30", "19:45", "20:00", "20:15", "20:30", "20:45", "21:00", "21:30", "22:00", "22:30", "23:00", "23:30"],
            "CONX. T3": ["05:00", "05:15", "05:30", "05:45", "06:00", "06:15", "06:30", "07:00", "07:45", "08:00", "09:15", "09:30", "17:30", "17:45", "18:00", "20:15", "20:30", "21:00"]
        }
    };

    let medicaoInterval = null;

    function parseTimeToDate(timeStr) {
        const [hours, minutes] = timeStr.split(':').map(Number);
        const date = new Date();
        date.setHours(hours, minutes, 0, 0);
        return date;
    }

    function updateMedicaoStatus() {
        const terminal = document.getElementById('select-terminal').value;
        const local = document.getElementById('select-local').value;
        
        if (!terminal || !local) return;

        const horarios = horariosMedicao[terminal][local];
        const agora = new Date();
        
        let previousTime = null;
        let nextTime = null;
        
        for (let i = 0; i < horarios.length; i++) {
            let scheduleDate = parseTimeToDate(horarios[i]);
            if (scheduleDate <= agora) {
                previousTime = scheduleDate;
            }
            if (scheduleDate > agora) {
                nextTime = scheduleDate;
                break;
            }
        }
        
        if (!nextTime) {
            nextTime = parseTimeToDate(horarios[0]);
            nextTime.setDate(nextTime.getDate() + 1);
        }
        
        let isEmMedicao = false;
        if (previousTime) {
            const diffPastMinutes = Math.floor((agora - previousTime) / (1000 * 60));
            if (diffPastMinutes < 15) {
                isEmMedicao = true;
            }
        }

        const diffFutureMinutes = Math.floor((nextTime - agora) / (1000 * 60));
        
        const timeElem = document.getElementById('medicao-time');
        const msgElem = document.getElementById('medicao-message');
        const container = document.querySelector('.medicao-status-container');
        
        if (isEmMedicao) {
            timeElem.innerText = `Em andamento`;
            timeElem.style.color = '#28a745';
            msgElem.innerText = `Próxima fila em ${diffFutureMinutes} min`;
            container.style.backgroundColor = '#e8f5e9';
        } else {
            if (diffFutureMinutes <= 5) {
                timeElem.innerText = `${diffFutureMinutes} min`;
                timeElem.style.color = '#E31B23';
                msgElem.innerText = `⚠️ Código 5 ⚠️`;
                container.style.backgroundColor = '#ffebee';
            } else {
                timeElem.innerText = `${diffFutureMinutes} min`;
                timeElem.style.color = '#212121';
                msgElem.innerText = `para iniciar a fila`;
                container.style.backgroundColor = '#f5f5f5';
            }
        }
    }

    function updateLocalOptions() {
        const terminal = document.getElementById('select-terminal').value;
        const localSelect = document.getElementById('select-local');
        localSelect.innerHTML = '';
        
        const locais = Object.keys(horariosMedicao[terminal]);
        locais.forEach(loc => {
            const opt = document.createElement('option');
            opt.value = loc;
            opt.innerText = loc;
            localSelect.appendChild(opt);
        });
        
        updateMedicaoStatus();
    }

    const btnMedicao = document.getElementById('btn-medicao');
    const modalMedicao = document.getElementById('modalMedicao');
    const closeMedicao = document.getElementById('closeMedicao');
    const selectTerminal = document.getElementById('select-terminal');
    const selectLocal = document.getElementById('select-local');

    if (btnMedicao) {
        btnMedicao.addEventListener('click', () => {
            modalMedicao.style.display = 'flex';
            updateLocalOptions();
            if (medicaoInterval) clearInterval(medicaoInterval);
            medicaoInterval = setInterval(updateMedicaoStatus, 1000);
        });
    }

    if (closeMedicao) {
        closeMedicao.addEventListener('click', () => {
            modalMedicao.style.display = 'none';
            if (medicaoInterval) clearInterval(medicaoInterval);
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target === modalMedicao) {
            modalMedicao.style.display = 'none';
            if (medicaoInterval) clearInterval(medicaoInterval);
        }
    });

    if (selectTerminal) {
        selectTerminal.addEventListener('change', updateLocalOptions);
    }
    if (selectLocal) {
        selectLocal.addEventListener('change', updateMedicaoStatus);
    }

});

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js');
    });
}
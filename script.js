document.addEventListener('DOMContentLoaded', () => {
    
    function atualizarRelogio() {
        const agora = new Date();
        const data = agora.toLocaleDateString('pt-BR');
        const horario = agora.toLocaleTimeString('pt-BR');
        
        const elementoRelogio = document.getElementById('relogio');

        if (elementoRelogio) {
            elementoRelogio.innerText = ` | 📅 ${data} - ${horario}`;
        }
    }
    setInterval(atualizarRelogio, 1000);
    atualizarRelogio();

});
// Wagner Lima | www.wagnerlima.net | @wagnerlimaNET
// Professor de desenvolvimento web e design na escola iwtraining, especialista em mecanismos de 
// buscas (SEO) e graduando em Sistemas e Mídias Digitais na Universidade Federal do Ceará (UFC).

document.addEventListener('DOMContentLoaded', () => {
    const wheel = document.getElementById('wheel');
    const spinBtn = document.getElementById('spin-btn');
    const darkOverlay = document.getElementById('dark-overlay');
    const resultModal = new bootstrap.Modal(document.getElementById('resultModal'));
    const prizeText = document.getElementById('prize-text');
    
    // Lista de prêmios na ordem da roleta, começando do topo e em sentido horário.
    // São 12 fatias, então 360 / 12 = 30 graus por fatia.
    const prizes = [
        'TENTE OUTRA VEZ',
        'VALE COMPRAS NO VALOR DE R$400',
        'TENTE OUTRA VEZ',
        'VALE COMPRAS NO VALOR DE R$600',
        'TENTE OUTRA VEZ',
        'VALE COMPRAS NO VALOR DE R$800',
        'TENTE OUTRA VEZ',
        'VALE COMPRAS NO VALOR DE R$400',
        'TENTE OUTRA VEZ',
        'VALE COMPRAS NO VALOR DE R$600',
        'TENTE OUTRA VEZ',
        'VALE COMPRAS NO VALOR DE R$1000',
    ];
    
    const degreesPerSegment = 360 / prizes.length;
    let currentRotation = 0;
    let isSpinning = false;

    spinBtn.addEventListener('click', () => {
        if (isSpinning) return;

        isSpinning = true;
        
        // Sorteia um segmento vencedor
        const winningSegmentIndex = Math.floor(Math.random() * prizes.length);
        
        // Calcula o ângulo final
        // 1. Múltiplas rotações completas para o efeito de giro (entre 5 e 10)
        const randomRotations = Math.floor(Math.random() * 6) + 5; 
        
        // 2. O ângulo para parar no meio do segmento vencedor
        const targetAngle = winningSegmentIndex * degreesPerSegment + (degreesPerSegment / 2);
        
        // 3. O ângulo final é o acumulado + as novas rotações + o ângulo do prêmio
        // O sinal de menos é para girar no sentido horário
        const finalRotation = (randomRotations * 360) + targetAngle;

        // Guarda a rotação final para que o próximo giro comece de onde parou
        currentRotation += finalRotation;

        // Aplica a rotação no elemento da roleta
        wheel.style.transform = `rotate(${currentRotation}deg)`;
        
        // Aguarda a animação terminar para mostrar o resultado
        setTimeout(() => {
            const prize = prizes[winningSegmentIndex];
            handleResult(prize);
            isSpinning = false;
        }, 6000); // 6 segundos (duração da transição do CSS)
    });

    function handleResult(prize) {
        if (prize.includes('TENTE OUTRA VEZ')) {
            // Se perdeu, escurece a tela por 2 segundos
            darkOverlay.classList.add('active');
            prizeText.textContent = "Tente Outra Vez!";
            prizeText.classList.add('loser');
            prizeText.classList.remove('winner');
            setTimeout(() => {
                darkOverlay.classList.remove('active');
            }, 2000);
        } else {
            // Se ganhou, joga confetes!
            launchConfetti();
            prizeText.textContent = `PARABÉNS! VOCÊ GANHOU UM ${prize}`;
            prizeText.classList.add('winner');
            prizeText.classList.remove('loser');
        }
        
        // Exibe o modal com o resultado
        resultModal.show();
    }

    function launchConfetti() {
        // Configurações dos confetes
        confetti({
            particleCount: 150,
            spread: 90,
            origin: { y: 0.6 }
        });
    }
});

// Recarrega a página ao fechar o modal
const resultModal = document.getElementById('resultModal');
resultModal.addEventListener('hidden.bs.modal', () => {
    location.reload();
});

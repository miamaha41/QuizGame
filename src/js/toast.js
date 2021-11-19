export function toast({
    title = '',
    message = '',
    type = '',
    duration = 3000
}) {
    const main = document.getElementById('toast');

    function addToast() {
        const toast = document.createElement('div');
        //Auto remove Toast
        const autoRemoveId = setTimeout(() => main.removeChild(toast), duration + 1000);
        //Remove Toast when click close button
        toast.onclick = (e) => {
            if (e.target.closest('.toast__close')) {
                main.removeChild(toast);
                clearTimeout(autoRemoveId);
            }
        }
        const icons = {
            success: "fas fa-check-circle",
            info: "fas fa-info-circle",
            warning: "fas fa-exclamation-circle",
            error: "fas fa-exclamation-circle"
        }
        const icon = icons[type];
        const delay = (duration / 1000).toFixed(2);
        toast.classList.add('toast', `toast--${type}`);
        toast.style.animation = `slideInLeft ease .3s, fadeOut linear 1s ${delay}s forwards`;
        toast.innerHTML = `<div class="toast__icon "><i class="${icon}"></i></div>
        <div class="toast__body">
            <h3 class="toast__title">${title}</h3>
            <p class="toast__msg">${message}</p>
        </div>
        <div class="toast__close"><i class="fas fa-times"></i></div>`;
        main.appendChild(toast);
    }
    if (main.children.length) {
        main.removeChild(main.children[0]);
    }
    addToast();

}

export function showSuccessToast(message) {
    toast({
        title: 'Successfully!',
        message: message,
        type: 'success',
        duration: 5000
    });
}

export function showErrorToast(message) {
    toast({
        title: 'Failed!',
        message: message,
        type: 'error',
        duration: 5000
    });
}
const storage = document.getElementById('storage');
const transfer = document.getElementById('transfer');
const prices = document.querySelector('.prices');

const providers = [{
        name: 'backblaze.com',
        icon: './images/backbaze.png',
        storage: 0.005,
        transfer: 0.01,
        minimum: 7,
    },
    {
        name: 'bunny.net',
        icon: './images/bunny.net.png',
        maximum: 10,
        options: {
            HDD: {
                storage: 0.01,
                transfer: 0.01,
            },
            SSD: {
                storage: 0.02,
                transfer: 0.01,
            }
        }
    },
    {
        name: 'scaleway.com',
        icon: './images/scaleway.png',
        options: {
            multi: {
                storage: 0.06,
                transfer: 0.02,
            },
            single: {
                storage: 0.03,
                transfer: 0.02,
            },
        },
        free: {
            storage: 75,
            transfer: 75
        }
    },
    {
        name: 'vultr.com',
        icon: './images/vultr.png',
        storage: 0.01,
        transfer: 0.01,
        minimum: 5,
    }
];

const options = new Map();

function implementOptions() {
    for (const provider of providers) {
        if ('options' in provider) {
            Object.keys(provider.options).forEach((option, index) => {
                index === 0 ? options.set(option, true) : options.set(option, false)
            })
        }
    }
}

implementOptions();

function changeOption(option) {
    option.style.fontWeight = 'bold';
    options.set(option.textContent, true);
    if (option.previousElementSibling) {
        option.previousElementSibling.style.fontWeight = 'normal';
        options.set(option.previousSibling.textContent, false);
    } else {
        option.nextElementSibling.style.fontWeight = 'normal';
        options.set(option.nextElementSibling.textContent, false);
    }
    renderPrices();
}

for (const provider of providers) {
    let elem = document.createElement('div');
    elem.classList.add('d-flex-centre', 'provider');
    let name = document.createElement('div');
    name.textContent = provider.name;
    name.classList.add('name', 'd-flex-column');
    if ('options' in provider) {
        let div = document.createElement('div');
        Object.keys(provider.options).forEach((option) => {
            let span = document.createElement('span');
            span.textContent = `${option}`;
            span.style.margin = '10px';
            span.classList.add(`${option}`);
            span.addEventListener('click', changeOption.bind(this, span));
            if (options.get(option)) {
                span.style.fontWeight = 'bold';
            }
            div.appendChild(span);
        })
        name.appendChild(div)
    }
    let icon = document.createElement('img');
    icon.setAttribute('src', provider.icon);
    icon.classList.add('icon');
    elem.appendChild(name);
    elem.appendChild(icon);
    prices.appendChild(elem);
}

function updateNumber(event) {
    event.target.previousElementSibling.lastElementChild.firstElementChild.value =
        event.target.value;
    renderPrices();
}

function updateRange(event) {
    event.target.parentElement.parentElement.nextElementSibling.value =
        event.target.value;
    renderPrices();
}

function renderPrices() {
    let renderedProviders = document.querySelectorAll('.provider');
    renderedProviders.forEach((provider, index) => {
        if (provider.lastElementChild.hasAttribute('provider')) {
            provider.lastElementChild.remove();
        }
        let container = document.createElement('div');
        container.classList.add('d-flex-centre');
        container.setAttribute('provider', `${index}`);
        let sum = document.createElement('div');
        let number = document.createElement('div');
        sum.style.height = '30px';
        if (providers[index].options) {
            Object.keys(providers[index].options).forEach((option) => {
                if (options.get(option)) {
                    let numb = (storage.value * providers[index].options[option].storage + transfer.value * providers[index].options[option].transfer).toFixed(1);

                    if ('free' in providers[index]) {
                        if (storage.value <= providers[index].free.storage && transfer.value <= providers[index].free.transfer) {
                            numb = 0;
                        } else if (storage.value <= providers[index].free.storage) {
                            numb = (transfer.value * providers[index].options[option].transfer).toFixed(1);

                        } else if (transfer.value <= providers[index].free.transfer) {
                            numb = (storage.value * providers[index].options[option].storage).toFixed(1);
                        } else {
                            numb = ((storage.value - providers[index].free.storage) * providers[index].options[option].storage + (transfer.value - providers[index].free.transfer) * providers[index].options[option].transfer).toFixed(2);
                        }
                    }
                    if (providers[index].minimum && numb < providers[index].minimum) {
                        numb = providers[index].minimum;

                    } else if (providers[index].maximum && numb > providers[index].maximum) {
                        numb = providers[index].maximum;
                    }
                    number.textContent = `${numb}$`;
                    sum.style.width = `${numb*2}px`;
                }
            })
        } else {
            let numb = (storage.value * providers[index].storage + transfer.value * providers[index].transfer).toFixed(2);
            if (providers[index].minimum && numb < providers[index].minimum) {
                numb = providers[index].minimum;

            } else if (providers[index].maximum && numb > providers[index].maximum) {
                numb = providers[index].maximum;
            }
            number.textContent = `${numb}$`;
            sum.style.width = `${numb*2}px`;
        }
        sum.style.backgroundColor = 'blue';
        container.appendChild(sum);
        container.appendChild(number);
        provider.appendChild(container);
    });
}
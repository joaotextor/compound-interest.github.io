const name = document.getElementById('name')
const value = document.getElementById('value')
const interest = document.getElementById('interest')
const timePeriod = document.getElementById('months')
const buttonSimulate = document.getElementById('simulate')
const mainForm = document.querySelector('.form')
const mainResult = document.querySelector('.result')


buttonSimulate.onclick = () => showResult('http://api.mathjs.org/v4/')

const formatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
})

const replaceDotForComma = (number) => {
    if (number % 2 == 0) {
        return (number / 2).toString()+`,00`
    } else {
        return (number / 2).toString().replace(".", ",")+`0`
    }
}

const assembleHtml = (data) => {
    const totalValue = data.result
    mainForm.classList.add(`hidden`)
    mainResult.classList.remove(`hidden`)
    mainResult.innerHTML = `
    <p>Olá, ${name.value}. Juntando ${formatter.format(value.value.replace(",", "."))} todos os meses, você terá <b>${formatter.format(totalValue)}</b> em ${(timePeriod.value / 12)} ano${(timePeriod.value / 12) > 1 ? `s` : ``}.</p>
    <button id="btn-new-simulation"><div>Simular novamente</div></button>
    `
    const btnNewSimulation = document.getElementById(`btn-new-simulation`)
    btnNewSimulation.onclick = newSimulation
} 

const newSimulation = () => {
    name.value = ''
    value.value = ''
    interest.value = ''
    timePeriod.value = 0
    mainResult.classList.add("hidden")
    mainForm.classList.remove("hidden")
}

const showResult = async (url = '') => {
    let error = 0
    name.classList.remove('error')
    value.classList.remove('error')
    interest.classList.remove('error')
    timePeriod.classList.remove('error')

    if (!name.value) {
        error = 1
        name.classList.add('error')
    }

    if (timePeriod.value == 0) {
        error = 1
        timePeriod.classList.add('error')
    }

    if (isNaN(value.value.replace(",", ".")) || !value.value) {
        value.classList.add('error')
        value.setAttribute('placeholder', `${!value.value ? 'Mensalidade deve ser numérico' : '"'+value.value+'" não é numérico' }`)
        error = 1
    } else {
        value.setAttribute('placeholder', 'Insira um aporte mensal...')
    }

    if (isNaN(interest.value.replace(",", ".")) || !interest.value) {
        interest.classList.add('error')
        interest.setAttribute('placeholder', `${!interest.value ? 'Juros deve ser numérico' : '"'+interest.value+'" não é numérico'}`)
        error = 1
    } else {
        value.setAttribute('placeholder', 'Insira o juros mensal...')
    }

    if (error != 0) {
        interest.value = ''
        value.value = ''
        alert('Corrija os campos em vermelho.')
        return
    }
    await fetch(url, {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: `{ "expr": "${value.value.replace(`,`, `.`)} * (((1+ ${(interest.value.replace("%", "").replace(",", ".") / 100)}) ^ ${timePeriod.value} - 1) / ${(interest.value.replace("%", "").replace(",", ".") / 100)})", "precision": 4 }`
        
    })
    .then((res) => res.json())
    .then(assembleHtml)
    .catch(() => console.log('An error occurred. Please check your data!'))
}
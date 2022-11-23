const name = document.getElementById('name')
const value = document.getElementById('value')
const interest = document.getElementById('interest')
const timePeriod = document.getElementById('months')
const buttonSimulate = document.getElementById('simulate')
const mainForm = document.querySelector('.form')
const mainResult = document.querySelector('.result')


buttonSimulate.onclick = () => showResult('http://api.mathjs.org/v4/')

const replaceDotForComma = (number) => {
    if (number % 2 == 0) {
        return (number / 2).toString()+`,00`
    } else {
        return (number / 2).toString().replace(".", ",")+`0`
    }
}

const assembleHtml = (data) => {
    const totalValue = replaceDotForComma(data.result)
    mainForm.classList.add(`hidden`)
    mainResult.classList.remove(`hidden`)
    mainResult.innerHTML = `
    <p>Olá, ${name.value}. Juntando R$ ${value.value} todos os meses, você terá <b>R$ ${totalValue}</b> em ${(timePeriod.value / 12)} ano${(timePeriod.value / 12) > 1 ? `s` : ``}.</p>
    <button id="btn-new-simulation">Simular novamente</button>
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
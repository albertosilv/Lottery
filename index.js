(function (win, doc) {

    const app = (function () {
        let typeGame;
        let games;
        const cars = []
        let amount =0
        const gamesNumber={
            'Lotofácil':[],
            'Mega-Sena':[],
            'Quina':[]
        }
        const ajax = new XMLHttpRequest();
        let rules;
        return {
            init: function init() {
                this.gamesInfo()
                this.chooseGame()
            },
            gamesInfo: function gamesInfo() {
                ajax.open('GET', './games.json', true);
                ajax.send();
                ajax.addEventListener('readystatechange', this.getGamesInfo);
            },
            getGamesInfo: function getGamesInfo() {
                if (!app.isReady.call(this)) return;
                rules = JSON.parse(this.responseText).types;
                console.log(rules)
                app.generateNumbers('Lotofácil')
            },
            isReady: function isReady() {
                return this.readyState === 4 && this.status === 200
            },
            chooseGame: function chooseGame() {

                const buttonFacil = doc.getElementById('button-facil')
                const buttonMega = doc.getElementById('button-mega')
                const buttonMania = doc.getElementById('button-mania') 
                const buttonClear = doc.getElementById('clear-game')
                const buttonComplete = doc.getElementById('complete-game')
                const buttonAddCar = doc.getElementById('submit')
                buttonFacil.addEventListener('click', this.handleGame)
                buttonMega.addEventListener('click', this.handleGame)
                buttonMania.addEventListener('click', this.handleGame)
                buttonClear.addEventListener('click', this.clearGame)
                buttonComplete.addEventListener('click', this.completeGame)
                buttonAddCar.addEventListener('click', this.addCar)

            },
            handleGame: function handleGame(e) {
                const idButton = e.srcElement.id
                switch (idButton) {
                    case 'button-facil':
                        app.generateNumbers('Lotofácil');
                        break;
                    case 'button-mega':
                        app.generateNumbers('Mega-Sena');
                        break; 
                    case 'button-mania':
                        app.generateNumbers('Quina');
                        break;
                    default:
                        console.log('error')
                        break;
                }
            },
            generateNumbers: function generateNumbers(type) {
                const game = rules.filter(e=>{
                    return e.type===type
                })[0]
                typeGame=game;
                const containerNumbers = doc.getElementById('container-numbers')
                containerNumbers.innerHTML=''
                for(let i=0;i<game.range;i++){
                    containerNumbers.appendChild(app.generateNumberButton(i<9?`0${i+1}`:i+1))
                }
            },
            generateNumberButton: function generateNumberButton(number){
                const $button = doc.createElement('button')
                const $text=doc.createTextNode(number)
                $button.setAttribute('class','button-number')
                $button.setAttribute('id',number)
                $button.addEventListener('click',()=>{
                    const length = typeGame['max-number']-gamesNumber[typeGame.type].length
                    if(length!==0){
                        gamesNumber[`${typeGame.type}`].push(String(number))
                        $button.removeAttribute('class','button-number')
                        $button.setAttribute('class','button-number-selection')
                    } 
                })
                $button.append($text)
                return $button
            },
            clearGame: function clearGame(){
                const buttons = document.querySelectorAll('#container-numbers .button-number-selection');
                buttons.forEach(e=>{
                    e.removeAttribute('class','button-number-selection')
                    e.setAttribute('class','button-number')
                })
                gamesNumber[typeGame.type]=[]
            },
            completeGame: function completeGame(){
                const length = typeGame['max-number']-gamesNumber[typeGame.type].length
                let cont=0
                while(true){
                    const num =  Math.round(Math.random() * 100)
                    const button = doc.getElementById(num>9?num:`0${num}`)
                    if(!button){
                        continue
                    }
                    if(!button.classList.contains('button-number-selection')){
                        gamesNumber[typeGame.type].push(String(num))
                        button.removeAttribute('class','button-number')
                        button.setAttribute('class','button-number-selection')
                        cont++;
                    }
                    if(cont>=length) break;
                }
            },
            addCar: function addCar(){
                const length = typeGame['max-number']-gamesNumber[typeGame.type].length
                if(length==0){
                    const cart = doc.getElementById('cart')
                    cart.appendChild(app.createCartGame())
                    app.createAmoutComponente()
                }else{
                    alert('Escolha os números')

                }
            },
            createCartGame: function createCartGame(){

                const $divContainer = doc.createElement('div')
                const $divContainerButton = doc.createElement('div')
                const $button = doc.createElement('button')
                const $img =doc.createElement('img')
                const $containerText = doc.createElement('div')
                const $textNumber = doc.createElement('span')
                const $type = doc.createElement('span')
                const $text = doc.createElement('p')

                $divContainer.setAttribute('class','mt-3 row align-items-center')
                $divContainerButton.setAttribute('class','col-3')
                $button.setAttribute('class','button-delete')

                $img.setAttribute('src','assets/126468.png')
                $img.setAttribute('class','icon m-4')

                $containerText.setAttribute('class','col-9')
                $containerText.style.borderLeft=`3px ${typeGame.color} solid`
                $containerText.style.borderRadius='2px'

                $textNumber.setAttribute('class','text-card')
                $type.setAttribute('class','text-card-loto')

                $button.appendChild($img)
                $divContainerButton.appendChild($button)


                $type.append(doc.createTextNode(`${typeGame.type}`))
                $text.appendChild($type)
                $text.append(doc.createTextNode(` R$${typeGame.price}`))
                const text = doc.createTextNode(gamesNumber[typeGame.type].toString())
                $textNumber.append(text)

                $containerText.appendChild($textNumber)
                $containerText.appendChild($text)
                $divContainer.appendChild($divContainerButton)
                $divContainer.appendChild($containerText)
                return $divContainer
            },
            createAmoutComponente:function createAmoutComponente(){
                console.log('hi')
                const amountComponente = doc.getElementById('amount')
                amountComponente.innerHTML=''
                amount+=typeGame.price
                const strong = doc.createElement('strong')
                strong.setAttribute('class','title-card')
                strong.append(doc.createTextNode(`CART`))
                const text = doc.createTextNode(`Total: R$ ${amount}`)
                amountComponente.appendChild(strong)
                amountComponente.append(text)
            }
        }
    })()
    app.init()

})(window, document)
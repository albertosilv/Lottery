(function (win, doc) {

    const app = (function () {
        let typeGame;
        let games;
        const cars = []
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

                buttonFacil.addEventListener('click', this.handleGame)
                buttonMega.addEventListener('click', this.handleGame)
                buttonMania.addEventListener('click', this.handleGame)
                buttonClear.addEventListener('click', this.clearGame)
                buttonComplete.addEventListener('click', this.completeGame)

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
                    gamesNumber[`${typeGame.type}`].push(String(number))
                    $button.removeAttribute('class','button-number')
                    $button.setAttribute('class','button-number-selection')
                })
                $button.append($text)
                console.log($button)
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
                    console.log(num)
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
            }
        }
    })()
    app.init()

})(window, document)
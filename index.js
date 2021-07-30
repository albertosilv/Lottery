(function (win, doc) {

    const app = (function () {
        let game;
        let games;
        const cars = []
        const gamesNumber={
            lotofacil:[],
            megasena:[],
            quina:[]
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

                buttonFacil.addEventListener('click', this.handleGame)
                buttonMega.addEventListener('click', this.handleGame)
                buttonMania.addEventListener('click', this.handleGame)

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
                $button.addEventListener('click',()=>{
                    $button.removeAttribute('class','button-number')
                    $button.setAttribute('class','.button-number-selection')
                })
                $button.append($text)
                return $button
            },
            clickNumber: function clickNumber(e){
                
            }
        }
    })()
    app.init()

})(window, document)
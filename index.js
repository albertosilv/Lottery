(function (win, doc) {

    const app = (function () {
        let typeGame;
        let amount = 0
        const gamesNumber = {
            'Lotofácil': [],
            'Mega-Sena': [],
            'Quina': []
        }
        const ajax = new XMLHttpRequest();
        let rules;
        let contGame = 0
        return {
            init: function init() {
                this.gamesInfo()
            },
            gamesInfo: function gamesInfo() {
                ajax.open('GET', './games.json', true);
                ajax.send();
                ajax.addEventListener('readystatechange', this.getGamesInfo);
            },
            getGamesInfo: function getGamesInfo() {
                if (!app.isReady.call(this)) return;
                rules = JSON.parse(this.responseText).types;
                app.chooseGame()
                typeGame = rules[0]
                app.generateNumbers()
            },
            isReady: function isReady() {
                return this.readyState === 4 && this.status === 200
            },
            chooseGame: function chooseGame() {
                this.createButtons(true)
                const buttonClear = doc.getElementById('clear-game')
                const buttonComplete = doc.getElementById('complete-game')
                const buttonAddCar = doc.getElementById('submit')
                buttonClear.addEventListener('click', this.clearGame)
                buttonComplete.addEventListener('click', this.completeGame)
                buttonAddCar.addEventListener('click', this.addCar)
            },
            createButtons: function createButtons(refresh) {
                const containerButton = doc.getElementById('buttonGames')
                containerButton.innerHTML = ''
                rules.forEach((element, index) => {
                    gamesNumber[element.type] = []
                    const button = doc.createElement('button')
                    button.setAttribute('class', 'button-game  col-lg-2 col-md-4 col-4 my-1')
                    button.style.border = `${element.color} solid 2px`
                    button.setAttribute('active', 'false')
                    button.style.color = element.color;
                    button.style.backgroundColor = '#fff';
                    if (index == 0 && refresh) {
                        button.setAttribute('active', 'true')
                        button.style.color = '#fff';
                        button.style.backgroundColor = element.color;
                    }
                    button.append(doc.createTextNode(`${element.type}`))
                    button.addEventListener('click', () => this.handleGame(element, button))
                    containerButton.appendChild(button)
                })
            },
            handleGame: function handleGame(gameActive, element) {
                typeGame = gameActive
                const backgroundColor = element.style.backgroundColor
                const color = element.style.color
                element.style.color = backgroundColor;
                element.style.backgroundColor = color;
                element.setAttribute('active', 'true')
                const buttons = document.querySelectorAll('.button-game');
                buttons.forEach(e => {
                    if (e != element) {
                        if (e.getAttribute('active') == 'true') {
                            const backgroundColor = e.style.backgroundColor
                            const color = e.style.color
                            e.style.color = backgroundColor;
                            e.style.backgroundColor = color;
                            e.setAttribute('active', 'false')
                        }
                    }
                })
                this.generateNumbers()
            },
            generateNumbers: function generateNumbers() {
                this.descriptionGame()
                const containerNumbers = doc.getElementById('container-numbers')
                containerNumbers.innerHTML = ''
                for (let i = 1; i <= typeGame.range; i++) {
                    containerNumbers.appendChild(app.generateNumberButton(i < 10 ? `0${i}` : i))
                }
            },
            descriptionGame: function descriptionGame() {
                const $description = doc.getElementById('description')
                $description.innerHTML = ''
                $description.append(doc.createTextNode(typeGame.description))
                $description.setAttribute('style', 'color:#887979dc')
            },
            generateNumberButton: function generateNumberButton(number) {
                const $button = doc.createElement('button')
                const $text = doc.createTextNode(number)
                $button.setAttribute('class', 'button-number')
                $button.setAttribute('active', 'false')
                $button.setAttribute('id', number)
                $button.addEventListener('click', () => {
                    const length = typeGame['max-number'] - gamesNumber[typeGame.type].length
                    if ($button.getAttribute('active') == 'false') {
                        if (length !== 0) {
                            gamesNumber[`${typeGame.type}`].push(String(number))
                            $button.style.background = "#fff"
                            $button.style.color = typeGame.color
                            $button.style.border = `${typeGame.color} solid 1px`
                            $button.setAttribute('active', 'true')
                        }
                    } else {
                        let index = gamesNumber[`${typeGame.type}`].indexOf(String(number));
                        gamesNumber[`${typeGame.type}`].splice(index, 1);
                        $button.removeAttribute('style')
                        $button.setAttribute('active', 'false')
                    }

                })
                $button.append($text)
                return $button
            },
            clearGame: function clearGame() {
                const buttons = document.querySelectorAll('.button-number');
                buttons.forEach(e => {
                    e.removeAttribute('style')
                    e.setAttribute('active', 'false')
                })
                gamesNumber[typeGame.type] = []
            },
            completeGame: function completeGame() {
                let length = typeGame['max-number'] - gamesNumber[typeGame.type].length
                console.log(length)
                if (length == 0) {
                    app.clearGame()
                    length = typeGame['max-number'] - gamesNumber[typeGame.type].length
                }
                let cont = 0
                while (true) {
                    const num = Math.round(Math.random() * 100)
                    const button = doc.getElementById(num > 10 ? num : `0${num}`)
                    if (!button) {
                        continue
                    }
                    if (button.getAttribute('active')!='true') {
                        gamesNumber[typeGame.type].push(String(button.id))
                        button.style.background = "#fff"
                        button.style.color = typeGame.color
                        button.style.border = `${typeGame.color} solid 1px`
                        button.setAttribute('active', 'true')
                        cont++;
                    }
                    if (cont >= length) break;
                }
            },
            addCar: function addCar() {
                const length = typeGame['max-number'] - gamesNumber[typeGame.type].length
                if (length == 0) {
                    app.createCartGame()
                    amount += typeGame.price
                    app.createAmoutComponente()
                } else {
                    alert('Escolha os números')

                }
            },
            createCartGame: function createCartGame() {
                const $container = doc.createElement('div')
                $container.setAttribute('id', `${contGame}-${typeGame.type}`)
                const $divContainer = doc.createElement('div')
                const $divContainerButton = doc.createElement('div')
                const $button = doc.createElement('button')
                const $img = doc.createElement('img')
                const $containerText = doc.createElement('div')
                const $textNumber = doc.createElement('span')
                const $type = doc.createElement('span')
                const $text = doc.createElement('p')

                $divContainer.setAttribute('class', 'mt-3 row align-items-center')
                $divContainerButton.setAttribute('class', 'col-3')
                $button.setAttribute('class', 'button-delete')
                $img.setAttribute('src', 'assets/126468.png')
                $img.setAttribute('class', 'icon m-4')

                $containerText.setAttribute('class', 'col-9')
                $containerText.style.borderLeft = `3px ${typeGame.color} solid`
                $containerText.style.borderRadius = '2px'

                $textNumber.setAttribute('class', 'text-card')
                $type.setAttribute('class', 'text-card-loto')

                $button.appendChild($img)
                $divContainerButton.appendChild($button)


                $type.append(doc.createTextNode(`${typeGame.type}`))
                $type.style.color = typeGame.color;
                $text.appendChild($type)
                $text.append(doc.createTextNode(` R$ ${typeGame.price.toFixed(2)}`))
                $text.setAttribute('style', 'color:#887979dc')
                const text = doc.createTextNode(gamesNumber[typeGame.type].sort().toString())
                $textNumber.append(text)
                $textNumber.setAttribute('style', 'color:#887979dc')

                $containerText.appendChild($textNumber)
                $containerText.appendChild($text)
                $divContainer.appendChild($divContainerButton)
                $divContainer.appendChild($containerText)
                $container.appendChild($divContainer)

                const cart = doc.getElementById('cart')
                const cartVazio = doc.getElementById('cartVazio')
                if (cartVazio) {
                    cartVazio.style.display = 'none'
                }
                cart.appendChild($container)

                $button.addEventListener('click', () => this.removeCartGame($container))
                contGame++;
            },
            removeCartGame: function removeCartGame(element) {
                const cart = doc.getElementById('cart')
                const game = element.id.split('-')[1]
                cart.removeChild(element);
                this.removeAmoutGame(game)
                let filhos = document.querySelectorAll('.cart > *')
                if (filhos.length == 0) {
                    const cartVazio = doc.getElementById('cartVazio')
                    cartVazio.style.display = 'flex'
                }

            },
            createAmoutComponente: function createAmoutComponente() {
                const amountComponente = doc.getElementById('amount')
                amountComponente.innerHTML = ''
                const strong = doc.createElement('strong')
                strong.setAttribute('class', 'title-card')
                strong.append(doc.createTextNode(`CART `))
                const text = doc.createTextNode(`Total: R$ ${amount.toFixed(2)}`)
                amountComponente.appendChild(strong)
                amountComponente.append(text)
                this.clearGame()
            },
            removeAmoutGame: function removeAmoutGame(type) {
                const remove = rules.filter(e => {
                    return type == e.type
                })
                console.log(remove)
                amount -= remove[0].price
                this.createAmoutComponente()
            }
        }
    })()
    app.init()

})(window, document)
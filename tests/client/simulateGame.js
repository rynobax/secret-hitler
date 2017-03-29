module.exports.simulateGame = function(playerCount){
    it('creates a game', () => {
        browser.get('http://localhost:7171');
    });
}

function createActors(playerCount){
    browser.get('http://localhost:7171');

    const host = browser.forkNewDriverInstance(true);
    const names = ['Ryan', 'Andrew', 'Anthony', 'John', 'Sarah', 'Matthew', 'Austin', 'Daniel', 'Julie', 'Hannah']
    const players = [];
    for(let i=0; i<playerCount; i++){
        players.push({
            name: names[i],
            browser: browser.forkNewDriverInstance(true)
        });
    }
    return {
        host: host,
        players: players
    }
}

function createGame({host, players}){
    return new Promise((resolve, reject) => {  
        host.findElement(by.id('createGame')).click();
        host.findElement(by.binding('code')).getText().then(code => {
            code = code.slice(11);
            expect(code.length).toEqual(4);
            resolve(code);
        });
    });
}

function joinGame({name, browser}, code){
    return new Promise((resolve, reject) => {
        browser.findElement(by.id('joinGame')).click();
        expect(browser.findElement(by.id('header')).getText()).toEqual('Join a Secret Hitler Game');
        browser.findElement(by.id('roomCodeInput')).sendKeys(code);
        browser.findElement(by.id('nameInput')).sendKeys(name);
        browser.findElement(by.id('submitButton')).click();
        expect(browser.findElement(by.id('header')).getText()).toEqual(name.toUpperCase());
        console.log(name + ' joined game');
        resolve();
    });
}

function startGame({players}){
    return new Promise((resolve, reject) => {
        console.log(players[0].name + ' starting game');
        players[0].browser.findElement(by.id('startGameButton')).click();
        resolve();
    });
}

function checkRoles({players}){
    return new Promise((resolve, reject) => {  
        const roles = [];
        players.forEach(player => {
            roles.push(0);
        });
    });
}

/* Promise template
return new Promise((resolve, reject) => {
});
*/
module.exports.simulateGame = function(playerCount, done){
    const actors = createActors(playerCount);
    createGame(actors)
        .then(code => Promise.all(actors.players.map(p => joinGame(p, code))))
        .then(() => startGame(actors))
        .then(() => checkRoles(actors))
        .then(done)
        .catch(err => {
            console.log('Caught error: ', err);
            done();
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
        resolve();
    });
}

function startGame({players}){
    players[0].brower.findElement(by.id('startGameButton')).click();
}

function checkRoles({players}){
    // Check those roles
}

/* Promise template
return new Promise((resolve, reject) => {
});
*/
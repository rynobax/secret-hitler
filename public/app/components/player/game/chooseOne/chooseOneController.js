secretHitlerApp.controller('chooseOneController', function($scope, $state, sessionService) {
    $scope.choices = [];
    $scope.selected = null;

    $scope.clickChoice = function(player){
        $scope.selected = player;
    }

    $scope.clickBack = function(){
        $scope.selected = null;
    }

    
    switch(sessionService.state.mode.name){
        case 'chooseChancellor':
            chooseChancellor();
            break;
        case 'presidentChooseCard':
            presidentChooseCard();
            break;
        case 'chancellorChooseCard':
            chancellorChooseCard();
            break;
        default:
            break;
    }

    function chooseChancellor(){
        const players = sessionService.state.players.map(e => e.name);
        const data = sessionService.state.mode.data;
        const president = sessionService.state.president;
        const chancellor = sessionService.state.chancellor;
        const lastPresident = sessionService.state.lastPresident;
        const lastChancellor = sessionService.state.lastChancellor;
        const headerText = 'Choose your chancellor!';
        $scope.header = headerText;
        $scope.confirmText = () => 'Confirm ' + $scope.selected + ' as your chancellor?';
        $scope.choices = players.filter(player => {
            if(player == president || player == lastPresident || player == lastChancellor) return false;
            return true;
        });
        console.log('$scope.choices: ', $scope.choices);

        $scope.confirm = function(){
            socket.emit('chooseChancellorResponse', $scope.selected);
        };
    }

    function presidentChooseCard(){
        const data = sessionService.state.mode.data;
        const headerText = 'Choose a card to discard!';
        $scope.header = headerText;
        $scope.confirmText = () => 'Discard a ' + $scope.selected + ' card?';
        $scope.choices = data.cards;

        $scope.confirm = function(){
            console.log('You picked ' + $scope.selected);
            socket.emit('presidentChooseCardResponse', $scope.selected);
        };
    }

    function chancellorChooseCard(){
        const data = sessionService.state.mode.data;
        const headerText = 'Choose a card to enact!';
        $scope.header = headerText;
        $scope.confirmText = () => 'Enact a ' + $scope.selected + ' card?';
        $scope.choices = data.cards;

        $scope.confirm = function(){
            console.log('You picked ' + $scope.selected);
            socket.emit('chancellorChooseCardResponse', $scope.selected);
        };
    }
});

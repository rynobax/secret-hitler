secretHitlerApp.controller('chooseOneController', function($scope, $state, sessionService) {
    const players = sessionService.state.players.map(e => e.name);
    const data = sessionService.state.mode.data;
    const name = sessionService.state.mode.name;

    $scope.players = [];
    $scope.selectedPlayer = null;

    switch(name){
        case 'chooseChancellor':
            chooseChancellor();
            break;
        default:
            break;
    }

    function chooseChancellor(){
        const president = data.president;
        const chancellor = data.chancellor;
        const lastPresident = data.lastPresident;
        const lastChancellor = data.lastChancellor;
        const headerText = 'Choose your chancellor!';
        $scope.header = headerText;
        $scope.confirmText = () => 'Confirm ' + $scope.selectedPlayer + ' as your chancellor?';
        $scope.players = players.filter(player => {
            if(player == president || player == lastPresident || player == lastChancellor) return false;
            return true;
        });

        $scope.clickPlayer = function(player){
            $scope.selectedPlayer = player;
        }

        $scope.clickBack = function(){
            $scope.selectedPlayer = null;
        }

        $scope.confirm = function(){
            console.log('You picked ' + $scope.selectedPlayer);
            socket.emit('chooseChancellorResponse', $scope.selectedPlayer);
        };
    }
});

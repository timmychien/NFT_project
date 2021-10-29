$('#signform').hide();
window.addEventListener('load', async () => {
    // Modern dapp browsers...
    if (window.ethereum) {
        window.web3 = new Web3(ethereum);
        try {
            // Request account access if needed
            await ethereum.enable();
        } catch (error) {
            console.log(error);
        }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
        window.web3 = new Web3(web3.currentProvider);
    }
    // Non-dapp browsers...
    else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
    web3.eth.getAccounts(function (error, accounts) {
        if(!error){
            var account=accounts[0];
        }else{
            console.log(error)
        }
    })
    
    $('#sendSign').click(function () {
        web3.eth.getAccounts(function (error, accounts) {
            var term=web3.sha3("茲同意以下條款:");
            if (!error) {
                web3.eth.sign(accounts[0],term,function(err,sig){
                    if(!err){
                        $('#term').hide();
                        $('#button').hide();
                        $('#signform').show();
                        $('#signature').val(sig);
                    }else{
                        console.log(err)
                    }
                    
                });
                
                
            } else {
                console.log(error)
            }

        })
        return false;
    })
})
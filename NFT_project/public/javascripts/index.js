
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
    web3.eth.getAccounts(function(error,accounts){
        web3.eth.getBalance(accounts[0], function (error, bal) {
            if (!error) {
                $('#addr').text(accounts[0]);
                $('#bal').text(bal / 10 ** 18);
            } else {
                console.log(error)
            }
        })
    })
    $('#createSign').click(function(){
        var token = $('#tokenAddr').val();
        var transferSig = "0x48664c16";
        var delegate = $('#delegate').val();
        var amount = $('#amount').val();
        var fee = $('#fee').val();
        var nonce = $('#nonce').val();
        console.log(token)
        console.log(delegate)
        console.log(amount)
        console.log(fee)
        console.log(nonce)
        web3.eth.getAccounts(function(error,accounts){
            
            contract.recoverPreSignedHash(contractAddress, transferSig, delegate, amount, fee, nonce, function (error, hash) {
                if (!error) {
                    console.log(hash)
                    
                    web3.eth.sign(accounts[0], hash, function (error, signature) {
                        $('#sig').show()
                        $('#signature').text(signature);
                        $('#sigfortrans').val(signature);
                    })
                    

                } else {
                    console.log(error)
                }
            })

        })
        return false;
    })
    $('#transferpresigned').click(function(){
        var amount = $('#amount').val();
        var fee = $('#fee').val();
        var nonce = $('#nonce').val();
        var to = $('#to').val();
        var sig = $('#sigfortrans').val();
        web3.eth.getAccounts(function(error,accounts){
            contract.transferPreSigned(sig,to,amount,fee,nonce,function(error,hash){
                if(!error){
                    console.log(hash)
                    $('transspan').show();
                    $('#transhash').text(hash);
                }else{
                    console.log(error)
                }
            })

        })
        return false;
    })
    $('#transfer_eth').click(function () {
        
        web3.eth.getAccounts(function(error,accounts){
            var to = $('#to_addr').val();
            var val = $('#to_val').val() * 10 ** 18;
            console.log(to)
            console.log(val)
            var trans = { "from": accounts[0], "to": to, "value": val };
            web3.eth.sendTransaction(trans, function (error, hash) {
                if (!error) {
                    $('#txspan').show()
                    $('#txhash').text(hash);
                    console.log(hash)
                } else {
                    console.log(error)
                }
            })
        })
        return false;
    })
        
})
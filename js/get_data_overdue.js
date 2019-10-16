function addBalance(){
    id = window.location.href.split('=')[1];
var balance =$("#lBalanceTot").html()
if (balance.includes("(")){
    balance1=balance.split(".")
    balance2=""
    for (let index = 1; index < balance1.length; index++) {
        balance2+=balance1[index]
    }
    balance5=balance2.split(",-")[0]
    balance4=balance5.split(" ")[1]
    // paymentRef = firebase.database().ref().child("tenant-room");
    // paymentRef.on('child_added', function(snapshot) {
    //     var id=snapshot.key
        contract = firebase.database().ref().child("payment/"+id+"");
            contract.update({
                "balance":balance4
            });
    // })
}
else{
    contract = firebase.database().ref().child("payment/"+id+"");
    contract.update({
        "balance":0
    });
}
}
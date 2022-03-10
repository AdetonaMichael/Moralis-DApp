
// connect to Moralis server
const serverUrl = "https://0wh8onlc9338.usemoralis.com:2053/server";
const appId = "EuariaMnbmC94OzcX9cs2l8KBvfVihLMTdIEXAk1";
Moralis.start({ serverUrl, appId });

let homepage = "http://127.0.0.1:5500/signin.html";
if(Moralis.User.current() == null && window.location.href != homepage){
    document.querySelector('body').style.display = 'none';
    window.location.href = "signin.html";
}

login = async () =>{
   await Moralis.authenticate().then(async function (user) {
        console.log("you are successfully.. loggedin")
        // getting the current user information
        user.set("username", document.getElementById("username").value);
        user.set("email", document.getElementById("email").value);
        await user.save();
        window.location.href = "dashboard.html";
    })

}

logout = async () => {
    await Moralis.User.logOut();
    window.location.href = "signin.html";
}

getTransactions = async ()=>{
   // get BSC transactions for a given address
  // with most recent transactions appearing first
    const options = {
    chain: "ropsten",
    address: "0x3459f688066E251499D5AD948dA9c3aA0e15e890",
  };
  const transactions = await Moralis.Web3API.account.getTransactions(options);
  console.log(transactions);
  if(transactions.total >0){
      let table = `
      <table class="table table-striped">
      <thead>
         <tr>
             <th scope = "col">Transaction</th>
             <th scope = "col">Block Number</th>
             <th scope = "col">Age</th>
             <th scope = "col">Type</th>
             <th scope = "col">Fee</th>
             <th scope = "col">Value</th> 
         </tr>
      </thead>
      <tbody id="theTransactions">

      </tbody>
      </table>
      `
      document.getElementById('tableoftransactions').innerHTML = table;

      transactions.result.forEach(element => {
           let content = `
           <tr>
           <td><a href="https://ropsten.etherscan.io/tx/${element.hash}" target="_blank" rel="noopener noreferrer">${element.hash}</a></td>
           <td>${element.block_number}</td>
           <td>${element.block_timestamp}</td>
           <td>${element.from_address}</td>
           <td>${((element.gas * element.gas_price)/1e18).toFixed(5)} ETH</td>
           <td>${(element.value/ 1e18).toFixed(5)} ETH</td> 
       </tr>
           `
           theTransactions.innerHTML += content;
      });
  }
}
if(document.getElementById("btn-login") != null){
    document.getElementById("btn-login").onclick = login;
}
if(document.getElementById("btn-logout") != null){
    document.getElementById("btn-logout").onclick = logout;
}
if(document.querySelector('#get-transactions-link') != null){
    document.querySelector('#get-transactions-link').onclick = getTransactions;
}




// get-transactions-link
// get-balance-link
// get-nfts-link


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
           <td><a href="https://rinkeby.etherscan.io/block/${element.block_number}' target="_blank" rel="noopener noreferrer">${element.block_number}</a></td>
           <td>${millisecondsToTime(Date.parse(new Date()) - Date.parse(element.block_timestamp))}</td>
           <td>${element.from_address == Moralis.User.current().get('ethAddress') ? 'Outgoing':'Incoming'}</td>
           <td>${((element.gas * element.gas_price)/1e18).toFixed(5)} ETH</td>
           <td>${(element.value/ 1e18).toFixed(5)} ETH</td> 
       </tr>
           `
           theTransactions.innerHTML += content;
      });
  }
}

 getBalances = async()=>{
// get BSC native balance for a given address

const ethbalance = await Moralis.Web3API.account.getNativeBalance({chain:""});
const ropstenbalance = await Moralis.Web3API.account.getNativeBalance({chain:"ropsten"});
const rinkebybalance = await Moralis.Web3API.account.getNativeBalance({options:"rinkeby"});
console.log((ethbalance.balance/1e18).toFixed(5)+ " ETH");
console.log((ropstenbalance.balance/1e18).toFixed(5)+ " ETH");
console.log((rinkebybalance.balance/1e18).toFixed(5)+ " ETH");

let content = document.querySelector('#userbalances').innerHTML = `
<table class="table table-striped">
<thead>
   <tr>
       <th scope = "col">Chain</th>
       <th scope = "col">Balance</th>
   </tr>
</thead>
<tbody>
    <tr>
       <th>Ether</th>
       <td>${(ethbalance.balance/1e18).toFixed(5)} ETH</td>
    </tr>
    <tr>
       <th>Ether</th>
       <td>${(ropstenbalance.balance/1e18).toFixed(5)} ETH</td>
    </tr>
    <tr>
       <th>Ether</th>
       <td>${(rinkebybalance.balance/1e18).toFixed(5)} ETH</td>
    </tr>
</tbody>
<tbody id="theTransactions">

</tbody>
</table>
`
}
getnfts = async()=>{
    let nfts =  await Moralis.Web3API.account.getNFTs({chain: "rinkeby"});
    console.log(nfts);
    let tableofNFTs = document.querySelector('#tableofnfts');
    if(nfts.result.length > 0){
        nfts.result.forEach(n=>{
          let metadata =  JSON.parse(n.metadata);
          let content =    `
            <div class="card col-md-3" style="width: 18rem;">
    <img src="${fixURL(metadata.image_url)}" height=300 class="card-img-top" alt="nft image">
    <div class="card-body">
        <h5 class="card-title">${metadata.name}</h5>
        <p class="card-text">${metadata.description}</p>

    </div>
    </div>
          `
          tableofNFTs.innerHTML += content;
        });
    };
}
fixURL = (url)=>{
    if(url.startsWith("ipfs")){
        return "https://ipfs.moralis.io:2053/ipfs/"+url.split("ipfs://").slice(-1)
    }else{
        return url +"?format=json"
    }
}
// currenttime(ms) - BlockTime(ms) = Time in Millseconds
millisecondsToTime = (ms)=>{
    let minutes = Math.floor((ms/(1000*60)));
    let hours   = Math.floor((ms/(1000*60*60)));
    let days    = Math.floor((ms/(1000*60*60*24)));
    if(days < 1){
        if(hours <1){
            if(minutes <1){
                return `less than a minute ago`
            } else return `${minutes} minutes(s) ago`
        }else return `${hours} hours(s) ago`
    }else  return `${days} days(s) ago`
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
if(document.querySelector('#get-balance-link') != null){
    document.querySelector('#get-balance-link').onclick = getBalances;
}
if(document.querySelector("#get-nfts-link") != null){
    document.querySelector("#get-nfts-link").onclick = getnfts;
}




// get-transactions-link
// get-balance-link
// get-nfts-link

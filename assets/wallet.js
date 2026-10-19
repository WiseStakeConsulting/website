/* Wise Stake Consulting - zero-backend wallet payment
   Connects the visitor's own wallet, prices the selected service
   in ETH at the live rate, and opens a prefilled EIP-681 payment
   request to wisestake.eth (Ethereum mainnet). No funds ever pass
   through this website. */
(function () {
  var PAYEE_ENS = "wisestake.eth";
  var CHAIN_ID = 1; // Ethereum mainnet

  var panel = document.getElementById("paypanel");
  var panelBody = document.getElementById("paypanel-body");
  var currentService = null;

  function haveWallet() {
    return typeof window.ethereum !== "undefined";
  }

  async function ethUsd() {
    var r = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd");
    var j = await r.json();
    return j.ethereum.usd;
  }

  function payLink(wei) {
    return "ethereum:" + PAYEE_ENS + "@1?value=" + wei;
  }

  async function startPay(service) {
    currentService = service;
    if (!haveWallet()) {
      panel.style.display = "block";
      panelBody.innerHTML =
        "<b>No wallet detected in this browser.</b><br>" +
        "Install MetaMask (metamask.io) and reload, or pay by card below, " +
        "or send the exact amount manually from any wallet to <b>" + PAYEE_ENS + "</b> " +
        "on Ethereum mainnet, then email hello@wisestake.consulting to confirm.";
      return;
    }
    panel.style.display = "block";
    panelBody.innerHTML = "Connecting wallet...";
    try {
      var accts = await window.ethereum.request({ method: "eth_requestAccounts" });
      var chain = await window.ethereum.request({ method: "eth_chainId" });
      if (parseInt(chain, 16) !== CHAIN_ID) {
        panelBody.innerHTML = "Your wallet is on the wrong network. Please switch to <b>Ethereum Mainnet</b>, then try again.";
        return;
      }
      panelBody.innerHTML = "Fetching live ETH rate...";
      var usd = await ethUsd();
      var ethAmt = service.usd / usd;
      var wei = BigInt(Math.round(ethAmt * 1e12)) * BigInt(1e6); // keep precision
      var acct = accts[0].slice(0, 6) + "..." + accts[0].slice(-4);
      panelBody.innerHTML =
        "<div>Connected: <b>" + acct + "</b></div>" +
        "<div style='margin-top:8px'>Service: <b>" + service.name + "</b></div>" +
        "<div class='amt'>" + ethAmt.toFixed(6) + " ETH <small style='font-size:12px'>(~$" + service.usd + " at the live rate)</small></div>" +
        "<div style='margin-top:6px;color:#5c6676'>Payment goes directly to <b>" + PAYEE_ENS + "</b> on Ethereum mainnet. This site never touches your funds. You will confirm the exact amount in your wallet.</div>" +
        "<div class='btn-row'><a class='btn btn-gold' href='" + payLink(wei) + "'>Open in wallet & pay</a>" +
        "<button class='btn btn-outline' id='copyaddr'>Copy " + PAYEE_ENS + "</button></div>";
      document.getElementById("copyaddr").onclick = function () {
        navigator.clipboard.writeText(PAYEE_ENS);
        this.textContent = "Copied";
      };
    } catch (e) {
      panelBody.innerHTML = "Could not complete: " + e.message + " - or email hello@wisestake.consulting and we will invoice you.";
    }
  }

  document.querySelectorAll("[data-service-usd]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      startPay({
        name: btn.getAttribute("data-service-name"),
        usd: parseFloat(btn.getAttribute("data-service-usd"))
      });
    });
  });
})();

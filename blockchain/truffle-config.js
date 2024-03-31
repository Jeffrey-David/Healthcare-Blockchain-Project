module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*", // Match any network id
      gas: 6721975 // Gas limit used for deploys
    }
  },
  compilers: {
    solc: {
      version: "0.8.13", // Use a compatible Solidity version
      // More options as needed
    }
  },
  contracts_build_directory: "../frontend/src/contracts",
};

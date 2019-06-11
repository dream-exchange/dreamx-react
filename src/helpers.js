import _ from "lodash";
import singletons from "./singletons";

export const getNetworkNameFromId = networkId => {
  networkId = parseInt(networkId);
  const networks = { mainnet: 1, kovan: 42, ropsten: 3, rinkeby: 4 };
  for (let network in networks) {
    if (networks[network] === networkId) {
      return network;
    }
  }
};

export const extractKeysFromObject = (object, keys) => {
  let newObject = {};
  for (let key of keys) {
    newObject[key] = object[key];
  }
  return newObject;
};

export const capitalize = string => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const getOnchainBalanceAsync = async (accountAddress, tokenSymbol) => {
  return new Promise(async (resolve, reject) => {
    const { web3, tokens } = singletons;

    let balance;
    if (tokenSymbol === "ETH") {
      balance = await web3.eth.getBalance(accountAddress);
    } else {
      const token = tokens[tokenSymbol];
      balance = await token.methods.balanceOf(accountAddress).call();
    }

    resolve(balance);
  });
};

export const round = num => {
  return Math.round(parseFloat(num) * 100000000) / 100000000;
};

export const roundFixed = (num, decimalPoints) => {
  if (!decimalPoints) {
    decimalPoints = 8;
  }

  return parseFloat(parseFloat(num).toFixed(decimalPoints)).toString();
};

export const truncateNumberOutput = (num, decimalPoints = 8) => {
  const trailingZeroes = /0*$|\.0*$/;
  let [whole, fraction] = num.toString().split(".");
  fraction = fraction ? fraction.substring(0, decimalPoints) : "";
  const result = fraction
    ? `${whole}.${fraction}`.replace(trailingZeroes, "")
    : whole;
  return result;
};

export const truncateNumberInput = (
  num,
  significantFigures = 8,
  decimalPoints = 8
) => {
  if (!num) {
    return ""
  }
  const leadingZeroes = /^0*/;
  let [whole, fraction] = num.toString().split(".");
  whole = whole.replace(leadingZeroes, "");
  whole = whole ? whole.substring(0, significantFigures) : "0";
  fraction = fraction !== undefined ? fraction.substring(0, decimalPoints) : undefined;
  const result = fraction !== undefined ? `${whole}.${fraction}` : whole;
  if (isNaN(result)) {
    return ""
  }
  return result;
};

export const convertKeysToCamelCase = obj => {
  const keys = Object.keys(obj);
  for (let key of keys) {
    const camelCaseKey = _.camelCase(key);
    if (camelCaseKey === key) {
      continue;
    }
    obj[camelCaseKey] = obj[key];
    delete obj[key];
  }
  return obj;
};

export const getEtherscanTransaction = (transactionHash, networkName) => {
  let result;
  if (networkName === "mainnet") {
    result = `https://etherscan.io/tx/${transactionHash}`;
  } else {
    result = `https://${networkName}.etherscan.io/tx/${transactionHash}`;
  }
  return result;
};

function desc(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

export function stableSort(rawArray, cmp) {
  const stabilizedThis = rawArray.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

export function getSorting(order, orderBy) {
  return order === "desc"
    ? (a, b) => desc(a, b, orderBy)
    : (a, b) => -desc(a, b, orderBy);
}

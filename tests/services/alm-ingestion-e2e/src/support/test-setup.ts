import axios from "axios";

module.exports = async function () {
  // Cấu hình cơ bản cho axios
  axios.defaults.timeout = 10000;
};

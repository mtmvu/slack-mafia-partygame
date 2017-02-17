let utils = {
  sleep(time, text = "") {
    var promise = new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(text);
      }, time * 1000);
    });
    return promise;
  }
}

export default utils
export let {
  sleep
} = utils

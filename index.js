const axios = require("axios");
const mainHref = `https://swapi.dev/api/people/?search=`;
const words = process.argv.slice(2);
(async () => {
  if (words.length <= 0) {
    console.log("Please, enter some data");
    process.exit(100);
  }
  const allList = await Promise.all(
    words.map((word) => {
      return axios
        .get(`${mainHref}${word.split(" ").join("+")}`)
        .then((e) => {
          if (e.data.count == 0) {
            console.log(`No results found for '${word}'.`);
          }
          return e.data;
        })
        .catch((e) => {
          console.log(e.response.statusText);
          return [];
        });
    })
  );
  let total = allList.filter((e) => !!e.results.length).map((e) => e.count);
  total = total.length ? total.reduce((a, b) => a + b) : 0;
  if (total) {
    let nameList = allList.map((e) => e.results.map((e) => e.name)).filter((e) => !!e.length);
    nameList = makeOneArray(nameList);
    nameList.sort();
    const allHeights = makeOneArray(
      allList.map((e) => e.results.map((e) => [e.name, e.height])).filter((e) => !!e.length)
    );
    const minHeight = arrayMin(allHeights);
    const maxHeight = arrayMax(allHeights);

    console.log(`\nTotal results: ${total}.\n\nAll: ${nameList.join(", ")}.\n
Min height: ${minHeight.join(", ")} cm.\n\nMax height ${maxHeight.join(", ")} cm.\n`);
  }
})();

function makeOneArray(array) {
  return array[0].concat(...array.slice(1));
}

function arrayMin(arr) {
  arr.sort((a, b) => parseInt(a[1]) - parseInt(b[1]));
  return arr[0];
}

function arrayMax(arr) {
  arr.sort((a, b) => parseInt(b[1]) - parseInt(a[1]));
  return arr[0];
}

// const myPromise = new Promise((resolve, reject) => {
//     setTimeout(() => {
//         resolve('Data was return from the server');
//     }, 3000);
//     setTimeout(() => {
//         reject('No data for you');
//     }, 5000);
// })

// myPromise
// .then(result => console.log(result))
// .catch(err => console.log(err))

const first_names = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve(['Uri','Kobi','Adam','Pavel']);
    }, 2000);
    setTimeout(() => {
        reject('No data for you');
    }, 3000);
})

const last_names = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve(['Kupfer','Biton','Ziadna','Shinko']);
    }, 2000);
    setTimeout(() => {
        reject('No data for you');
    }, 5000);
})

Promise.all([first_names, last_names])
.then(result => console.log(result))
.catch(err => console.log(err))

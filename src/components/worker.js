export default () => {
    self.addEventListener('message', e => { // eslint-disable-line no-restricted-globals
        // console.log('IN WORKER');
        if (!e) return;
        const [chillCount, chillRate] = e.data;
        postMessage(chillCount + chillRate);
    });
}
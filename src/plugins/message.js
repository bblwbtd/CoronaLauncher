
const observers = []

export const subscribe = (onMessage) => {
    observers.push(onMessage)
}

export default {
    install: (vueIns) => {
       vueIns.prototype.info = (message) => {
           observers.forEach(observer => observer(message))
       }
    }
}
export const reverse = (array: any[]) => {
    let newArray = []

    for (let i = array.length - 1; i >= 0; i--) {
        newArray.push(array[i])
    }

    return newArray
}
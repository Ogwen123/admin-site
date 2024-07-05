export const reverse = (array: any[]) => {
    let newArray = []

    for (let i = array.length - 1; i >= 0; i--) {
        newArray.push(array[i])
    }

    return newArray
}

export const title = (str: string, replace_underscores: boolean = true) => {

    const overrides = {
        "id": "ID"
    }

    if (Object.keys(overrides).includes(str)) {
        return overrides[str as keyof typeof overrides]
    }

    if (replace_underscores) {
        str = str.replace(/_/g, " ")
    }

    let buffer = ""

    for (let i of str) {
        if (buffer.length === 0 || buffer[buffer.length - 1] === ' ') {
            buffer += i.toUpperCase()
        } else {
            buffer += i
        }
    }

    return buffer
}
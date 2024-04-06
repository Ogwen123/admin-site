import { Permissions } from "../global/types"

export const flagBFToPerms = (bf: number, permissions: Permissions) => {
    let perms: string[] = []

    for (let i of Object.keys(permissions)) {
        const j = parseInt(i)
        if ((j & bf) === j) {
            perms.push(permissions[j])
        }
    }

    return perms
}
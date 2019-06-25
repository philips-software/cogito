export const getIdentityName = state => state.identity.name
export const isCreatingIdentity = state => state.identity.creating
export const wasIdentityCreated = state => !!state.identity.wallet

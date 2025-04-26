import passport from 'passport'

export const accessTokenValidation = passport.authenticate('jwt', { session: false })

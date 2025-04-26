import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import { AuthRequestError, BadRequestError } from '~/core/error.response'
import { User } from '~/entities/user.entity'
import { userRepository } from '~/repositories/user.repository'
import { compareBcrypt } from '~/utils/jwt'
import { env } from 'process'
import { TokenType } from '~/constants/token'
import { TokenPayload } from '~/dto/common.dto'
import { OAuthStrategyFactory } from '~/services/passport.service'
import { OAUTH_PROVIDER } from '~/constants/oauth'

// Login username/password
passport.use(
  new LocalStrategy(
    {
      usernameField: 'identifier',
      passwordField: 'password',
      session: false
    },
    async (identifier, password, done) => {
      try {
        const foundUser = (await userRepository
          .findUserAndJoinRole({ selectFields: ['user.id', 'user.status', 'user.password', 'role.id'] })
          .where('user.email = :email', { email: identifier })
          .orWhere('user.username = :username', { username: identifier })
          .getOne()) as User

        if (!foundUser || !compareBcrypt(password, foundUser.password)) {
          throw new BadRequestError('Username or password incorrect!')
        }

        return done(null, foundUser)
      } catch (err) {
        return done(err)
      }
    }
  )
)

// Authenticate by JWT
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: env.JWT_SECRET_KEY as string
    },
    async (payload, done) => {
      try {
        // set User
        const { userId, tokenType } = payload as TokenPayload

        //check type token
        if (tokenType != TokenType.accessToken) throw new BadRequestError('Token invalid!')

        const foundUser = await userRepository.findUserAndJoinRole().where('user.id = :id', { id: userId }).getOne()

        if (!foundUser) throw new AuthRequestError('Please log in again!')

        return done(null, foundUser)
      } catch (err) {
        done(err, false)
      }
    }
  )
)

//OAuthFactory

// Login google
OAuthStrategyFactory.create({
  provider: OAUTH_PROVIDER.GOOGLE,
  clientID: env.GOOGLE_CLIENT_ID as string,
  clientSecret: env.GOOGLE_CLIENT_SECRET as string,
  callbackURL: env.GOOGLE_CALLBACK_URL as string,
  scope: ['profile', 'email'],
  getProfile: async (profile) => {
    const email = profile.emails?.[0]?.value
    const fullName = profile.displayName
    return { email, fullName }
  }
})

export enum Resource {
  USER = 'user',
  ROLE = 'role',
  PERMISSION = 'permission',
  WORD = 'word',
  TOPIC = 'topic',
  COURSE = 'course'
}

export enum Action {
  CREATE_ANY = 'create:any',
  UPDATE_ANY = 'update:any',
  READ_ANY = 'read:any',
  DELETE_ANY = 'delete:any',
  CREATE_OWN = 'create:own',
  UPDATE_OWN = 'update:own',
  READ_OWN = 'read:own',
  DELETE_OWN = 'delete:own'
}

export enum RoleName {
  USER = 'user',
  ADMIN = 'admin'
}
